---
layout: page
title: Analytics
icon: fas fa-chart-line
order: 7
---

<p class="text-muted">
  This dashboard reads GoatCounter public counters per post path and builds a quick top-post view.
</p>

<div id="analytics-dashboard" data-goatcounter="{{ site.analytics.goatcounter.id }}"></div>

<script id="analytics-posts-json" type="application/json">
[
{% for post in site.posts %}
  {
    "title": {{ post.title | jsonify }},
    "url": {{ post.url | relative_url | jsonify }},
    "path": {{ post.url | prepend: site.baseurl | jsonify }}
  }{% unless forloop.last %},{% endunless %}
{% endfor %}
]
</script>
