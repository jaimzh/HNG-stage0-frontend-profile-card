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
          <div class="project-image-wrapper">
            <div class="project-image">
              ${imageHtml}
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

// ─── GSAP Hero Name Text Cycling Animation ───
(function () {
  gsap.registerPlugin(TextPlugin);

  const names = [
    "James Henshaw",
    "Jaimz H",
    "Jaimz with a Z",
    "Jaimz",
    "Him",
  ];

  const textEl = document.getElementById("hero-name-text");
  const cursorEl = document.querySelector(".hero-name-cursor");
  if (!textEl) return;

  let currentIndex = 0;

  // Backspace one character at a time from the end
  function backspaceText(el, onComplete) {
    const currentText = el.textContent;
    if (currentText.length === 0) {
      onComplete();
      return;
    }

    const charDelay = 0.6 / currentText.length; // total ~0.6s for full delete
    const tl = gsap.timeline({ onComplete });

    for (let i = currentText.length; i >= 0; i--) {
      tl.call(
        () => {
          el.textContent = currentText.substring(0, i);
        },
        null,
        i === currentText.length ? 0 : `+=${charDelay}`
      );
    }
  }

  function cycleNames() {
    const nextIndex = (currentIndex + 1) % names.length;
    const nextName = names[nextIndex];

    // Pause cursor blinking during typing
    gsap.set(cursorEl, { opacity: 1, animation: "none" });

    // Step 1: Backspace from end
    backspaceText(textEl, () => {
      // Step 2: Brief pause, then type forward
      gsap.to(textEl, {
        delay: 0.3,
        duration: 0.7,
        text: { value: nextName, delimiter: "" },
        ease: "none",
        onComplete: () => {
          // Resume cursor blinking
          gsap.set(cursorEl, {
            animation: "cursorBlink 0.75s step-end infinite",
          });
          currentIndex = nextIndex;
          gsap.delayedCall(3, cycleNames);
        },
      });
    });
  }

  // Start the first cycle after 3 seconds
  gsap.delayedCall(3, cycleNames);
})();

