---
title: "CONFIG.zh-CN"
date: 2026-03-09 22:14:52 +0800
sync_source: "_writing/CONFIG.zh-CN.md"
---

# 博客配置文档（Chirpy / Jekyll）

本文档基于当前仓库实际配置整理，覆盖站点特征、关键配置项和常见维护操作。

## 1. 当前博客特征

- 技术栈：`Jekyll` + `jekyll-theme-chirpy`（Gemfile 约束 `~> 7.4`，当前锁定 `>= 7.4.1`）
- 部署方式：GitHub Pages Actions 自动构建与部署
- 站点地址：`https://moloch0.github.io/myblog`（`url` + `baseurl`）
- 时区：`Asia/Shanghai`
- 语言：`en`（界面语言）
- 评论系统：`giscus`（已配置 `repo/repo_id/category/category_id`）
- 统计与阅读量：`goatcounter`（`analytics.goatcounter.id = moloch`，`pageviews.provider = goatcounter`）
- PWA：已开启（可安装 + 离线缓存都开启）
- 文章默认行为：默认开启评论与目录（TOC），固定链接为 `/posts/:title/`
- 归档页：已开启分类与标签归档（`jekyll-archives`）
- 自定义增强：
  - `_plugins/posts-lastmod-hook.rb`：根据 Git 提交历史自动写入 `last_modified_at`
  - `assets/css/style.css`、`assets/js/custom.js`、`_includes/custom-head.html`：主题外自定义样式/脚本入口
- 写作工作流：支持 `_writing/*.md` 在提交时自动同步到 `_posts/`
  - 钩子：`.githooks/pre-commit`
  - 脚本：`tools/sync_posts.py`
  - 当前策略：同步后删除 `_writing` 源文件（`delete_source_after_sync: true`）

## 2. 关键配置文件

- 站点主配置：`_config.yml`
- Ruby 依赖：`Gemfile`、`Gemfile.lock`
- 部署流水线：`.github/workflows/pages-deploy.yml`
- 写作同步参数：`.blog-sync.json`
- Git 提交钩子：`.githooks/pre-commit`

## 3. `_config.yml` 配置说明（按功能）

## 3.1 站点基础信息

- `title`：站点标题
- `tagline`：副标题
- `description`：SEO 描述
- `url`：主域名（不含尾部 `/`）
- `baseurl`：项目路径（当前为 `/myblog`）
- `lang`：界面语言
- `timezone`：站点时区

注意：
- 若部署到 `https://<user>.github.io/<repo>`，通常应设置：
  - `url: "https://<user>.github.io"`
  - `baseurl: "/<repo>"`

## 3.2 社交与身份信息

- `github.username`
- `social.name`
- `social.email`
- `social.links`（第一个链接会作为页脚版权链接）

## 3.3 评论系统（Giscus）

路径：`comments.provider = giscus` 与 `comments.giscus.*`

已配置项：
- `repo: Moloch0/myblog`
- `repo_id`
- `category`
- `category_id`
- `mapping: pathname`
- `lang: zh-CN`

若评论不显示，优先检查：
- Giscus App 是否已安装到对应仓库
- `repo_id` / `category_id` 是否与仓库设置匹配
- 仓库 Discussions 是否启用

## 3.4 统计与阅读量

- `analytics.goatcounter.id = moloch`
- `pageviews.provider = goatcounter`

说明：
- 你当前只启用了 GoatCounter，其它统计（GA/Umami/Matomo/Cloudflare/Fathom）为预留空值。

## 3.5 PWA 与缓存

- `pwa.enabled: true`
- `pwa.cache.enabled: true`

说明：
- 已启用安装与离线缓存能力。
- 如未来同域下有不希望缓存的路径，可在 `pwa.cache.deny_paths` 增加规则。

## 3.6 文章与页面默认规则

`defaults` 中当前生效行为：
- `posts`：
  - `layout: post`
  - `comments: true`
  - `toc: true`
  - `permalink: /posts/:title/`
- `_drafts`：
  - `comments: false`
- `tabs`：
  - `layout: page`
  - `permalink: /:title/`

## 3.7 分类与标签归档

`jekyll-archives` 当前设置：
- `enabled: [categories, tags]`
- 标签页路径：`/tags/:name/`
- 分类页路径：`/categories/:name/`

## 4. 自动写作同步（_writing -> _posts）

相关文件：
- `.githooks/pre-commit`
- `tools/sync_posts.py`
- `.blog-sync.json`

当前行为：
- 提交前自动扫描 `_writing/*.md`
- 同步到 `_posts/YYYY-MM-DD-title.md`
- 自动补齐/维护 front matter（`title`、`date`）
- 记录 `sync_source`（当前开启）
- 同步完成后删除源稿（当前开启）

初始化一次（每个 clone）：

```bash
git config core.hooksPath .githooks
```

如果你不希望同步后删除 `_writing` 原稿，将 `.blog-sync.json` 改为：

```json
{
  "delete_source_after_sync": false
}
```

## 5. 本地开发与测试

推荐命令（已兼容你当前 Windows 环境）：

```bash
bash tools/run.sh
bash tools/test.sh
```

说明：
- `tools/run.sh` 使用 `ruby -S jekyll` 启动本地服务
- `tools/test.sh` 会构建并运行 `htmlproofer`（可用 `SKIP_HTMLPROOFER=1` 临时跳过）

## 6. GitHub Actions 部署说明

文件：`.github/workflows/pages-deploy.yml`

流程：
- 触发：推送到 `main/master` 或手动触发
- 环境：`ubuntu-latest` + `ruby 3.3`
- 构建：`bundle exec jekyll b`
- 测试：`bundle exec htmlproofer "_site"`
- 发布：上传构建产物并部署到 GitHub Pages

## 7. 常见维护项（建议）

- 修改站点标题/描述：编辑 `_config.yml` 的 `title/tagline/description`
- 修改域名或仓库名：同步更新 `url` 与 `baseurl`
- 更换评论仓库：更新 `comments.giscus.repo/repo_id/category/category_id`
- 关闭评论：将 `comments.provider` 置空
- 关闭 PWA：`pwa.enabled: false`
- 调整分页：修改 `paginate`

## 8. 版本与兼容性备注

- 当前本机可正常 `jekyll build` / `jekyll doctor`
- 若本机 `bundle exec` 出现异常，可优先使用 `tools/run.sh` 和 `tools/test.sh`
- CI 使用独立 Linux Ruby 环境，不受本机 shell 差异影响
