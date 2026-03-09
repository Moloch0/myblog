# 仓库 Feature 概览（关联文档）

> 关联核心文档：`_posts/2026-03-09-config-zh-cn.md`  
> GitHub URL: <https://github.com/Moloch0/myblog/blob/main/_posts/2026-03-09-config-zh-cn.md>

说明：本文档用于描述当前仓库的功能与实现现状，不是“人类核心标准”。如与核心文档冲突，以核心文档为准。

## 1. 站点与主题

- 技术栈：`Jekyll` + `jekyll-theme-chirpy`
- 页面结构：`_posts/` 博文、`_tabs/` 标签页、`_data/` 导航与社交配置
- URL 规则：文章永久链接使用 `/posts/:title/`

## 2. 内容能力

- 博文发布：Markdown 文章在 `_posts/` 管理
- 分类与标签：基于 Front Matter 自动归档到 `categories` / `tags`
- 文章增强：目录（TOC）、数学公式（MathJax）、Mermaid 图、评论默认可用
- 图片体验：集成 `medium-zoom`（见 `assets/js/lib/medium-zoom/`）

## 3. 互动与统计

- 评论系统：`giscus`
- 访问统计/阅读量：`goatcounter`

## 4. 前端扩展点

- 头部扩展：`_includes/custom-head.html`
- 自定义样式：`assets/css/style.css`、`assets/main.scss`
- 自定义脚本：`assets/js/custom.js`
- 第三方前端库：如 `APlayer`（见 `assets/js/lib/aplayer/`）

## 5. 写作与同步流程

- 草稿目录：`_writing/`
- 同步脚本：`tools/sync_posts.py`
- Git 钩子：`.githooks/pre-commit` 在提交前触发同步
- 典型流程：`_writing/*.md` -> pre-commit -> `sync_posts.py` -> `_posts/*.md`

## 6. 研发与发布能力

- 本地运行：`bash tools/run.sh`
- 本地测试：`bash tools/test.sh`
- 自动部署：`.github/workflows/pages-deploy.yml`（GitHub Pages）
- PWA：已启用（包含缓存能力）

## 7. 仓库运维文档

- 发布自检：`docs/RELEASE-CHECKLIST.md`
- 仓库操作：`docs/REPO-OPERATIONS.md`
- 任务模板：`docs/TASK-TEMPLATE.md`

