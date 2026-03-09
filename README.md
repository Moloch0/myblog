# myblog

个人博客仓库，基于 `Jekyll + Chirpy`。

## 人类核心标准

唯一核心文档（Single Source of Truth）：

- `_posts/2026-03-09-config-zh-cn.md`
- GitHub URL: <https://github.com/Moloch0/myblog/blob/main/_posts/2026-03-09-config-zh-cn.md>

说明：该文档是“人类标准核心文档”，有且仅有这一个。其他说明文件若与其冲突，以该文档为准。

## 仓库结构

- `_posts/`: 已发布文章
- `tools/`: 本地开发脚本
- `_includes/`, `assets/`: 主题扩展与前端资源
- `docs/`: 工程导航文档（非人类核心标准）

## 本地开发

```bash
bash tools/run.sh
bash tools/test.sh
```

如果 `htmlproofer` 缺失：

```bash
bundle config unset without
bundle install
```

## 写作方式

1. 直接在 `_posts/*.md` 写稿并维护
2. 提交前确认 Front Matter 至少包含 `title`、`date`
3. `git commit && git push` 发布变更

## 参考

- 工程导航：`docs/REPO-OPERATIONS.md`
- Feature 概览（关联文档）：`_posts/2026-03-09-features.md`
- Chirpy 官方文档：<https://github.com/cotes2020/jekyll-theme-chirpy/wiki>
