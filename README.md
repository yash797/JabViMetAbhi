# 💍 Vidhi & Abhishek — Wedding Website

A premium Indian wedding invitation microsite built with **React 18**, **Tailwind CSS 3**, and custom CSS animations.

---

## ✨ Features

- 🦚 **Custom SVG Monogram** — hand-crafted Mughal arch + peacock + अV logo
- 🌸 **Animated Hero** — floating petals, gold sparkles, parallax scroll, corner botanicals
- ⏱️ **Live Countdown** — ticking to 9th May 2026, 11:00 AM
- 📅 **Full Schedule** — Day 1 (Baarat, Mahera, Sangeet, DJ) & Day 2 (Carnival, Haldi, Wedding)
- 👗 **Dress Code Guide** — per-event attire cards
- 🗺️ **Venue & Map** — embedded Google Maps for Sapphero Resorts Shirdi
- 🚗 **How to Reach** — Air, Train, Road directions
- 📱 **Mobile-first responsive** — works beautifully on all screen sizes
- 🎨 **Regal palette** — ivory, gold, teal, blush, marigold, leaf green

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Install & Run

```bash
# 1. Navigate into the project
cd vidhi-abhishek-wedding

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The site will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output will be in the `build/` folder — ready to deploy to Netlify, Vercel, or GitHub Pages.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Fixed nav with mobile hamburger
│   ├── Hero.jsx            # Full-screen cinematic hero
│   ├── MonogramSVG.jsx     # SVG monogram: arch + peacock + अV
│   ├── CornerFloral.jsx    # Botanical corner decorations
│   ├── Countdown.jsx       # Live countdown timer
│   ├── Events.jsx          # 2-day schedule with color-coded cards
│   └── Sections.jsx        # Couple, DressCode, Venue, HowToReach, Footer
├── App.jsx                 # Root component
├── index.js                # Entry point
└── index.css               # Global styles + Tailwind + CSS variables + animations
```

---

## 🎨 Color Palette

| Name         | Value     |
|--------------|-----------|
| Ivory        | `#FAF6EE` |
| Gold         | `#C8963C` |
| Gold Dark    | `#7A5510` |
| Gold Light   | `#E4C47A` |
| Teal         | `#1A6B6B` |
| Blush        | `#F2C4C4` |
| Marigold     | `#E8961E` |
| Leaf Green   | `#3A7A3A` |

---

## 🌐 Deploying to Netlify (Recommended)

1. Run `npm run build`
2. Drag the `build/` folder into [netlify.com/drop](https://app.netlify.com/drop)
3. Your site is live instantly!

---

## 📝 Customisation Notes

- **Couple names/dates**: Edit `Hero.jsx`, `Countdown.jsx`, `Sections.jsx`
- **Events**: Modify the `DAY1` / `DAY2` arrays in `Events.jsx`
- **Venue details**: Update `Sections.jsx` → `Venue` component
- **Logo**: Replace `MonogramSVG.jsx` with your own SVG or `<img>` tag
- **Colors**: Edit CSS variables in `index.css` `:root`

---

*Made with ♥ for Vidhi & Abhishek's wedding — May 2026, Shirdi*
