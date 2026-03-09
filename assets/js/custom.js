const LIVE2D_WIDGET_URL =
  "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@v0.9.0/autoload.js";
const ENABLE_LIVE2D = false;
const ENABLE_MUSIC_PLAYER = true;

function resolveAssetUrl(relativePath) {
  if (document.currentScript && document.currentScript.src) {
    return new URL(relativePath, document.currentScript.src).href;
  }
  return relativePath;
}

const MEDIUM_ZOOM_URL = resolveAssetUrl("./lib/medium-zoom/medium-zoom.min.js");
const APLAYER_CSS_URL = resolveAssetUrl("./lib/aplayer/APlayer.min.css");
const APLAYER_JS_URL = resolveAssetUrl("./lib/aplayer/APlayer.min.js");
const SEARCH_DATA_URL = resolveAssetUrl("./data/search.json");
const SITE_BASE_PATH = new URL("../../", resolveAssetUrl("./custom.js")).pathname;

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initLive2D() {
  if (!ENABLE_LIVE2D) return;
  const script = document.createElement("script");
  script.src = LIVE2D_WIDGET_URL;
  document.head.appendChild(script);
}

function initReadingProgress() {
  const progressBar = document.createElement("div");
  progressBar.id = "reading-progress-bar";
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    transition: width 0.2s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.documentElement.scrollHeight - windowHeight,
      1
    );
    const scrolled = window.scrollY;
    const progress = Math.min(100, Math.max(0, (scrolled / documentHeight) * 100));
    progressBar.style.width = `${progress}%`;
  });
}

function initImageLightbox() {
  if (!document.querySelector("article img")) return;
  const script = document.createElement("script");
  script.src = MEDIUM_ZOOM_URL;
  script.onload = function () {
    mediumZoom("article img", {
      margin: 24,
      background: "rgba(0, 0, 0, 0.9)",
      scrollOffset: 0
    });
  };
  document.head.appendChild(script);
}

function initMusicPlayer() {
  if (!ENABLE_MUSIC_PLAYER) return;
  const config = getPageMusicConfig();
  if (!config) return;

  const playerContainer = document.createElement("div");
  playerContainer.id = "music-player";
  playerContainer.className =
    config.mode === "floating"
      ? "music-player-shell is-floating"
      : "music-player-shell is-embedded";

  if (config.mode === "floating") {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    document.body.appendChild(playerContainer);
  } else {
    const content = document.querySelector("article .content");
    if (!content) return;
    if (config.position === "bottom") {
      content.appendChild(playerContainer);
    } else {
      content.insertBefore(playerContainer, content.firstChild);
    }
  }

  ensureAPlayerStylesheet();

  loadAPlayerScript()
    .then(() => {
      const player = new APlayer({
        container: playerContainer,
        mini: Boolean(config.mini),
        autoplay: Boolean(config.autoplay),
        theme: config.theme,
        loop: config.loop,
        order: config.order,
        preload: config.preload,
        volume: config.volume,
        mutex: true,
        listFolded: config.listFolded,
        listMaxHeight: config.listMaxHeight,
        audio: config.tracks
      });

      player.on("error", () => {
        console.warn("[music-player] Audio resource failed to load.");
      });
    })
    .catch(() => {
      console.warn("[music-player] Failed to load APlayer script:", APLAYER_JS_URL);
    });
}

function ensureAPlayerStylesheet() {
  if (document.querySelector('link[data-aplayer-style="1"]')) return;
  const aplcss = document.createElement("link");
  aplcss.rel = "stylesheet";
  aplcss.href = APLAYER_CSS_URL;
  aplcss.dataset.aplayerStyle = "1";
  document.head.appendChild(aplcss);
}

function loadAPlayerScript() {
  if (window.APlayer) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-aplayer-script="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("APlayer script failed")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = APLAYER_JS_URL;
    script.dataset.aplayerScript = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("APlayer script failed"));
    document.head.appendChild(script);
  });
}

function normalizeTrackUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) return url;
  if (url.startsWith("/")) {
    const base = SITE_BASE_PATH.endsWith("/") ? SITE_BASE_PATH.slice(0, -1) : SITE_BASE_PATH;
    return `${base}${url}`;
  }
  return url;
}

function getPageMusicConfig() {
  const node = document.getElementById("page-music-player-config");
  if (!node) return null;

  try {
    const raw = JSON.parse(node.textContent || "{}");
    if (!raw || raw.enabled === false) return null;

    const tracks = Array.isArray(raw.tracks)
      ? raw.tracks
          .map((track) => ({
            name: track.name || "Untitled",
            artist: track.artist || "Unknown",
            url: normalizeTrackUrl(track.url),
            cover: normalizeTrackUrl(track.cover || "")
          }))
          .filter((track) => track.url)
      : [];

    if (!tracks.length) return null;

    const volume = Number(raw.volume);
    return {
      mode: raw.mode === "floating" ? "floating" : "embed",
      position: raw.position === "bottom" ? "bottom" : "top",
      mini: Boolean(raw.mini),
      autoplay: Boolean(raw.autoplay),
      theme: raw.theme || "#ff7a18",
      loop: raw.loop || "all",
      order: raw.order || "list",
      preload: raw.preload || "none",
      volume: Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : 0.6,
      listFolded: raw.list_folded !== false,
      listMaxHeight: Number(raw.list_max_height) || 220,
      tracks
    };
  } catch (error) {
    console.warn("[music-player] Invalid page config JSON.");
    return null;
  }
}

function applyReadingMode(enabled, button) {
  document.body.classList.toggle("reading-mode", enabled);
  button.textContent = enabled ? "Exit Reading" : "Reading Mode";
  localStorage.setItem("reading_mode", enabled ? "1" : "0");
}

