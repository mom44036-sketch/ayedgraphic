/* ============================================================
   PixelCraft Agency - Main JavaScript
   Author: PixelCraft Team
   ============================================================ */

"use strict";

/* ============================================================
   1. AOS INIT
   ============================================================ */
AOS.init({
  duration: 750,
  easing: "ease-out-cubic",
  once: true,
  offset: 60,
});

/* ============================================================
   2. NAVBAR — Scrolled State
   ============================================================ */
const mainNav = document.getElementById("mainNav");

const handleNavScroll = () => {
  if (window.scrollY > 40) {
    mainNav.classList.add("scrolled");
  } else {
    mainNav.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", handleNavScroll, { passive: true });

/* ============================================================
   3. ACTIVE NAV LINK ON SCROLL
   ============================================================ */
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll("#mainNav .nav-link");

const activateNav = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach((sec) => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((l) => l.classList.remove("active"));
      const active = document.querySelector(`#mainNav a[href="#${id}"]`);
      if (active) active.classList.add("active");
    }
  });
};
window.addEventListener("scroll", activateNav, { passive: true });

/* ============================================================
   4. SMOOTH CLOSE MOBILE NAVBAR ON LINK CLICK
   ============================================================ */
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const collapse = document.getElementById("navbarNav");
    const bsCollapse = bootstrap.Collapse.getInstance(collapse);
    if (bsCollapse) bsCollapse.hide();
  });
});

/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   6. COUNTER ANIMATION (Stats Section)
   ============================================================ */
const animateCounter = (el) => {
  const target   = parseInt(el.getAttribute("data-count"), 10);
  const duration = 2000;
  const step     = Math.ceil(target / (duration / 16));
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString("ar-SA");
  }, 16);
};

// Trigger counters when stats section enters viewport
const statsSection = document.getElementById("stats");
let countersStarted = false;

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll(".stat-number").forEach(animateCounter);
      }
    });
  },
  { threshold: 0.3 }
);
if (statsSection) counterObserver.observe(statsSection);

/* ============================================================
   7. PORTFOLIO FILTER
   ============================================================ */
const filterBtns   = document.querySelectorAll(".pf-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      const cat = item.getAttribute("data-category");

      if (filter === "all" || cat === filter) {
        item.style.display = "";
        item.style.opacity = "0";
        item.style.transform = "scale(.92)";
        // Animate in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.transition = "opacity .4s ease, transform .4s ease";
            item.style.opacity    = "1";
            item.style.transform  = "scale(1)";
          });
        });
      } else {
        item.style.transition = "opacity .3s ease, transform .3s ease";
        item.style.opacity    = "0";
        item.style.transform  = "scale(.9)";
        setTimeout(() => { item.style.display = "none"; }, 320);
      }
    });
  });
});

/* ============================================================
   8. HERO CAROUSEL — Pause on Hover
   ============================================================ */
const heroCarousel = document.getElementById("heroCarousel");
if (heroCarousel) {
  heroCarousel.addEventListener("mouseenter", () => {
    bootstrap.Carousel.getInstance(heroCarousel)?.pause();
  });
  heroCarousel.addEventListener("mouseleave", () => {
    bootstrap.Carousel.getInstance(heroCarousel)?.cycle();
  });
}

/* ============================================================
   9. HERO CAROUSEL — Animate Content on Slide
   ============================================================ */
heroCarousel?.addEventListener("slide.bs.carousel", (e) => {
  // Animate out the current active content
  const currentContent = e.relatedTarget?.querySelector(".hero-content");
  if (currentContent) {
    currentContent.style.opacity = "0";
    currentContent.style.transform = "translateY(20px)";
  }
});

heroCarousel?.addEventListener("slid.bs.carousel", () => {
  const activeContent = heroCarousel
    .querySelector(".carousel-item.active .hero-content");
  if (activeContent) {
    activeContent.style.transition = "none";
    activeContent.style.opacity    = "0";
    activeContent.style.transform  = "translateY(30px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        activeContent.style.transition = "opacity .7s ease, transform .7s ease";
        activeContent.style.opacity    = "1";
        activeContent.style.transform  = "translateY(0)";
      });
    });
  }
});

/* ============================================================
   10. CONTACT FORM — Fake Submit with Feedback
   ============================================================ */
const submitBtn = document.querySelector(".btn-submit");
if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...';
    submitBtn.disabled  = true;

    setTimeout(() => {
      submitBtn.innerHTML =
        '<i class="fas fa-check-circle me-2"></i>تم الإرسال! سنتواصل معك قريباً';
      submitBtn.style.background = "#22c55e";

      setTimeout(() => {
        submitBtn.innerHTML  = originalHTML;
        submitBtn.disabled   = false;
        submitBtn.style.background = "";
      }, 3500);
    }, 1800);
  });
}

/* ============================================================
   11. SCROLL PROGRESS INDICATOR (thin top bar)
   ============================================================ */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed; top: 0; right: 0; left: 0; height: 2.5px;
  background: linear-gradient(90deg, #ffc30b 0%, #ff8c00 100%);
  transform-origin: right; transform: scaleX(0);
  z-index: 99999; transition: transform .1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.body.scrollHeight - window.innerHeight;
  const progress   = scrollTop / docHeight;
  progressBar.style.transform = `scaleX(${progress})`;
}, { passive: true });

/* ============================================================
   12. PARALLAX EFFECT on hero shapes
   ============================================================ */
const shape1 = document.querySelector(".shape-1");
const shape2 = document.querySelector(".shape-2");
const shape3 = document.querySelector(".shape-3");

window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  if (shape1) shape1.style.transform = `translate(${x * .8}px, ${y * .8}px)`;
  if (shape2) shape2.style.transform = `translate(${-x * .5}px, ${-y * .5}px)`;
  if (shape3) shape3.style.transform = `translate(${x * .3}px, ${y * .3}px)`;
}, { passive: true });

/* ============================================================
   13. CURSOR GLOW EFFECT (subtle)
   ============================================================ */
const glow = document.createElement("div");
glow.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9998;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,195,11,.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left .15s ease, top .15s ease;
`;
document.body.appendChild(glow);

window.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top  = e.clientY + "px";
}, { passive: true });

/* ============================================================
   14. NAVBAR LINK HOVER UNDERLINE RIPPLE (extra polish)
   ============================================================ */
navLinks.forEach((link) => {
  link.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-1px)";
  });
  link.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

/* ============================================================
   INIT LOG
   ============================================================ */
console.log("%cPixelCraft Agency 🎨", "font-size:18px;font-weight:900;color:#0b3a5e;");
console.log("%cDesigned & Developed with ❤️", "color:#ffc30b;font-size:12px;");
