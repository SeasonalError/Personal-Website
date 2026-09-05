# Personal Website

This project is a static personal portfolio website made with plain **HTML + CSS + JavaScript**.

## Pages included

- `index.html` → Main portfolio page.
- `particle-physics.html` → Particle Physics reading journey, local checklist, notes and research resources.
- `quantum-chemistry.html` → Compatibility redirect to the Particle Physics page.
- `data-analysis.html` → Scientific and financial data-analysis projects.
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

The main portfolio, data-analysis page and reading library use `styles.css` and `script.js`. The particle physics page uses its own `particle-physics.css` and `particle-physics.js`, so its design can evolve independently.

### Main page edits (`index.html`)

- Change your name in title, hero heading, and footer.
- Edit project cards inside `#projects`.
- The **Particle Physics** card routes to `particle-physics.html` in the same tab.
- Edit the **Things I Recommend Reading** section and button link.

### Particle Physics page (`particle-physics.html`)

The page contains a cinematic detector hero, the study roadmap, an illustrative animated track display, three existing notes, two LHCb reports and a reading shelf. The older `quantum-chemistry.html` URL redirects here and preserves section fragments such as `#my-notes` and `#recommended` when JavaScript is available. With JavaScript disabled or blocked, it retains those bookmarked sections and provides direct links to their new destinations instead of dropping the fragment through a meta refresh.

#### Update published progress

Each roadmap row has a stable `data-milestone` identifier. Add or remove the `checked` attribute in the HTML to change the **published** completion status. Keep the snapshot date, initial count, and `<progress>` value in sync. If adding or removing milestones, update the displayed total and progress maximum as well.

The initial snapshot is based on study progress through 5 September 2026: five foundations covered, with special relativity and second quantization ahead of the particle physics and QCD goals. These are study milestones, not claims of mastery.

Checkbox changes made in a browser are **local to that browser and origin**. They persist in `localStorage` under `nsk-particle-physics-progress-v1`; no visitor changes the public website or another person's progress. “Reset to published progress” restores the defaults in the HTML. When storage is blocked, edits work for the current visit and the page explains that they could not be saved. Old saved values can be cleared with the reset control when published progress changes.

#### Notes and links

The original PDFs remain under `assets/quantum-notes/`. Add new note links in `#my-notes`. The CERN reports remain at their original paths. Add resources in `#recommended`; no carousel script or dependency is required.

#### Motion and accessibility

- The hero combines an original conceptual detector image with moving illustrative traces and subtle pointer parallax.
- The transverse detector drawing is illustrative, not a recorded event or quantitative simulation.
- “Pause motion” stops animation and is remembered locally. The initial state respects `prefers-reduced-motion`.
- Animation pauses in hidden tabs and offscreen sections, and canvas resolution is capped for device performance.
- Content and PDF links remain visible without JavaScript. Keyboard focus, native checkboxes and reduced-motion styles are included.

#### Design and assets

The Particle Physics page uses a graphite palette, ice-blue text, amber accents, condensed display type and ruled notebook layouts. It does not load the portfolio's shared CSS or JavaScript. Change its tokens at the top of `particle-physics.css`.

All required visual assets and fonts are self-hosted under `assets/particle-physics/`. There are no runtime CDN scripts, tracking libraries, package installation steps or build tools.

- `detector-hero.webp`: original AI-generated conceptual artwork created for this project, compressed to WebP. It is not a photograph of a real CERN detector. The conceptual-art label is visible on desktop.
- Barlow Condensed, Manrope and IBM Plex Mono: sourced through Google Fonts, with SIL Open Font License notices included alongside the font files. Font source: [Google Fonts repository](https://github.com/google/fonts).
- [Feynman Lectures, Volume III](https://www.feynmanlectures.caltech.edu/III_toc.html)
- [MIT 8.06: Scattering and Identical Particles](https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/pages/video-lectures/scattering-and-identical-particles/)
- [CERN: The Standard Model](https://home.cern/science/physics/standard-model/)
- Schiff and FloatHeadPhysics are retained from the original reading page.

### Global reading page edits (`recommended-readings.html`)

- Add books under `#books`.
- Add papers under `#papers`.
- Use either external links or local PDFs (e.g., `assets/readings/`).

### Change colors/visual style

In `styles.css`, edit variables under `:root`:

- `--accent`
- `--accent-2`
- `--bg`

The Particle Physics page has a separate stylesheet. Its `:root` tokens are independent of the portfolio theme.

---

## 4) Recommended next improvements

- Replace placeholder text with real bio/projects.
- Add real PDFs and reading links.
- Add a profile image and downloadable resume.
- Add a custom domain.
- Add analytics (Plausible or Google Analytics).
- Add a contact form service (Formspree, Getform, etc.).
