const LIVE2D_WIDGET_URL =
  "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@v0.9.0/autoload.js";

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

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initLive2D() {
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
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const playerContainer = document.createElement("div");
  playerContainer.id = "music-player";
  playerContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9998;
    width: 300px;
  `;
  document.body.appendChild(playerContainer);

  const aplcss = document.createElement("link");
  aplcss.rel = "stylesheet";
  aplcss.href = APLAYER_CSS_URL;
  document.head.appendChild(aplcss);

  const aplscript = document.createElement("script");
  aplscript.src = APLAYER_JS_URL;
  aplscript.onload = function () {
    new APlayer({
      container: document.getElementById("music-player"),
      mini: true,
      autoplay: false,
      theme: "#667eea",
      loop: "all",
      order: "random",
      preload: "auto",
      volume: 0.7,
      mutex: true,
      listFolded: true,
      listMaxHeight: 90,
      audio: [
        {
          name: "Komorebi",
          artist: "m-taku",
          url: "https://music.163.com/song/media/outer/url?id=1357887232.mp3",
          cover:
            "https://p2.music.126.net/vf7c2GJsuyfSl2AAOvXgJA==/109951163068517608.jpg"
        },
        {
          name: "River Flows In You",
          artist: "Yiruma",
          url: "https://music.163.com/song/media/outer/url?id=3935127.mp3",
          cover:
            "https://p1.music.126.net/96zVB0C1A7TsKFHLLbqiOQ==/109951163355414477.jpg"
        },
        {
          name: "Canon in D",
          artist: "Johann Pachelbel",
          url: "https://music.163.com/song/media/outer/url?id=2569302.mp3",
          cover:
            "https://p2.music.126.net/X20TUIorq8EUHf-GqI0H7Q==/109951163350891625.jpg"
        }
      ]
    });
  };
  document.head.appendChild(aplscript);
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
  setTimeout(initMusicPlayer, 1000);
});
