---
title: "Chirpy 博客使用指南"
description: "基于 cotes2020/chirpy-starter 的个人博客，从本地写作到 GitHub Pages 部署的完整流程。"
date: 2026-03-06 00:00:00 +0800
categories: [blog, guide]
tags: [chirpy, jekyll, github-pages, pre-commit]
toc: true
---

这篇文章记录我如何使用 [cotes2020/chirpy-starter](https://github.com/cotes2020/chirpy-starter) 搭建和维护博客，包含配置、本地预览、写作发布、自动同步和常见问题排查。

## 1. 模板提供了什么

`chirpy-starter` 是一个基于 Jekyll 的博客模板，开箱提供：

- 文章分页和归档（Archives）
- 标签页（Tags）和分类页（Categories）
- SEO 元信息与 RSS
- 响应式布局
- GitHub Actions 自动部署到 GitHub Pages

本仓库的核心目录：

- `_posts/`：正式发布文章
- `_drafts/`：草稿（默认不发布）
- `_writing/`：我的写作目录（提交时自动同步到 `_posts/`）
- `_tabs/`：固定页面（About/Archives/Tags/Categories）
- `_config.yml`：站点全局配置
- `.github/workflows/pages-deploy.yml`：自动部署流程

## 2. 基础配置

优先修改 `_config.yml`：

- `title`：博客标题
- `tagline`：副标题
- `description`：SEO 描述
- `url`：站点主域名（如 `https://moloch0.github.io`）
- `baseurl`：仓库路径（如 `/myblog`）
- `timezone`：时区（如 `Asia/Shanghai`）
- `social`：作者信息与社交链接

`url` 和 `baseurl` 不匹配时，常见现象是样式丢失、链接跳错或 404。

## 3. 本地启动和预览

```bash
bundle install
bundle exec jekyll serve
```

访问：

- `http://127.0.0.1:4000/myblog/`（假设 `baseurl: "/myblog"`）

如果要预览未来时间文章：

```bash
bundle exec jekyll serve --future
```

## 4. 文章命名和时间规则

Jekyll 的 `_posts/` 默认文件名格式是：

- `YYYY-MM-DD-title.md`

原因：

- 这是 Jekyll 判断 post 的标准格式
- 会用于生成默认 slug
- 如果 Front Matter 没有 `date`，会从文件名日期推导

发布时间建议始终明确写 `date`，例如：

```yaml
date: 2026-03-06 21:00:00 +0800
```

## 5. 当前仓库的写作方式（pre-commit 自动同步）

我现在采用的是：

1. 在 `_writing/*.md` 写文章
2. `git commit` 时自动运行同步脚本
3. 脚本把内容写入 `_posts/YYYY-MM-DD-title.md`

自动同步由以下文件完成：

- `.githooks/pre-commit`
- `tools/sync_posts.py`
- `.blog-sync.json`

> 注意：当前仓库在 `.blog-sync.json` 中启用了 `delete_source_after_sync: true`，也就是提交时完成同步后会删除 `_writing/` 下已同步的源文件。这是刻意设计，用于保证后续只在 `_posts/` 维护最终稿。

一次性启用（每次 clone 后执行一次）：

```bash
git config core.hooksPath .githooks
```

脚本行为：

- 若源文件缺 `date`，使用文件修改时间自动补齐
- 自动写入 `sync_source` 字段，便于反向追踪
- 当源文件删除时，自动清理对应同步文件

## 6. 如何暂存不发布

两种方式：

1. 放在 `_drafts/`（推荐）
2. 放在 `_posts/`，但 `date` 设为未来时间

日常建议是：写作阶段放 `_drafts/` 或 `_writing/`，确认后再发布。

## 7. 页面与导航

固定页面在 `_tabs/`：

- `about.md`
- `archives.md`
- `categories.md`
- `tags.md`

导航可通过 `_data/navigation.yml` 调整。

## 8. 自动部署到 GitHub Pages

本仓库已配置 `.github/workflows/pages-deploy.yml`：

- push 到 `main`/`master` 自动构建
- 使用 GitHub Pages 官方 Action 部署
- 构建命令为 `bundle exec jekyll b`

只要 Pages 设置正常，`git push` 后会自动更新站点。

## 9. 常见问题速查

### 9.1 看不到新文章

- 检查 `date` 是否在未来
- 检查是否还在 `_drafts/`
- 本地是否忘记 `--future`

### 9.2 样式错乱或链接异常

- 检查 `_config.yml` 中 `url` / `baseurl`
- 检查 GitHub Pages 构建日志是否报错

### 9.3 文章顺序不对

- 检查 Front Matter 的 `date`
- 检查文件名日期与 `date` 是否长期不一致

## 10. 我的发布建议

- 用 `_writing/` 写作，交给 pre-commit 自动同步
- 保持 `title`、`date`、`categories`、`tags` 完整
- 发布前本地检查首页、文章页、标签页、分类页
