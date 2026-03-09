---
title: "Audio Post Demo"
date: 2026-03-09 23:30:00 +0800
categories: [blog, guide]
tags: [audio, aplayer, demo]
music_player:
  enabled: true
  mode: embed
  position: top
  mini: false
  autoplay: false
  preload: none
  loop: all
  order: list
  volume: 0.6
  list_folded: false
  list_max_height: 220
  tracks:
    - name: "SoundHelix Song 1"
      artist: "SoundHelix"
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      cover: "https://picsum.photos/seed/soundhelix1/300/300"
    - name: "SoundHelix Song 2"
      artist: "SoundHelix"
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      cover: "https://picsum.photos/seed/soundhelix2/300/300"
---

# Audio Post Demo

This post enables the music player only for this page.

## Local Audio Example

If you upload your own file to `assets/audio/my-song.mp3`, use:

```yaml
music_player:
  enabled: true
  mode: embed
  tracks:
    - name: "My Song"
      artist: "Your Name"
      url: "/assets/audio/my-song.mp3"
      cover: "/assets/img/covers/my-song.jpg"
```

## Mode Options

- `mode: embed` places the player in the article content.
- `mode: floating` shows a floating player in the left-bottom corner.
- If `music_player` is absent, no player JS/CSS/audio is loaded.
