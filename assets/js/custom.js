const LIVE2D_WIDGET_URL =
  'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@v0.9.0/autoload.js';
const MEDIUM_ZOOM_URL =
  'https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js';
const APLAYER_CSS_URL =
  'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css';
const APLAYER_JS_URL =
  'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js';

function initLive2D() {
  const script = document.createElement('script');
  script.src = LIVE2D_WIDGET_URL;
  document.head.appendChild(script);
}

function initReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.id = 'reading-progress-bar';
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

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.documentElement.scrollHeight - windowHeight,
      1
    );
    const scrolled = window.scrollY;
    const progress = Math.min(100, Math.max(0, (scrolled / documentHeight) * 100));
    progressBar.style.width = progress + '%';
  });
}

function initImageLightbox() {
  const script = document.createElement('script');
  script.src = MEDIUM_ZOOM_URL;
  script.onload = function () {
    mediumZoom('article img', {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.9)',
      scrollOffset: 0,
    });
  };
  document.head.appendChild(script);
}

function initMusicPlayer() {
  const playerContainer = document.createElement('div');
  playerContainer.id = 'music-player';
  playerContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9998;
    width: 300px;
  `;
  document.body.appendChild(playerContainer);

  const aplcss = document.createElement('link');
  aplcss.rel = 'stylesheet';
  aplcss.href = APLAYER_CSS_URL;
  document.head.appendChild(aplcss);

  const aplscript = document.createElement('script');
  aplscript.src = APLAYER_JS_URL;
  aplscript.onload = function () {
    new APlayer({
      container: document.getElementById('music-player'),
      mini: true,
      autoplay: false,
      theme: '#667eea',
      loop: 'all',
      order: 'random',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      listFolded: true,
      listMaxHeight: 90,
      audio: [
        {
          name: 'Komorebi',
          artist: 'm-taku',
          url: 'https://music.163.com/song/media/outer/url?id=1357887232.mp3',
          cover:
            'https://p2.music.126.net/vf7c2GJsuyfSl2AAOvXgJA==/109951163068517608.jpg',
        },
        {
          name: 'River Flows In You',
          artist: 'Yiruma',
          url: 'https://music.163.com/song/media/outer/url?id=3935127.mp3',
          cover:
            'https://p1.music.126.net/96zVB0C1A7TsKFHLLbqiOQ==/109951163355414477.jpg',
        },
        {
          name: 'Canon in D',
          artist: 'Johann Pachelbel',
          url: 'https://music.163.com/song/media/outer/url?id=2569302.mp3',
          cover:
            'https://p2.music.126.net/X20TUIorq8EUHf-GqI0H7Q==/109951163350891625.jpg',
        },
      ],
    });
  };
  document.head.appendChild(aplscript);
}

document.addEventListener('DOMContentLoaded', function () {
  initLive2D();
  initReadingProgress();
  initImageLightbox();
  setTimeout(initMusicPlayer, 1000);
});
