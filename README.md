# myblog

个人博客仓库，基于 `Jekyll + Chirpy`。

## 人类核心标准

唯一核心文档（Single Source of Truth）：

- `_posts/2026-03-09-config-zh-cn.md`
- GitHub URL: <https://github.com/Moloch0/myblog/blob/main/_posts/2026-03-09-config-zh-cn.md>

说明：该文档是“人类标准核心文档”，有且仅有这一个。其他说明文件若与其冲突，以该文档为准。

## 仓库结构

- `_posts/`: 已发布文章
- `_writing/`: 临时写作输入目录（由同步脚本消费）
- `tools/`: 本地开发与同步脚本
- `_includes/`, `assets/`: 主题扩展与前端资源
- `.githooks/`: pre-commit 钩子（自动同步 `_writing`）
- `docs/`: 工程导航文档（非人类核心标准）

## 本地开发

```bash
bash tools/run.sh
bash tools/test.sh
```

如果 `htmlproofer` 缺失：

```bash
bundle config unset without
bundle install
```

## 写作同步流

1. 在 `_writing/*.md` 写稿
2. `git commit` 触发 `.githooks/pre-commit`
3. 执行 `python tools/sync_posts.py`
4. 文章生成到 `_posts/`，源文件按配置删除

初始化（每个 clone 一次）：

```bash
git config core.hooksPath .githooks
```

## 参考

- 工程导航：`docs/REPO-OPERATIONS.md`
- Chirpy 官方文档：<https://github.com/cotes2020/jekyll-theme-chirpy/wiki>
