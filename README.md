# CleanNest – Professional Cleaning Services, Jalandhar 💧

A fast, interactive, dependency-free website (plain HTML/CSS/JS — no build step, no frameworks) for **CleanNest**, Jalandhar's professional deep-cleaning team. Content mirrors the live business details from [cleannest.in](https://cleannest.in).

## ✨ Features

- **Multi-page site** — Home, Services, About, Contact, FAQ and Book Online
- **WhatsApp-first booking** — every quote/booking form (hero, contact, book) opens WhatsApp with a pre-filled message to `+91 76100 00654`
- **9 real services** — full house, kitchen, bathroom, sofa dry cleaning, carpet & steam, floor renew, AC, chimney and commercial cleaning — each with details and a "Get a price" WhatsApp link
- **Packages** — Regular Home Clean, Deep Clean, Move-Out Clean, Office/Commercial — all quoted individually on WhatsApp (no published prices, matching the live model)
- **Real reviews & ratings** — 4.9/5 on Google, 219 reviews, 3 real review cards, links to the Google Business Profile
- **Service areas** — 12 cities across Punjab
- **FAQ accordion** (9 questions), **cleaning guides** (links to the live blog), **stats band**, **sticky mobile Call/WhatsApp bar**, scroll animations
- **Fully responsive** — looks great on phone, tablet and desktop

## 🚀 Run it locally

```bash
cd cleannest-website
python3 -m http.server 8000
# → http://localhost:8000
```

Or just open any `.html` file in a browser — it works straight from the file system.

## ✏️ Edit your business details

Everything lives in **one file**: [`js/config.js`](js/config.js)

| Setting | What it holds |
|---|---|
| `phoneDisplay` / `phoneHref` | `+91 76100 00654` / `+917610000654` |
| `whatsappNumber` | `917610000654` — powers all quote/booking forms |
| `email` | `cleannestclub@gmail.com` |
| `address` / `serviceArea` | Shop 3, Wadala Rd… + the 12-city service area |
| `gmbUrl` / `gmbReviewUrl` | Google Business Profile + write-a-review links |
| `instagramUrl` | `https://www.instagram.com/cleannest.co` |
| `rating` | `4.9` / `219` reviews |
| `reviews[]` | Real reviews from the GMB profile |
| `services[]` | The 9 services (icon, title, description, bullets) |
| `packages[]` | The 4 packages, quoted on WhatsApp |
| `faqs[]` | The 9 FAQ questions/answers |

The site reads `config.js` at load time, so changes apply instantly — just refresh the page.

## 🧪 Tests

DOM render tests for all six pages (needs Node):

```bash
npm install   # installs jsdom + serve
npm test
```

## ☁️ Deploying

The site is 100% static — drag-and-drop deploy to [Netlify](https://netlify.com), [Vercel](https://vercel.com), or GitHub Pages. No configuration needed.

## 📁 Files

```
cleannest-website/
├── index.html      # homepage (hero, quote form, services, reviews, areas)
├── services.html   # all 9 services + packages
├── about.html      # story, values, stats, reviews
├── contact.html    # contact methods, hours, message form, cities
├── faq.html        # FAQ accordion + cleaning guides
├── book.html       # full booking form → WhatsApp
├── css/styles.css  # all styling
├── js/config.js    # ⭐ BUSINESS DETAILS — edit this
├── js/script.js    # interactivity (injection, quote/booking, FAQ…)
└── test/           # render test suite
```

> Legal pages (Privacy Policy, Terms, Refund) currently link to the live site (`cleannest.in/…`); add local copies if you deploy this as the canonical site. The live site also has per-service, per-city and blog pages not yet reproduced here.
