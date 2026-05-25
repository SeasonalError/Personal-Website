# Personal Website Starter

This project is a static personal portfolio website made with plain **HTML + CSS + JavaScript**.

## Pages included

- `index.html` → Main portfolio page.
- `quantum-chemistry.html` → Dedicated Quantum Chemistry page (notes + recommended readings).
- `recommended-readings.html` → Global recommended reading library page.

## 1) Run it locally

Because this is a static site, you can open `index.html` directly in your browser.

For a better local workflow, run a small local server:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

---

## 2) Put it online (3 easy options)

## Option A: GitHub Pages (free)

1. Create a GitHub repo and push these files (`index.html`, `styles.css`, `script.js`, and extra pages).
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch), folder `/ (root)`
4. Save.
5. Wait ~1–3 minutes, then your site is live at a URL like:
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Option B: Netlify (free)

1. Go to Netlify and choose **Add new site → Import an existing project** (or drag-and-drop the folder).
2. If importing from Git:
   - Build command: *(leave empty)*
   - Publish directory: `.`
3. Deploy.
4. Netlify provides a live URL instantly (you can later connect a custom domain).

## Option C: Vercel (free)

1. Import the repo in Vercel.
2. Framework preset: **Other** (or static).
3. Build command: *(empty)*
4. Output directory: `.`
5. Deploy.

---

## 3) How to edit your website content

All content is in HTML files, style is in `styles.css`, and behavior is in `script.js`.

### Main page edits (`index.html`)

- Change your name in title, hero heading, and footer.
- Edit project cards inside `#projects`.
- The **Quantum Chemistry** card already routes to a separate page (`quantum-chemistry.html`) in the same tab.
- Edit the **Things I Recommend Reading** section and button link.

### Quantum Chemistry page edits (`quantum-chemistry.html`)

This page has two sections:

1. **My Notes (PDF Library)**
2. **Recommended Readings**

#### How to add your notes PDFs

1. Create folder:
   - `assets/quantum-notes/`
2. Upload PDFs there (example: `lecture-notes-03.pdf`).
3. Add a new card in `quantum-chemistry.html` linking to that file:

```html
<a href="assets/quantum-notes/lecture-notes-03.pdf">Open PDF</a>
```

#### How to add recommended readings

- For external paper/book links, use a normal URL in `<a href="https://...">`.
- For uploaded paper PDFs, place files in:
  - `assets/quantum-readings/`
  and link to them.

### Global reading page edits (`recommended-readings.html`)

- Add books under `#books`.
- Add papers under `#papers`.
- Use either external links or local PDFs (e.g., `assets/readings/`).

### Change colors/visual style

In `styles.css`, edit variables under `:root`:

- `--accent`
- `--accent-2`
- `--bg`

Quantum Chemistry page has an additional class-based theme (`.quantum-theme`) that you can tweak.

---

## 4) Recommended next improvements

- Replace placeholder text with real bio/projects.
- Add real PDFs and reading links.
- Add a profile image and downloadable resume.
- Add a custom domain.
- Add analytics (Plausible or Google Analytics).
- Add a contact form service (Formspree, Getform, etc.).
