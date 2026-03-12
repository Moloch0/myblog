# REPO OPERATIONS

该文件用于工程执行导航，不是人类核心标准文档。

## 1) 快速定位

- 核心规范（唯一）：`_posts/2026-03-09-config-zh-cn.md`
- 站点配置：`_config.yml`
- 页面部署：`.github/workflows/pages-deploy.yml`
- 任务模板：`docs/TASK-TEMPLATE.md`
- 发布检查单：`docs/RELEASE-CHECKLIST.md`

## 2) 常用命令

```bash
bash tools/run.sh
bash tools/test.sh
```

Windows 手动预览建议使用：

```bat
cd /d d:\360MoveData\Users\罗力恒\Desktop\study\blog
set RUBYOPT=
jekyll serve --host 127.0.0.1 --port 4000
```

补充约束：

- 避免在 Windows 上用 `bundle exec jekyll serve`，当前环境可能被 `RUBYOPT` 污染。
- 避免使用 `jekyll serve --detach`，Windows 上会因 `fork()` 不可用而失败。
- 若 PowerShell 启动时报 `conda` 的编码错误，改用 `cmd` 或 `PowerShell -NoProfile`。

## 3) 提交前检查

- 未提交 `_site/`、`.jekyll-cache/`、`__pycache__/`、`*.pyc`
- 文章 front matter 至少包含 `title`、`date`
- 新增脚本路径已在文档中标明用途

## 4) 变更策略

- 优先最小改动
- 不改动生产配置除非需求明确
- 保持 `_posts/` 为最终内容来源

## 5) 建议执行顺序

1. 先读核心规范：`_posts/2026-03-09-config-zh-cn.md`
2. 复制任务模板：`docs/TASK-TEMPLATE.md`
3. 开发与验证
4. 按发布检查单执行：`docs/RELEASE-CHECKLIST.md`
5. 提交并发布
