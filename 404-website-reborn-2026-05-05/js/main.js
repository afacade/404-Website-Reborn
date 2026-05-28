// ==========================================================================
// 404 [COME FIND ME] — shared scripts
// ==========================================================================

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Services accordion
  document.querySelectorAll(".service-item").forEach(item => {
    const header = item.querySelector(".service-item__header");
    if (!header) return;
    header.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".service-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Work filter chips
  const chips = document.querySelectorAll(".work-filter__chip");
  const tiles = document.querySelectorAll(".work-tile");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      tiles.forEach(tile => {
        if (filter === "all" || tile.dataset.category === filter) {
          tile.style.display = "";
        } else {
          tile.style.display = "none";
        }
      });
    });
  });

  // Contact form no-op (demo)
  const form = document.querySelector(".cta__form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector(".cta__btn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Thanks — we'll be in touch";
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2500);
      }
    });
  }
});
