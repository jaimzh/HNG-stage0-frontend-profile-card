// ─── Active nav highlighting on scroll ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-list a");

const observerOptions = {
  rootMargin: "-40% 0px -55% 0px",
  threshold: 0,
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach((section) => navObserver.observe(section));

// ─── Fade-in on scroll ───
const fadeTargets = document.querySelectorAll(".fade-in, .fade-in-children");

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeTargets.forEach((el) => fadeObserver.observe(el));

// ─── Fetch and render projects ───
async function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const projects = await response.json();

    projects.forEach((project) => {
      const tagsHtml = (project.tags || [])
        .map((tag) => `<span class="project-tag">${tag}</span>`)
        .join('');

      let imageHtml = '<!-- Placeholder -->';
      if (project.previewImage) {
        imageHtml = `<img src="${project.previewImage}" alt="${project.name} Preview" loading="lazy" />`;
      }

      const cardHtml = `
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-card" id="project-${project.id}">
          <div class="project-image">
            ${imageHtml}
          </div>
          <div class="project-content">
            <div class="project-card-header">
              <h3 class="project-name">${project.name}</h3>
              <svg class="project-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
            <p class="project-desc">${project.description}</p>
            <div class="project-tags">
              ${tagsHtml}
            </div>
          </div>
        </a>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = '<p style="color: var(--text-muted);">Failed to load projects.</p>';
  }
}

document.addEventListener('DOMContentLoaded', renderProjects);
