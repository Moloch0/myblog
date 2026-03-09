---
title: "CONFIG.zh-CN"
date: 2026-03-09 22:14:52 +0800
sync_source: "_writing/CONFIG.zh-CN.md"
---

# 博客核心配置与协作标准（唯一人类核心文档）

## 0. 文档定位（强约束）

- 本文档路径：`_posts/2026-03-09-config-zh-cn.md`
- 本文档 URL：<https://github.com/Moloch0/myblog/blob/main/_posts/2026-03-09-config-zh-cn.md>
- 规则：**这是人类标准核心文档，有且仅有这一个。**
- 若其他文档与本文冲突，以本文为准。

## 0.1 Prompt 版本

- Prompt-Version: `v1.1.0`
- Last-Updated: `2026-03-09`
- Maintainer: `Moloch0`

## 0.2 变更日志（Prompt）

- `v1.1.0`（2026-03-09）：新增“启动短 Prompt（跨对话复用）”与版本化管理规则。
- `v1.0.0`（2026-03-09）：建立唯一核心文档、仓库关键文件、长 Prompt、维护基线与模板。

## 0.3 启动短 Prompt（每次新对话先贴）

```text
按 Prompt-Version:v1.1.0 执行。
先读取 `_posts/2026-03-09-config-zh-cn.md`，将其视为唯一人类核心规范。
先扫描 `_config.yml`、`README.md`、`tools/`、`_posts/`、`_includes/`、`assets/`，再给最小可行改动方案并实施。
输出需包含：受影响文件、验证结果、未执行项。
发布前按 `docs/RELEASE-CHECKLIST.md` 自检。
```

## 1. 站点现状摘要

- 技术栈：`Jekyll` + `jekyll-theme-chirpy`
- 评论：`giscus`
- 统计/阅读量：`goatcounter`
- PWA：已启用（含缓存）
- 文章默认：`comments/toc/math/mermaid` 全开
- 文章永久链接：`/posts/:title/`
- 写作流：`_writing/*.md` -> pre-commit -> `tools/sync_posts.py` -> `_posts/*.md`

## 2. 仓库关键文件

- 站点主配置：`_config.yml`
- 自定义头部：`_includes/custom-head.html`
- 自定义脚本：`assets/js/custom.js`
- 写作同步：`tools/sync_posts.py`
- 部署：`.github/workflows/pages-deploy.yml`

## 3. 给 AI 助手的高效执行 Prompt（可直接复用）

```text
你是这个博客仓库的工程协作助手。目标是：在不破坏现有内容和部署稳定性的前提下，高效完成用户请求。

请始终遵守以下顺序：
1) 先读 `_posts/2026-03-09-config-zh-cn.md`，把它当作唯一人类核心规范。
2) 快速扫描目录与关键文件：`_config.yml`、`README.md`、`tools/`、`_posts/`、`_includes/`、`assets/`。
3) 对任务做“最小可行改动”：优先改动少、回归风险低、可验证的方案。
4) 涉及写作同步时，遵循 `_writing -> sync_posts.py -> _posts` 流程，不绕过。
5) 不提交构建产物和缓存文件（如 `_site/`、`__pycache__/`、`*.pyc`）。
6) 任何改动后都给出验证结果：至少包含受影响文件、关键行为是否正常、未执行项。

实现层面的硬约束：
- 不随意修改 `lang: en`、`baseurl`、评论与统计配置，除非任务明确要求。
- 不删除历史文章，除非任务明确要求。
- 不引入与当前技术栈不一致的复杂依赖。
- 若发现规范冲突，明确指出并以本核心文档为准。
```

## 4. 维护基线

- 本地启动：`bash tools/run.sh`
- 本地测试：`bash tools/test.sh`
- 首次启用 pre-commit 同步：`git config core.hooksPath .githooks`
- 若测试缺少 `htmlproofer`：
  - `bundle config unset without`
  - `bundle install`

## 5. Front Matter 基准模板

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
