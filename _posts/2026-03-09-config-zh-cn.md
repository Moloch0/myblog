---
title: "CONFIG.zh-CN"
date: 2026-03-09 22:14:52 +0800
sync_source: "_writing/CONFIG.zh-CN.md"
---

# 博客配置文档（Chirpy / Jekyll）

本文基于当前仓库实际配置整理，覆盖站点特征、关键配置和常见维护操作。

## 1. 当前已启用特性

- 技术栈：`Jekyll` + `jekyll-theme-chirpy`
- 评论系统：`giscus`
- 统计与阅读量：`goatcounter`
- PWA：已启用（可安装 + 离线缓存）
- 文章目录（TOC）：默认开启
- 分类/标签归档：已开启
- 自动维护 `last_modified_at`：已开启
- 自定义交互：Live2D、阅读进度条、图片放大、音乐播放器

## 2. 关键配置文件

- 站点主配置：`_config.yml`
- 自定义头部注入：`_includes/custom-head.html`
- 自定义脚本：`assets/js/custom.js`
- 写作同步脚本：`tools/sync_posts.py`
- 部署流水线：`.github/workflows/pages-deploy.yml`

## 3. 关键配置说明

### 3.1 站点基础信息

- `title`：站点标题
- `tagline`：副标题
- `description`：SEO 描述
- `url` + `baseurl`：部署地址
- `timezone`：时区
- `lang`：界面语言（当前固定为 `en`，不要改）

### 3.2 评论与统计

- `comments.provider: giscus`
- `analytics.goatcounter.id: moloch`
- `pageviews.provider: goatcounter`

### 3.3 PWA

- `pwa.enabled: true`
- `pwa.cache.enabled: true`
- `pwa.cache.deny_paths` 可配置不参与缓存的路径

### 3.4 文章默认行为（posts）

- `comments: true`
- `toc: true`
- `math: true`
- `mermaid: true`
- `permalink: /posts/:title/`

## 4. 新增增强项（本次）

- 保持 `lang: en`，并在配置中加注释说明“不要改”。
- 全站默认开启数学公式与 Mermaid 图表渲染。
- 设置默认社交预览图：`social_preview_image`。
- 将 `medium-zoom` 与 `APlayer` 从外部 CDN 改为仓库本地静态资源。
- 增加可选“系列导航”：文章 front matter 设置 `series` 后，文末显示系列内上一篇/下一篇。
- 示例文章已增加置顶：`pin: true`。

## 5. 内容 front matter 示例

```yaml
---
title: "示例文章"
date: 2026-03-10 10:00:00 +0800
categories: [study]
tags: [jekyll, chirpy]
pin: false
series: "LLM Notes"
---
```

## 6. 本地开发与测试

推荐命令：

```bash
bash tools/run.sh
bash tools/test.sh
```

若本机 `htmlproofer` 缺失：

```bash
bundle config unset without
bundle install
```

## 7. 快速查询（官方文档）

- Chirpy 官方特性总览：<https://github.com/cotes2020/jekyll-theme-chirpy>
- Chirpy Wiki（配置与功能细节）：<https://github.com/cotes2020/jekyll-theme-chirpy/wiki>
