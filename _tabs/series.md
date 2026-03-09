---
layout: page
title: Series
icon: fas fa-list-ol
order: 5
---

{% assign series_posts = site.posts | where_exp: "post", "post.series" %}
{% assign grouped = series_posts | group_by: "series" %}

{% if grouped.size > 0 %}
  {% for series in grouped %}
    <section class="mb-4">
      <h3 class="mb-2">{{ series.name }} <span class="text-muted small">({{ series.items.size }})</span></h3>
      <ol class="mb-0">
        {% assign ordered = series.items | sort: "date" %}
        {% for post in ordered %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="text-muted small">({{ post.date | date: "%Y-%m-%d" }})</span>
          </li>
        {% endfor %}
      </ol>
    </section>
  {% endfor %}
{% else %}
  <p class="text-muted">No series posts yet.</p>
{% endif %}
