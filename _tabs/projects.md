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
  
  <!-- 项目示例 1 -->
  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">🚀</div>
      <h3 class="project-title">Your Project Name</h3>
    </div>
    <p class="project-description">
      A brief description of your project. What problem does it solve? What makes it special?
    </p>
    <div class="project-tags">
      <span class="project-tag">Python</span>
      <span class="project-tag">Machine Learning</span>
      <span class="project-tag">Open Source</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/yourusername/project" class="project-link" target="_blank">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="#" class="project-link">
        <i class="fas fa-external-link-alt"></i> Demo
      </a>
    </div>
  </div>

  <!-- 项目示例 2 -->
  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">🎨</div>
      <h3 class="project-title">Creative Tool</h3>
    </div>
    <p class="project-description">
      An innovative tool for creative professionals. Built with modern web technologies.
    </p>
    <div class="project-tags">
      <span class="project-tag">JavaScript</span>
      <span class="project-tag">React</span>
      <span class="project-tag">WebGL</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/yourusername/creative-tool" class="project-link" target="_blank">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="#" class="project-link">
        <i class="fas fa-book"></i> Docs
      </a>
    </div>
  </div>

  <!-- 项目示例 3 -->
  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">📊</div>
      <h3 class="project-title">Data Analysis Framework</h3>
    </div>
    <p class="project-description">
      A powerful framework for data analysis and visualization. Supports multiple data sources.
    </p>
    <div class="project-tags">
      <span class="project-tag">Python</span>
      <span class="project-tag">Data Science</span>
      <span class="project-tag">Visualization</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/yourusername/data-framework" class="project-link" target="_blank">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="#" class="project-link">
        <i class="fas fa-file-alt"></i> Paper
      </a>
    </div>
  </div>

  <!-- 项目示例 4 -->
  <div class="project-card">
    <div class="project-header">
      <div class="project-icon">🔧</div>
      <h3 class="project-title">Developer Utility</h3>
    </div>
    <p class="project-description">
      A handy utility for developers. Simplifies common development tasks and workflows.
    </p>
    <div class="project-tags">
      <span class="project-tag">TypeScript</span>
      <span class="project-tag">CLI</span>
      <span class="project-tag">DevTools</span>
    </div>
    <div class="project-links">
      <a href="https://github.com/yourusername/dev-utility" class="project-link" target="_blank">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="#" class="project-link">
        <i class="fab fa-npm"></i> NPM
      </a>
    </div>
  </div>

</div>

<div style="margin-top: 3rem; padding: 2rem; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--card-border-color);">
  <h2 style="margin-top: 0;">✨ How to Add Your Projects</h2>
  <p>Edit this file at <code>_tabs/projects.md</code> and replace the example projects with your own:</p>
  <ol>
    <li>Change the project icon (emoji or FontAwesome icon)</li>
    <li>Update the project title and description</li>
    <li>Add relevant technology tags</li>
    <li>Link to your GitHub repo, demo, or documentation</li>
  </ol>
  <p>You can add as many project cards as you need by copying the project-card div structure.</p>
</div>
