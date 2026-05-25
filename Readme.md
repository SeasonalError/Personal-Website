# Personal Website Starter

This project is a static personal portfolio website made with plain **HTML + CSS + JavaScript**.

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

1. Create a GitHub repo and push these files (`index.html`, `styles.css`, `script.js`, etc.).
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

All content is in `index.html`, and style/motion are in `styles.css` + `script.js`.

### Change your name and hero text

In `index.html`:

- `<title>Portfolio | Your Name</title>`
- `Hi, I'm <span class="text-gradient">Your Name</span>.`
- Footer line with `Your Name`

### Add/edit projects

In `index.html`, look for the `#projects` section and duplicate or edit each project card:

```html
<article class="project-card glass floating">
  <h3>Project Name</h3>
  <p>Project description...</p>
  <span>Tech stack</span>
</article>
```

### Update contact links

In the `#contact` section (`index.html`), change:

- Email (`mailto:you@example.com`)
- LinkedIn URL
- GitHub URL

### Change colors/visual style

In `styles.css`, edit variables at the top under `:root`, for example:

- `--accent`
- `--accent-2`
- `--bg`

### Turn off specific effects (if you want simpler)

- Cursor glow: remove `.cursor-glow` element in `index.html` and matching JS block in `script.js`.
- Floating cards: remove `floating` class from project cards.
- Reveal-on-scroll: remove `reveal` classes or JS observer logic.

---

## 4) Recommended next improvements

- Replace placeholder text with real bio/projects.
- Add a profile image and downloadable resume.
- Add a custom domain.
- Add analytics (Plausible or Google Analytics).
- Add a contact form service (Formspree, Getform, etc.).
