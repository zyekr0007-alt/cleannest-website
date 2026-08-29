/* Full DOM render test for the CleanNest website.
   Loads each real HTML page + config.js + script.js in jsdom,
   then asserts every section rendered with config data. */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const SITE = path.join(__dirname, "..");

let failures = 0;
function check(label, cond) {
  console.log((cond ? "PASS" : "FAIL") + "  " + label);
  if (!cond) failures++;
}

function loadPage(page) {
  const html = fs.readFileSync(path.join(SITE, page), "utf8");
  const dom = new JSDOM(html, {
    url: "http://127.0.0.1:8181/" + page,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.scrollY = 0;
  window.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
    unobserve() {}
  };
  window.open = () => null;
  window.eval(fs.readFileSync(path.join(SITE, "js", "config.js"), "utf8"));
  window.eval(fs.readFileSync(path.join(SITE, "js", "script.js"), "utf8"));
  dom.window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));
  return dom.window.document;
}

const GMB = "https://www.google.com/maps/place/Cleannest+-+Deep+Cleaning+Services/@31.2944952,75.5732681,17z/data=!3m1!4b1!4m6!3m5!1s0x391a5b79437236d7:0x622cc6e49732db5d!8m2!3d31.2944952!4d75.5732681!16s%2Fg%2F11wxm8j5w_";
const WA = "https://wa.me/917610000654?text=";

/* ================= INDEX ================= */
console.log("--- index.html ---");
{
  const doc = loadPage("index.html");
  check("Title is correct", doc.title.includes("CleanNest") && doc.title.includes("Jalandhar"));
  check("Hero rating injected", doc.getElementById("heroRating").textContent === "4.9");
  check("Hero review count injected", doc.getElementById("heroReviewCount").textContent === "219+");
  check("CTA call button wired", doc.getElementById("ctaCall").getAttribute("href") === "tel:+917610000654");
  check("App dock present", doc.querySelector(".app-dock") !== null);
  check("App dock has 7 slots (6 tabs + Book CTA)", doc.querySelectorAll(".app-dock > a").length === 7);
  check("App dock Home tab active on index", doc.querySelector(".dock__item--active").getAttribute("href") === "index.html");
  check("App dock Book CTA present", doc.querySelector(".dock__book-btn") !== null);
  check("App dock icons use 3D sprite", doc.querySelector(".dock__ic svg use").getAttribute("href").includes("3d-sprite.svg#i-house"));
  check("Footer email wired", doc.getElementById("footerEmail").getAttribute("href") === "mailto:cleannestclub@gmail.com");
  check("Footer address wired", doc.getElementById("footerAddress").textContent.includes("Jalandhar, Punjab 144003"));
  check("GMB link points to real listing", doc.getElementById("reviewGmbLink").getAttribute("href") === GMB);
  check("Write-review link wired", doc.getElementById("writeReviewLink").getAttribute("href").startsWith("https://search.google.com/local/writereview"));
  const firstWa = doc.querySelector(".wa-link");
  check("WhatsApp links point to real number", firstWa && firstWa.getAttribute("href").startsWith(WA));
  check("9 service cards rendered", doc.querySelectorAll("#servicesGrid .service").length === 9);
  check("First service is Full House Cleaning", doc.querySelector("#servicesGrid .service__title").textContent === "Full House Cleaning");
  check("Service icons use 3D sprite", doc.querySelector("#servicesGrid .service__icon svg use").getAttribute("href").includes("3d-sprite.svg#i-house"));
  check("Service card has get-a-price WhatsApp link", doc.querySelector("#servicesGrid .service__link--wa").getAttribute("href").startsWith(WA));
  check("3 review cards rendered", doc.querySelectorAll("#reviewsGrid .review").length === 3);
  check("Review stars render", doc.querySelector("#reviewsGrid .review__stars").textContent === "★★★★★");
  check("12 city chips rendered", doc.querySelectorAll("#citiesList .chip").length === 12);
  check("Footer cities filled", doc.getElementById("footerCities").textContent.includes("Ludhiana"));
  check("Hero photo present", doc.querySelector(".hero__photo img").getAttribute("src") === "assets/img/hero-bright.jpg");
  check("Before/after sliders present", doc.querySelectorAll(".ba, .ba-mini").length === 4);
  check("Marquee track duplicated", doc.querySelectorAll(".marquee__item").length === 14);

  let openedUrl = null;
  doc.defaultView.open = (url) => { openedUrl = url; };
  const quoteForm = doc.querySelector("[data-quote-form]");
  quoteForm.querySelector("[data-q-phone]").value = "+91 98123 45678";
  quoteForm.dispatchEvent(new doc.defaultView.Event("submit", { bubbles: true, cancelable: true }));
  check("Quote form opens WhatsApp with real number", openedUrl && openedUrl.startsWith(WA));
  check("Quote message mentions free quote", openedUrl && decodeURIComponent(openedUrl).includes("free quote"));

  check("Footer year is current", doc.getElementById("footerYear").textContent === String(new Date().getFullYear()));
  const navLinks = doc.getElementById("navLinks");
  doc.getElementById("navToggle").click();
  check("Mobile nav opens", navLinks.classList.contains("nav__links--open"));
}

