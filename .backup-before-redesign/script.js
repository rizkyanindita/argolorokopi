(function () {
  "use strict";

  /* ===== Footer year ===== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Unavailable overlay ===== */
  var menuBtn = document.getElementById("viewMenuBtn");
  var overlay = document.getElementById("unavailableOverlay");
  var overlayClose = document.getElementById("unavailableClose");

  function closeOverlay() {
    overlay.hidden = true;
    if (menuBtn) menuBtn.focus();
  }

  if (menuBtn && overlay && overlayClose) {
    menuBtn.addEventListener("click", function () {
      overlay.hidden = false;
      overlayClose.focus();
    });
    overlayClose.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeOverlay();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeOverlay();
    });
  }

  /* ===== Hero carousel ===== */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dot"));
  var current = 0;
  var SLIDE_INTERVAL = 5500;
  var timer = null;

  function goToSlide(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    dots[current].setAttribute("aria-selected", "false");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    dots[current].setAttribute("aria-selected", "true");
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = window.setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (slides.length && dots.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goToSlide(i);
        startAutoplay();
      });
    });

    var hero = document.getElementById("hero");
    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);
    hero.addEventListener("touchstart", stopAutoplay, { passive: true });
    hero.addEventListener("touchend", startAutoplay, { passive: true });

    startAutoplay();
  }

  /* ===== Sticky CTA visibility ===== */
  var stickyCta = document.getElementById("stickyCta");
  var heroCtaBtn = document.querySelector(".hero-cta");

  if (stickyCta && heroCtaBtn) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stickyCta.classList.remove("is-visible");
          } else {
            stickyCta.classList.add("is-visible");
          }
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(heroCtaBtn);
  }

  /* ===== Scroll reveal animations ===== */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.prototype.slice.call(
              el.parentElement.querySelectorAll(".reveal")
            );
            var index = siblings.indexOf(el);
            var delay = index >= 0 ? index * 100 : 0;
            window.setTimeout(function () {
              el.classList.add("is-visible");
            }, delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
