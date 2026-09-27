# 🎂 Judath's Private Birthday Website

A private vintage birthday portal created with love for Judath, featuring a warm vintage map artwork with animated flight routes, an interactive mailbox hotspot, a full-screen wish gallery, and a Kith & Kin scrapbook linked directly to a Google Form and Google Sheet.

---

## 🌟 Application Flow & Architecture

```
[ Friends & Family ]
        │
        ▼ (Submits wish + photo)
  Google Form  (https://forms.gle/mtDTG3BV6nRyZW7L7)
        │
        ▼ (Appends row)
  Google Sheet
        │
        ▼ (Reads rows & handles permanent deletion)
  Google Apps Script (Code.gs)
        │
        ▼ (Real-time JSON API)
  Judath's Birthday Website
        │
        ├─► [ Landing Page: Doors & Teddy Bears ]
        ├─► [ JUDATH: Vintage Map Artwork, Dynamic Flights, Glowing Mailbox ]
        │         └─► Full-Screen Wishes Gallery & Individual Memory Modals
        └─► [ KITH & KIN: Polaroid Wish Cards, Make Your Wish, PIN Deletion ]
```

---

## 🚀 Setting Up the Google Apps Script Backend

### Step 1: Open Your Linked Google Sheet
1. Open your Google Form: `https://forms.gle/mtDTG3BV6nRyZW7L7`
2. Go to the **Responses** tab and click **Link to Sheets** (or open the existing responses spreadsheet).

### Step 2: Add `Code.gs`
1. Inside the Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any existing code in `Code.gs` and paste the contents of `Code.gs` from this project.

### Step 3: Configure the Private Admin PIN
1. In the Apps Script editor, click the **Project Settings** icon (gear icon on the left sidebar).
2. Scroll down to **Script Properties** and click **Add script property**.
3. Set:
   - **Property**: `ADMIN_PIN`
   - **Value**: *[Your private secret PIN, e.g. 1998 or 2026]*
4. Click **Save script properties**.
   *(Note: This PIN is stored securely in Google's cloud and is NEVER exposed to the frontend code!)*

### Step 4: Deploy as a Web App
1. At the top right of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure:
   - **Description**: `Judath Birthday Wishes API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so Judath's website can load the wishes without requiring viewers to log in)*
4. Click **Deploy**.
5. Grant permissions if prompted.
6. Copy the resulting **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

### Step 5: Connect URL to the Website
You can either:
- Open the website, click the **Settings icon** on the Kith & Kin page, and paste your URL.
- Or set it permanently in `src/config.ts`:
  ```typescript
  export const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
  ```

---

## 📦 Static Deployment (e.g. GitHub Pages)

This project compiles directly into a fast, standalone static website without requiring a Node.js server.

1. Build the production files:
   ```bash
   npm run build
   ```
2. The compiled assets will be generated in the `dist/` directory.
3. Deploy the `dist/` folder to GitHub Pages, Netlify, Vercel, or Firebase Hosting.

---

## 🎨 Visual Features & Interactions

1. **Dark Brown Landing Page**
   - Welcoming title: *"🎂 A Birthday, Just for You 🎂"*
   - Subtitle: *"choose your door..."*
   - Two large cream doors for **JUDATH** and **Kith & Kin**, each accompanied by an adorable storybook teddy bear illustration.

2. **Judath's Vintage Map Page**
   - Preserves the supplied background artwork with world map, vintage books, globe, compass, and Jesus embracing Judath.
   - **Dynamic Flights**: 4 animated airplanes gliding smoothly along curved bezier flight paths over continents with subtle banking and contrails.
   - **Interactive Mailbox**: A hotspot over the bottom-left rustic mailbox. Hovering or tapping activates a warm glowing amber aura (`animate-pulse-glow`) and tooltip hint: *"💌 Open your wishes"*.

3. **Mailbox Wishes View & Modals**
   - Full-screen gallery of square memory cards showing the wisher's photo and name.
   - Clicking opens the dynamic modal:
     - *"Your [Relationship] [Name] wished you…"*
     - *[Their wish message]*
     - *"And here is your memory with [Name]… 💛"*
     - *[Their uploaded photo in a physical polaroid frame]*

4. **Kith & Kin Wishes Page**
   - Prominent **"MAKE YOUR WISH"** button linking to `https://forms.gle/mtDTG3BV6nRyZW7L7`.
   - Dynamic polaroid card gallery with slight organic scrapbook rotations, washi tape styling, and photo frames.
   - **Permanent Deletion**: Delete button on each card prompts for the Admin PIN and sends a secure request to Google Apps Script to permanently remove the row from the Google Sheet.