function initReadingModeToggle() {
  if (!document.querySelector("article")) return;
  const button = document.createElement("button");
  button.id = "reading-mode-toggle";
  button.type = "button";
  document.body.appendChild(button);

  const enabled = localStorage.getItem("reading_mode") === "1";
  applyReadingMode(enabled, button);

  button.addEventListener("click", () => {
    applyReadingMode(!document.body.classList.contains("reading-mode"), button);
  });
}

function textTokens(query) {
  const normalized = query.trim().toLowerCase();
  const rawWords = normalized.split(/\s+/).filter(Boolean);
  const cjk = normalized.match(/[\u4e00-\u9fff]/g) || [];
  const cjkBigrams = [];
  for (let i = 0; i < cjk.length - 1; i += 1) {
    cjkBigrams.push(cjk[i] + cjk[i + 1]);
  }
  return Array.from(new Set([...rawWords, ...cjk, ...cjkBigrams]));
}

function renderSearchPlusResults(target, results) {
  if (!results.length) {
    target.innerHTML = '<p class="text-muted mb-0">No results.</p>';
    return;
  }

  target.innerHTML = results
    .map((item) => {
      const snippet = escapeHtml(item.snippet || "").slice(0, 180);
      return `
        <div class="search-plus-result-item">
          <a href="${item.url}"><strong>${escapeHtml(item.title)}</strong></a>
          <div class="small text-muted mt-1">${escapeHtml(item.meta)}</div>
          <p class="mb-0 mt-1">${snippet}</p>
        </div>
      `;
    })
    .join("");
}

function initSearchPlus() {
  const input = document.getElementById("search-plus-input");
  const resultWrap = document.getElementById("search-plus-results");
  if (!input || !resultWrap) return;

  let docs = [];
  fetch(SEARCH_DATA_URL)
    .then((res) => res.json())
    .then((data) => {
      docs = data;
      resultWrap.innerHTML = `<p class="text-muted mb-0">Loaded ${docs.length} documents.</p>`;
    })
    .catch(() => {
      resultWrap.innerHTML = '<p class="text-danger mb-0">Failed to load search index.</p>';
    });

  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (!query) {
      resultWrap.innerHTML = '<p class="text-muted mb-0">Type to search.</p>';
      return;
    }

    const tokens = textTokens(query);
    const loweredQuery = query.toLowerCase();

    const ranked = docs
      .map((doc) => {
        const title = (doc.title || "").toLowerCase();
        const tags = (doc.tags || "").toLowerCase();
        const categories = (doc.categories || "").toLowerCase();
        const content = (doc.content || "").toLowerCase();

        let score = 0;
        if (title.includes(loweredQuery)) score += 60;
        if (tags.includes(loweredQuery)) score += 20;
        if (categories.includes(loweredQuery)) score += 12;
        if (content.includes(loweredQuery)) score += 6;

        for (const token of tokens) {
          if (!token) continue;
          if (title.includes(token)) score += 15;
          if (tags.includes(token)) score += 8;
          if (categories.includes(token)) score += 5;
          if (content.includes(token)) score += 2;
        }

        return {
          ...doc,
          score,
          snippet: doc.content || "",
          meta: [doc.date, doc.categories, doc.tags].filter(Boolean).join(" | ")
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    renderSearchPlusResults(resultWrap, ranked);
  });
}

function initAnalyticsDashboard() {
  const root = document.getElementById("analytics-dashboard");
  const postData = document.getElementById("analytics-posts-json");
  if (!root || !postData) return;

  const goatId = root.dataset.goatcounter;
  if (!goatId) {
    root.innerHTML = '<p class="text-danger mb-0">GoatCounter ID is missing.</p>';
    return;
  }

  let posts = [];
  try {
    posts = JSON.parse(postData.textContent || "[]");
  } catch (error) {
    root.innerHTML = '<p class="text-danger mb-0">Invalid post index data.</p>';
    return;
  }

  const endpoint = (path) =>
    `https://${goatId}.goatcounter.com/counter/${encodeURIComponent(path.replace(/\/$/, ""))}.json`;

  root.innerHTML = '<p class="text-muted mb-0">Loading pageview metrics...</p>';

  Promise.all(
    posts.map((post) =>
      fetch(endpoint(post.path))
        .then((res) => res.json())
        .then((data) => ({
          ...post,
          count: Number(String(data.count || "0").replace(/[^\d]/g, "")) || 0
        }))
        .catch(() => ({ ...post, count: 0 }))
    )
  ).then((metrics) => {
    const totalViews = metrics.reduce((sum, item) => sum + item.count, 0);
    const topPosts = [...metrics].sort((a, b) => b.count - a.count).slice(0, 10);

    root.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="small text-muted">Tracked posts</div>
          <div><strong>${metrics.length}</strong></div>
        </div>
        <div class="analytics-card">
          <div class="small text-muted">Total pageviews</div>
          <div><strong>${new Intl.NumberFormat().format(totalViews)}</strong></div>
        </div>
      </div>
      <div class="analytics-card">
        <h4 class="mt-0">Top Posts</h4>
        <ol class="mb-0">
          ${topPosts
            .map(
              (post) =>
                `<li><a href="${post.url}">${escapeHtml(post.title)}</a> <span class="text-muted">(${new Intl.NumberFormat().format(post.count)})</span></li>`
            )
            .join("")}
        </ol>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initLive2D();
  initReadingProgress();
  initImageLightbox();
  initReadingModeToggle();
  initSearchPlus();
  initAnalyticsDashboard();
  initMusicPlayer();
});
