# Personal Blog (GitHub Pages + Jekyll)

这是一个可直接部署到 GitHub Pages 的个人博客模板，满足：

- 独立个人介绍页（不是主页）
- 后续上传 Markdown 文章即可自动按时间归档
- 支持按关键词分类（`tags`、`categories`）
- 版权默认归你本人所有（`All Rights Reserved`）

## 1. 本地结构

- `_config.yml`: 站点配置
- `index.md`: 首页（文章列表）
- `about.md`: 个人介绍页（可稍后填写）
- `_posts/`: 文章目录（按日期命名）
- `assets/css/style.css`: 样式
- `LICENSE.md`: 版权声明（保留所有权利）

## 2. 发布到 GitHub Pages

1. 新建仓库（推荐仓库名：`<你的用户名>.github.io`）
2. 将当前目录文件推送到 `main` 分支
3. 打开仓库 `Settings -> Pages`
4. `Build and deployment` 选择 `Deploy from a branch`
5. 分支选 `main`，目录选 `/ (root)`

## 3. 发文章（Markdown）

把文章放在 `_posts/` 下，文件名格式：

`YYYY-MM-DD-title.md`

示例：`2026-03-06-my-first-post.md`

Front Matter 示例：

```yaml
---
layout: post
title: "我的第一篇记录"
date: 2026-03-06 10:00:00 +0800
categories: [study, notes]
tags: [jekyll, markdown, github-pages]
---
```

- `date` 用于时间排序与归档
- `categories` / `tags` 用于关键词分类

## 4. 版权

当前站点底部与 `LICENSE.md` 中都声明为：

`Copyright (c) 2026 罗力恒. All Rights Reserved.`

如果你以后希望别人转载/商用，再单独切换成 MIT 或 CC 协议即可。
