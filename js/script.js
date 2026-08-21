/* ============================================================
   CLEANNEST — PROFESSIONAL CLEANING SERVICES, JALANDHAR
   All interactivity: content injection from config.js,
   WhatsApp quote + booking forms, FAQ, nav, reveals.
   ============================================================ */

(function () {
  "use strict";

  var CFG = window.CLEANNEST_CONFIG || {};

  /* ---------- Small helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function stars(n) {
    n = Math.max(0, Math.min(5, Math.round(n || 5)));
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  /* ---------- Toast ---------- */
  var toast = $("#toast");
  var toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("toast--show"); }, 3200);
  }

  /* ---------- WhatsApp ---------- */
  function openChat(text) {
    var number = (CFG.whatsappNumber || CFG.phoneHref || "").replace(/\D/g, "");
    if (number) {
      window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(text), "_blank");
      showToast("Opening WhatsApp — just hit send!");
    } else {
      var mailto = "mailto:" + (CFG.email || "") + "?subject=" + encodeURIComponent("Booking request — CleanNest") + "&body=" + encodeURIComponent(text);
      window.location.href = mailto;
      showToast("Opening your email app…");
    }
  }

  function serviceQuoteMessage(serviceTitle) {
    return "Hi CleanNest! I'd like a quote for " + (serviceTitle || "cleaning") + ".";
  }

  /* Build a wa.me link with a pre-filled message (safe to use in injected HTML). */
  function waHref(text) {
    return "https://wa.me/" + (CFG.whatsappNumber || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text);
  }

  /* ---------- 1. Inject business details from config ---------- */
  function applyBusinessDetails() {
    var phoneHref = CFG.phoneHref || "";
    var phoneDisplay = CFG.phoneDisplay || "";
    var email = CFG.email || "";

    // Phone links
    $$("[id$='Call'], [id$='CallBtn'], [id$='Phone'], [id$='CallText']").forEach(function (el) {
      if (el.tagName === "A") el.setAttribute("href", "tel:" + phoneHref);
      if (el.id === "heroCallText") el.textContent = phoneDisplay;
      if (el.id === "contactPhone" || el.id === "footerPhone") el.textContent = phoneDisplay;
    });

    // WhatsApp links (plain anchors with class wa-link)
    $$(".wa-link").forEach(function (el) {
      var t = el.getAttribute("data-wa") || "Hi CleanNest! I'd like a free quote for cleaning.";
      el.setAttribute("href", waHref(t));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // Email links
    $$("#contactEmail, #footerEmail").forEach(function (el) {
      el.setAttribute("href", "mailto:" + email);
      el.textContent = email;
    });

    // Instagram links
    $$("#contactInstagram, #footerInstagram").forEach(function (el) {
      el.setAttribute("href", CFG.instagramUrl || "#");
      if (el.id === "footerInstagram") el.textContent = CFG.instagramHandle || "Instagram";
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    // Address
    $$("#contactAddress, #footerAddress").forEach(function (el) {
      el.textContent = CFG.address || "";
    });

    // Service area
    if (CFG.serviceArea) {
      var area = $("#contactArea");
      if (area) area.textContent = CFG.serviceArea;
    }

    // Rating
    var score = CFG.rating ? CFG.rating.score : "5.0";
    var count = CFG.rating ? CFG.rating.reviewCount : 0;
    var starCount = CFG.rating ? Math.max(0, Math.min(5, Math.round(CFG.rating.max || 5))) : 5;

    var heroRating = $("#heroRating");
    if (heroRating) heroRating.textContent = score;
    var heroCount = $("#heroReviewCount");
    if (heroCount) heroCount.textContent = count >= 100 ? count + "+" : count;

    var reviewScore = $("#reviewScore");
    if (reviewScore) reviewScore.textContent = score;
    var reviewStars = $("#reviewStars");
    if (reviewStars) reviewStars.textContent = stars(starCount);
    var reviewCount = $("#reviewCount");
    if (reviewCount) reviewCount.textContent = "Based on " + count + " reviews";

    // GMB links
    $$("#reviewGmbLink, #footerGmb").forEach(function (el) {
      if (CFG.gmbUrl && CFG.gmbUrl !== "#") el.setAttribute("href", CFG.gmbUrl);
    });
    var writeReview = $("#writeReviewLink");
    if (writeReview && CFG.gmbReviewUrl) writeReview.setAttribute("href", CFG.gmbReviewUrl);

    // Hours note
    var hoursNote = $("#hoursNote");
    if (hoursNote && CFG.hoursNote) hoursNote.textContent = CFG.hoursNote;
  }

  /* ---------- 2. Render services ---------- */
  function iconFor(key) {
    var icons = {
      house: "🏠", kitchen: "🍳", bathroom: "🛁", sofa: "🛋️",
      carpet: "🧹", floor: "🪣", ac: "❄️", chimney: "🔥",
      commercial: "🏢", default: "🧽"
    };
    return icons[key] || icons.default;
  }

  function serviceCard(s) {
    var wa = waHref(serviceQuoteMessage(s.title));
    return (
      '<article class="service reveal" id="' + esc(s.id) + '">' +
        '<div class="service__icon">' + iconFor(s.icon) + '</div>' +
        '<h3 class="service__title">' + esc(s.title) + '</h3>' +
        '<p class="service__desc">' + esc(s.desc) + '</p>' +
        '<div class="service__foot">' +
          '<a class="service__link service__link--wa" href="' + wa + '" target="_blank" rel="noopener">Get a price</a>' +
          '<a class="service__link" href="services.html#' + esc(s.id) + '">Details →</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderServices() {
    var grid = $("#servicesGrid");
    if (!grid) return;
    grid.innerHTML = (CFG.services || []).map(serviceCard).join("");
  }

  /* ---------- 3. Render detailed service blocks (services page) ---------- */
  function renderServiceDetails() {
    var wrap = $("#serviceDetails");
    if (!wrap) return;
    wrap.innerHTML = (CFG.services || []).map(function (s, i) {
      var bullets = (s.bullets || []).map(function (b) {
        return '<li><span>✓</span>' + esc(b) + '</li>';
      }).join("");
      var wa = waHref(serviceQuoteMessage(s.title));
      return (
        '<article class="svc reveal" id="' + esc(s.id) + '">' +
          '<div class="svc__head">' +
            '<span class="service__icon">' + iconFor(s.icon) + '</span>' +
            '<div><h3 class="svc__title">' + esc(s.title) + '</h3>' +
            '<p class="svc__desc">' + esc(s.desc) + '</p></div>' +
          '</div>' +
          '<ul class="svc__bullets">' + bullets + '</ul>' +
          '<div class="svc__actions">' +
            '<a class="btn btn--primary btn--small" href="' + wa + '" target="_blank" rel="noopener">Get a price</a>' +
            '<a class="btn btn--ghost btn--small" href="book.html">Book this service</a>' +
          '</div>' +
          (i < (CFG.services || []).length - 1 ? '<hr class="svc__rule" />' : '') +
        '</article>'
      );
    }).join("");
  }

  /* ---------- 3b. Render packages (services page) ---------- */
  function renderPackages() {
    var wrap = $("#packagesGrid");
    if (!wrap) return;
    wrap.innerHTML = (CFG.packages || []).map(function (p) {
      var bullets = (p.bullets || []).map(function (b) {
        return '<li><span>✓</span>' + esc(b) + '</li>';
      }).join("");
      var wa = waHref("Hi CleanNest! I'd like a quote for the " + p.title + " package.");
      return (
        '<article class="pkg reveal' + (p.tag ? " pkg--hot" : "") + '">' +
          (p.tag ? '<span class="pkg__tag">' + esc(p.tag) + '</span>' : '') +
          '<h3 class="pkg__title">' + esc(p.title) + '</h3>' +
          '<p class="pkg__price">Quote on WhatsApp</p>' +
          '<ul class="pkg__bullets">' + bullets + '</ul>' +
          '<a class="btn btn--primary btn--block btn--small" href="' + wa + '" target="_blank" rel="noopener">Get a price →</a>' +
        '</article>'
      );
    }).join("");
  }

  /* ---------- 4. Render reviews ---------- */
  function renderReviews() {
    var grid = $("#reviewsGrid");
    if (!grid) return;
    var reviews = CFG.reviews || [];
    grid.innerHTML = reviews.map(function (r) {
      var initials = (r.name || "? ").trim().split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
      return (
        '<article class="review reveal">' +
          '<div class="review__stars">' + stars(r.stars) + '</div>' +
          '<p class="review__text">“' + esc(r.text) + '”</p>' +
          '<div class="review__who">' +
            '<span class="review__avatar">' + esc(initials) + '</span>' +
            '<div><div class="review__name">' + esc(r.name) + '</div>' +
            '<div class="review__service">' + esc(r.service || "") + '</div></div>' +
          '</div>' +
        '</article>'
      );
    }).join("");
  }

  /* ---------- 5. Render FAQ accordion ---------- */
  function renderFaq() {
    var list = $("#faqList");
    if (!list) return;
    var faqs = CFG.faqs || [];
    list.innerHTML = faqs.map(function (f, i) {
      return (
        '<div class="faq__item reveal" data-open="false">' +
          '<button class="faq__q" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
            esc(f.q) + '<span class="faq__icon">+</span>' +
          '</button>' +
          '<div class="faq__a" id="faq-a-' + i + '"><div class="faq__a-inner">' + esc(f.a) + '</div></div>' +
        '</div>'
      );
    }).join("");

    $$(".faq__q", list).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq__item");
        var isOpen = item.getAttribute("data-open") === "true";
        var answer = btn.nextElementSibling;
        // close others
        $$(".faq__item", list).forEach(function (other) {
          if (other !== item) {
            other.setAttribute("data-open", "false");
            other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
            other.querySelector(".faq__a").style.maxHeight = "0px";
          }
        });
        item.setAttribute("data-open", String(!isOpen));
        btn.setAttribute("aria-expanded", String(!isOpen));
        answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
      });
    });
  }

  /* ---------- 6. Render hours ---------- */
  function renderHours() {
    var list = $("#hoursList");
    if (!list || !CFG.hours) return;
    list.innerHTML = CFG.hours.map(function (h) {
      return '<li><span>' + esc(h.day) + '</span><span>' + esc(h.time) + '</span></li>';
    }).join("");
  }

  /* ---------- 7. Render cities chips ---------- */
  function renderCities() {
    var wrap = $("#citiesList");
    if (wrap) {
      wrap.innerHTML = (CFG.cities || []).map(function (c) {
        return '<span class="chip">' + esc(c) + '</span>';
      }).join("");
    }
    var footerCities = $("#footerCities");
    if (footerCities) footerCities.textContent = (CFG.cities || []).join(" · ");
  }

  /* ---------- 8. Render stats (about page) ---------- */
  function renderStats() {
    var st = CFG.stats || {};
    var map = {
      statHomes: st.homesCleaned ? st.homesCleaned + "+" : null,
      statCities: st.cities,
      statRating: CFG.rating ? CFG.rating.score + " ★" : null,
      statDays: st.days
    };
    Object.keys(map).forEach(function (id) {
      var el = $("#" + id);
      if (el && map[id] !== null && map[id] !== undefined) el.textContent = map[id];
    });
  }

  /* ---------- 9. Quote form (hero / contact) → WhatsApp ---------- */
  function wireQuoteForms() {
    $$("[data-quote-form]").forEach(function (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var name = (form.querySelector("[data-q-name]") || {}).value || "";
        var phone = (form.querySelector("[data-q-phone]") || {}).value || "";
        var service = (form.querySelector("[data-q-service]") || {}).value || "";
        var message = (form.querySelector("[data-q-message]") || {}).value || "";
        if (!phone) {
          showToast("Please add your WhatsApp number.");
          return;
        }
        var msg =
          "Hi CleanNest! I'd like a free quote.\n\n" +
          (name ? "• Name: " + name.trim() + "\n" : "") +
          "• WhatsApp: " + phone.trim() + "\n" +
          (service ? "• Service: " + service + "\n" : "") +
          (message ? "• Message: " + message.trim() + "\n" : "") +
          "\nCan I get a quote?";
        openChat(msg);
      });
    });
  }

  /* ---------- 10. Booking form → WhatsApp ---------- */
  function wireBooking() {
    var form = $("#bookingForm");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = $("#bkName").value.trim();
      var phone = $("#bkPhone").value.trim();
      var service = $("#bkService").value;
      var size = $("#bkSize").value.trim();
      var date = $("#bkDate").value;
      var area = $("#bkArea").value.trim();
      var message = $("#bkMessage").value.trim();

      if (!name || !phone) {
        showToast("Please add your name and WhatsApp number.");
        return;
      }

      var msg =
        "Hi CleanNest! I'd like to book a cleaning.\n\n" +
        "• Name: " + name + "\n" +
        "• WhatsApp: " + phone + "\n" +
        "• Service: " + service + "\n" +
        (size ? "• Home / space size: " + size + "\n" : "") +
        (date ? "• Preferred date: " + date + "\n" : "") +
        (area ? "• Your area: " + area + "\n" : "") +
        (message ? "• Notes: " + message + "\n" : "");
      openChat(msg);
    });
  }

  /* ---------- 11. Navbar scroll + mobile toggle ---------- */
  function wireNav() {
    var nav = $("#navbar");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 10) nav.classList.add("nav--scrolled");
      else nav.classList.remove("nav--scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggle = $("#navToggle");
    var links = $("#navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("nav__links--open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("nav__links--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 12. Reveal-on-scroll ---------- */
  function wireReveals() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("reveal--visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 13. Footer year ---------- */
  function setYear() {
    var el = $("#footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyBusinessDetails();
    renderServices();
    renderServiceDetails();
    renderPackages();
    renderReviews();
    renderFaq();
    renderHours();
    renderCities();
    renderStats();
    wireQuoteForms();
    wireBooking();
    wireNav();
    wireReveals();
    setYear();
  });
})();
