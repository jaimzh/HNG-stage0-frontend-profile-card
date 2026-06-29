// ─── Active nav highlighting on scroll ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-list a");


const glassesAvatarWrap = document.querySelector(".hero-avatar-wrap");

  glassesAvatarWrap.addEventListener("click", () => {
    glassesAvatarWrap.classList.toggle("glasses-active");

  });


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

// ─── GSAP ScrollTrigger Animations ───
gsap.registerPlugin(ScrollTrigger);


gsap.fromTo(
  ".hero-card",
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 },
);


gsap.fromTo(
  ".hero-avatar-wrap",
  { scale: 0.8, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.5 },
);

gsap.fromTo(
  ".hero-body > *",
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.15,
    ease: "power2.out",
    delay: 0.7,
  },
);


gsap.from(".card-about", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".card-about",
    start: "top 85%",
    toggleActions: "play none none none",
  },
});


gsap.utils.toArray(".divider").forEach((divider) => {
  gsap.from(divider, {
    scaleX: 0,
    duration: 0.8,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: divider,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
});

// Section headings & descriptions
gsap.utils.toArray(".section-heading").forEach((heading) => {
  gsap.from(heading, {
    x: -40,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: heading,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
});

gsap.utils.toArray(".section-info").forEach((info) => {
  gsap.from(info, {
    x: -30,
    opacity: 0,
    duration: 0.6,
    delay: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: info,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
});


gsap.set(".tech-list > li", { y: 25, opacity: 0, scale: 0.9 });

ScrollTrigger.batch(".tech-list > li", {
  onEnter: (batch) =>
    gsap.to(batch, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: "back.out(1.4)",
      overwrite: false,
      clearProps: "transform",
    }),
  trigger: ".tech-list",
  start: "top 85%",
  once: true,
});


ScrollTrigger.batch(".footer-socials li", {
  onEnter: (batch) =>
    gsap.from(batch, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    }),
  start: "top 90%",
  once: true,
});

gsap.from(".footer-text", {
  y: 15,
  opacity: 0,
  duration: 0.5,
  delay: 0.5,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 90%",
    once: true,
  },
});

// Fetch and render projects with pagination
async function renderProjects() {
  const container = document.getElementById("projects-container");
  const dotsContainer = document.getElementById("carousel-dots");
  if (!container) return;

  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error("Failed to fetch projects");
    const projects = await response.json();
    const pageSize = 5;
    const pageCount = Math.ceil(projects.length / pageSize);

    let currentPage = 0;

    function displayPage(page) {
      currentPage = page;
      container.innerHTML = ""; // Clear current projects
      const start = page * pageSize;
      const paginatedProjects = projects.slice(start, start + pageSize);

      paginatedProjects.forEach((project) => {
        const tagsHtml = (project.tags || [])
          .map((tag) => `<span class="project-tag">${tag}</span>`)
          .join("");

        let imageHtml = "<!-- Placeholder -->";
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
        container.insertAdjacentHTML("beforeend", cardHtml);
      });

    
      const pageCounter = dotsContainer.querySelector(".page-counter");
      if (pageCounter) {
        pageCounter.textContent = `Page ${page + 1} of ${pageCount}`;
      }

      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === page);
        dot.setAttribute("aria-current", index === page ? "page" : "false");
      });

      const prevButton = dotsContainer.querySelector(".pagination-prev");
      const nextButton = dotsContainer.querySelector(".pagination-next");

      if (prevButton) {
        prevButton.disabled = page === 0;
      }

      if (nextButton) {
        nextButton.disabled = page === pageCount - 1;
      }

      // Pre-hide cards and animate
      gsap.set(".project-card", { y: 50, opacity: 0 });
      ScrollTrigger.refresh();
      ScrollTrigger.batch(".project-card", {
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out",
            overwrite: false,
            clearProps: "transform",
          }),
        start: "top 80%",
        once: true,
      });
    }

    // Create pagination controls and page counter
    const dotsWrapper = document.createElement("div");
    dotsWrapper.className = "dots-wrapper";
    dotsWrapper.setAttribute("role", "group");
    dotsWrapper.setAttribute("aria-label", "Project pages");

    const prevButton = document.createElement("button");
    prevButton.className = "pagination-btn pagination-prev";
    prevButton.type = "button";
    prevButton.textContent = "Previous";
    prevButton.setAttribute("aria-label", "Go to previous project page");
    prevButton.addEventListener("click", () => {
      if (currentPage > 0) displayPage(currentPage - 1);
    });
    dotsWrapper.appendChild(prevButton);

    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to project page ${i + 1}`);
      dot.addEventListener("click", () => displayPage(i));
      dotsWrapper.appendChild(dot);
    }

    const nextButton = document.createElement("button");
    nextButton.className = "pagination-btn pagination-next";
    nextButton.type = "button";
    nextButton.textContent = "Next";
    nextButton.setAttribute("aria-label", "Go to next project page");
    nextButton.addEventListener("click", () => {
      if (currentPage < pageCount - 1) displayPage(currentPage + 1);
    });
    dotsWrapper.appendChild(nextButton);

    dotsContainer.appendChild(dotsWrapper);

    const pageCounter = document.createElement("span");
    pageCounter.className = "page-counter";
    pageCounter.textContent = `Page 1 of ${pageCount}`;
    dotsContainer.appendChild(pageCounter);

    displayPage(0); // Show first page
  } catch (error) {
    console.error("Error loading projects:", error);
    container.innerHTML =
      '<p style="color: var(--text-muted);">Failed to load projects.</p>';
  }
}

document.addEventListener("DOMContentLoaded", renderProjects);

// GSAP Hero Name Text Cycling Animation 
(function () {
  gsap.registerPlugin(TextPlugin);

  const names = ["James Henshaw", "Jaimz H", "Jaimz with a Z", "Jaimz is a Dev", "Him"];

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
        i === currentText.length ? 0 : `+=${charDelay}`,
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