/* ================= SERVICES ================= */
console.log("--- services.html ---");
{
  const doc = loadPage("services.html");
  check("9 detailed service blocks rendered", doc.querySelectorAll("#serviceDetails .svc").length === 9);
  check("First block is Full House Cleaning", doc.querySelector("#serviceDetails .svc__title").textContent === "Full House Cleaning");
  check("Service block has bullets", doc.querySelectorAll("#serviceDetails .svc__bullets li").length >= 3);
  check("4 package cards rendered", doc.querySelectorAll("#packagesGrid .pkg").length === 4);
  check("Deep Clean package flagged as popular", doc.querySelector(".pkg--hot .pkg__title").textContent === "Deep Clean");
  check("Package WhatsApp link works", doc.querySelector("#packagesGrid .pkg .btn").getAttribute("href").startsWith(WA));
  check("Page hero shows title", doc.querySelector(".page-hero__title").textContent.includes("Deep Cleaning Services"));
}

/* ================= ABOUT ================= */
console.log("--- about.html ---");
{
  const doc = loadPage("about.html");
  check("About hero title correct", doc.querySelector(".page-hero__title").textContent === "About CleanNest");
  check("Stats: 400+ homes (counter config)", doc.querySelector('[data-count="400"]').getAttribute("data-suffix") === "+");
  check("Stats: 12 cities (counter config)", doc.querySelector('[data-count="12"]') !== null);
  check("Stats: 4.9 rating (counter config)", doc.querySelector('[data-count="4.9"]').getAttribute("data-decimals") === "1");
  check("Stats: 7 days (counter config)", doc.querySelector('[data-count="7"]') !== null);
  check("3 review cards rendered", doc.querySelectorAll("#reviewsGrid .review").length === 3);
  check("Team photos present", doc.querySelectorAll("img[src^='assets/img/team-']").length === 4);
}

/* ================= CONTACT ================= */
console.log("--- contact.html ---");
{
  const doc = loadPage("contact.html");
  check("Contact phone wired", doc.getElementById("contactPhone").getAttribute("href") === "tel:+917610000654");
  check("Contact email wired", doc.getElementById("contactEmail").getAttribute("href") === "mailto:cleannestclub@gmail.com");
  check("Instagram wired", doc.getElementById("contactInstagram").getAttribute("href") === "https://www.instagram.com/cleannest.co");
  check("Hours row rendered (open 7 days)", doc.querySelectorAll("#hoursList li").length === 1);
  check("Hours text matches", doc.querySelector("#hoursList li").textContent.includes("9:00 AM – 8:00 PM"));
  check("12 city chips rendered", doc.querySelectorAll("#citiesList .chip").length === 12);
  check("Contact form wired to WhatsApp", doc.querySelector(".contact__form").hasAttribute("data-quote-form"));
}

/* ================= FAQ ================= */
console.log("--- faq.html ---");
{
  const doc = loadPage("faq.html");
  const faqItems = doc.querySelectorAll("#faqList .faq__item");
  check("9 FAQ items rendered", faqItems.length === 9);
  check("First FAQ matches config", doc.querySelector(".faq__q").textContent.includes("safe for my family and pets"));
  const firstQ = doc.querySelector(".faq__q");
  const firstItem = firstQ.closest(".faq__item");
  const firstA = firstQ.nextElementSibling;
  Object.defineProperty(firstA, "scrollHeight", { configurable: true, value: 120 });
  firstQ.click();
  check("FAQ opens on click", firstItem.getAttribute("data-open") === "true");
  check("FAQ answer expands", firstA.style.maxHeight === "120px");
  firstQ.click();
  check("FAQ closes on second click", firstItem.getAttribute("data-open") === "false");
  check("4 guide cards rendered", doc.querySelectorAll(".guide").length === 4);
}

/* ================= BOOK ================= */
console.log("--- book.html ---");
{
  const doc = loadPage("book.html");
  check("Booking hero correct", doc.querySelector(".page-hero__title").textContent === "Book a Cleaning");
  check("App dock Book CTA active on book page", doc.querySelector(".dock__book--active") !== null);
  check("11 service options in booking select", doc.querySelectorAll("#bkService option").length === 11);
  const steps = doc.querySelectorAll("#main .grid--steps");
  check("3 what-happens-next steps rendered", steps[0].querySelectorAll(".step").length === 3);
  check("6 how-it-works steps rendered", steps[1].querySelectorAll(".step").length === 6);

  let openedUrl = null;
  doc.defaultView.open = (url) => { openedUrl = url; };
  doc.getElementById("bkName").value = "Test User";
  doc.getElementById("bkPhone").value = "+91 98123 45678";
  doc.getElementById("bkService").value = "Full House Cleaning";
  doc.getElementById("bkDate").value = "2026-02-10";
  doc.getElementById("bookingForm").dispatchEvent(new doc.defaultView.Event("submit", { bubbles: true, cancelable: true }));
  check("Booking opens WhatsApp with real number", openedUrl && openedUrl.startsWith(WA));
  check("Booking message contains name", openedUrl && decodeURIComponent(openedUrl).includes("Test User"));
  check("Booking message contains service", openedUrl && decodeURIComponent(openedUrl).includes("Full House Cleaning"));
}

console.log("\n" + (failures === 0 ? "ALL TESTS PASSED ✓" : failures + " TEST(S) FAILED ✗"));
process.exit(failures === 0 ? 0 : 1);
