// Live2D 看板娘初始化
function initLive2D() {
  // 使用 Live2D Widget 库
  const script = document.createElement('script');
  script.src =
    'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js';
  document.head.appendChild(script);
}

// 阅读进度条
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
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// 图片灯箱功能
function initImageLightbox() {
  // 使用 Medium Zoom 库
  const script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/medium-zoom@latest/dist/medium-zoom.min.js';
  script.onload = function () {
    mediumZoom('article img', {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.9)',
      scrollOffset: 0,
    });
  };
  document.head.appendChild(script);
}

// 音乐播放器
function initMusicPlayer() {
  // 创建播放器容器
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

  // 加载 APlayer CSS
  const aplcss = document.createElement('link');
  aplcss.rel = 'stylesheet';
  aplcss.href =
    'https://cdn.jsdelivr.net/npm/aplayer@latest/dist/APlayer.min.css';
  document.head.appendChild(aplcss);

  // 加载 APlayer JS
  const aplscript = document.createElement('script');
  aplscript.src =
    'https://cdn.jsdelivr.net/npm/aplayer@latest/dist/APlayer.min.js';
  aplscript.onload = function () {
    const ap = new APlayer({
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

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function () {
  // 初始化 Live2D
  initLive2D();

  // 初始化阅读进度条
  initReadingProgress();

  // 初始化图片灯箱
  initImageLightbox();

  // 初始化音乐播放器（延迟加载避免阻塞页面）
  setTimeout(initMusicPlayer, 1000);
});
