---
layout: page
icon: fas fa-folder-open
order: 3
title: Projects
---

<style>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border: 1px solid var(--card-border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: var(--card-bg);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--link-color);
}

.project-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.project-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.project-description {
  color: var(--text-muted-color);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-tag {
  background: var(--tag-bg);
  color: var(--tag-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  color: var(--link-color);
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.project-link:hover {
  text-decoration: underline;
}
</style>

<div class="project-grid">
  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">📝</div>
      <h3 class="project-title">MyBlog</h3>
    </div>
    <p class="project-description">
      Personal technical blog based on Jekyll + Chirpy, used for research notes, long-form posts, and project records.
    </p>
    <div class="project-tags">
      <span class="project-tag">Jekyll</span>
      <span class="project-tag">Chirpy</span>
      <span class="project-tag">GitHub Pages</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/Moloch0/myblog" class="project-link" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> Repository
      </a>
      <a href="/" class="project-link">
        <i class="fas fa-external-link-alt"></i> Live Site
      </a>
    </div>
  </div>

  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">🔄</div>
      <h3 class="project-title">Post Sync Tool</h3>
    </div>
    <p class="project-description">
      A pre-commit workflow to sync markdown files from <code>_writing/</code> to timestamped files in <code>_posts/</code>.
    </p>
    <div class="project-tags">
      <span class="project-tag">Python</span>
      <span class="project-tag">Git Hooks</span>
      <span class="project-tag">Automation</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/Moloch0/myblog/tree/main/tools" class="project-link" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> Source
      </a>
      <a href="https://github.com/Moloch0/myblog/blob/main/README.md" class="project-link" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-book"></i> Docs
      </a>
    </div>
  </div>
</div>
