---
title: "Archive"
permalink: /archive/
layout: archive
---

{% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% for year in postsByYear %}
  <h2 id="{{ year.name }}">{{ year.name }}</h2>
  <ul>
  {% for post in year.items %}
    <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small>{{ post.date | date: "%Y-%m-%d" }}</small></li>
  {% endfor %}
  </ul>
{% endfor %}
