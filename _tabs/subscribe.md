---
layout: page
title: Subscribe
icon: fas fa-bell
order: 8
---

## RSS

- Feed URL: [{{ '/feed.xml' | relative_url }}]({{ '/feed.xml' | relative_url }})
- Recommended: add this feed into Follow, Inoreader, Feedly, or any RSS client.

## Email Subscription

- Use an RSS-to-email service with this feed:
  `{{ site.url }}{{ site.baseurl }}/feed.xml`
- Suggested workflow:
  1. Connect your RSS feed to a provider.
  2. Add a subscription form here later.
  3. Send digest daily or weekly.

## Web Push

- Current status: ready for provider integration.
- Supported approach: use a push provider (for example OneSignal) and inject app ID in custom script.
