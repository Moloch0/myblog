---
layout: home
title: "主页"
---

欢迎来到我的博客。

这里主要记录学习笔记、技术实践和个人项目。

## 分类（Categories）

{% assign cats = site.categories | sort %}
{% for category in cats %}
- **{{ category[0] }}** ({{ category[1].size }})
{% endfor %}

## 标签（Tags）

{% assign tags = site.tags | sort %}
{% for tag in tags %}
- **{{ tag[0] }}** ({{ tag[1].size }})
{% endfor %}
