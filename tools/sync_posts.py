#!/usr/bin/env python3
"""Sync markdown files from a writing folder into Jekyll _posts."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = {
    "source_dir": "_writing",
    "target_dir": "_posts",
    "timezone": "+08:00",
    "pattern": "*.md",
    "track_sync_source": False,
    "delete_source_after_sync": True,
    "remove_stale_synced_posts": False,
}
FRONT_MATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)
SYNC_SOURCE_RE = re.compile(r'^sync_source:\s*["\']?(.*?)["\']?\s*$', re.MULTILINE)
TITLE_RE = re.compile(r'^title:\s*(.*?)\s*$', re.MULTILINE)
DATE_RE = re.compile(r'^date:\s*(.*?)\s*$', re.MULTILINE)


def load_config() -> dict:
    path = REPO_ROOT / ".blog-sync.json"
    config = dict(DEFAULT_CONFIG)
    if path.exists():
        with path.open("r", encoding="utf-8") as f:
            user_config = json.load(f)
        config.update(user_config)
    if os.getenv("BLOG_SOURCE_DIR"):
        config["source_dir"] = os.environ["BLOG_SOURCE_DIR"]
    return config


def parse_timezone(tz_str: str) -> timezone:
    match = re.fullmatch(r"([+-])(\d{2}):?(\d{2})", tz_str.strip())
    if not match:
        raise ValueError(f"Invalid timezone format: {tz_str}")
    sign, hh, mm = match.groups()
    delta = timedelta(hours=int(hh), minutes=int(mm))
    if sign == "-":
        delta = -delta
    return timezone(delta)


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "post"


def parse_front_matter(content: str) -> tuple[str | None, str, str]:
    match = FRONT_MATTER_RE.match(content)
    if not match:
        return None, "", content
    front = match.group(1)
    body = content[match.end() :]
    return front, front, body


def extract_field(regex: re.Pattern[str], front: str) -> str | None:
    match = regex.search(front)
    if not match:
        return None
    value = match.group(1).strip()
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        return value[1:-1]
    return value


def parse_date(value: str, tz: timezone) -> datetime | None:
    value = value.strip()
    patterns = [
        "%Y-%m-%d %H:%M:%S %z",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]
    for pattern in patterns:
        try:
            dt = datetime.strptime(value, pattern)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=tz)
            return dt
        except ValueError:
            continue

    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=tz)
        return dt
    except ValueError:
        return None


def format_jekyll_date(dt: datetime) -> str:
    dt = dt.astimezone(dt.tzinfo or timezone.utc)
    return dt.strftime("%Y-%m-%d %H:%M:%S %z")


def ensure_front_matter(
    content: str,
    title: str,
    date_str: str,
    sync_source: str,
    track_sync_source: bool,
) -> str:
    _, front, body = parse_front_matter(content)
    escaped_title = title.replace('"', '\\"')
    sync_line = f'sync_source: "{sync_source}"'
    if front == "":
        new_front = [f'title: "{escaped_title}"', f"date: {date_str}"]
        if track_sync_source:
            new_front.append(sync_line)
        return f"---\n" + "\n".join(new_front) + f"\n---\n\n{body.lstrip()}"

    lines = front.splitlines()
    filtered = [line for line in lines if not line.startswith("sync_source:")]
    if not any(line.startswith("title:") for line in filtered):
        filtered.insert(0, f'title: "{escaped_title}"')
    if not any(line.startswith("date:") for line in filtered):
        filtered.append(f"date: {date_str}")
    if track_sync_source:
        filtered.append(sync_line)
    new_front = "\n".join(filtered)
    return f"---\n{new_front}\n---\n{body}"


def find_existing_synced_file(target_dir: Path, sync_source: str) -> Path | None:
    for post in target_dir.glob("*.md"):
        try:
            text = post.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        match = SYNC_SOURCE_RE.search(text)
        if match and match.group(1) == sync_source:
            return post
    return None


def git_add_posts(target_dir: Path) -> None:
    try:
        subprocess.run(
            ["git", "add", str(target_dir)],
            cwd=REPO_ROOT,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except (subprocess.SubprocessError, FileNotFoundError):
        pass


def main() -> int:
    config = load_config()
    tz = parse_timezone(config["timezone"])
    source_dir = (REPO_ROOT / config["source_dir"]).resolve()
    target_dir = (REPO_ROOT / config["target_dir"]).resolve()
    pattern = config["pattern"]
    track_sync_source = bool(config.get("track_sync_source", False))
    delete_source_after_sync = bool(config.get("delete_source_after_sync", True))
    remove_stale_synced_posts = bool(config.get("remove_stale_synced_posts", False))

    if not source_dir.exists():
        print(f"[sync-posts] skip: source dir not found: {source_dir}")
        return 0

    target_dir.mkdir(parents=True, exist_ok=True)
    changed = 0

    for source in sorted(source_dir.glob(pattern)):
        if not source.is_file():
            continue

        raw = source.read_text(encoding="utf-8-sig")
        _, front, _ = parse_front_matter(raw)
        title = extract_field(TITLE_RE, front) if front else None
        date_value = extract_field(DATE_RE, front) if front else None

        if not title:
            title = source.stem

        if date_value:
            dt = parse_date(date_value, tz)
        else:
            dt = None
        if dt is None:
            dt = datetime.fromtimestamp(source.stat().st_mtime, tz=tz)

        date_str = format_jekyll_date(dt)
        slug = slugify(title)
        target_name = f"{dt.strftime('%Y-%m-%d')}-{slug}.md"
        sync_source = source.relative_to(REPO_ROOT).as_posix()
        target_path = target_dir / target_name

        new_content = ensure_front_matter(
            raw,
            title,
            date_str,
            sync_source,
            track_sync_source=track_sync_source,
        )

        if track_sync_source:
            existing = find_existing_synced_file(target_dir, sync_source)
            if existing and existing != target_path:
                existing.unlink()
                changed += 1

        old_content = None
        if target_path.exists():
            old_content = target_path.read_text(encoding="utf-8")
        if old_content != new_content:
            with target_path.open("w", encoding="utf-8", newline="\n") as f:
                f.write(new_content)
            changed += 1
            print(f"[sync-posts] updated {target_path.relative_to(REPO_ROOT)}")

        if delete_source_after_sync:
            source.unlink()
            changed += 1
            print(f"[sync-posts] consumed {source.relative_to(REPO_ROOT)}")

    if track_sync_source and remove_stale_synced_posts:
        for post in target_dir.glob("*.md"):
            try:
                text = post.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            match = SYNC_SOURCE_RE.search(text)
            if not match:
                continue
            source_ref = match.group(1)
            source_path = (REPO_ROOT / source_ref).resolve()
            if not source_path.exists():
                post.unlink()
                changed += 1
                print(f"[sync-posts] removed stale {post.relative_to(REPO_ROOT)}")

    if changed:
        git_add_posts(target_dir)
        print(f"[sync-posts] done: {changed} file(s) changed")
    else:
        print("[sync-posts] done: no changes")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # pragma: no cover
        print(f"[sync-posts] error: {exc}", file=sys.stderr)
        raise
