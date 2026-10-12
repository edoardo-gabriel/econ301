# Econ 301 Study Hub

Static site: plain HTML/CSS/JS, no build step, no backend. Open `index.html` to preview locally
(math needs internet for KaTeX from a CDN).

## Weekly update checklist
1. **Add a topic**: edit `assets/topics.js` (set `status: 'new'` for a NEW badge, `'soon'` for greyed out) and update `window.SITE` (date and note shown on the home page).
2. **Add a page**: copy an existing page (e.g. `budget.html`), change `data-page`, title and content, and add `assets/pages/<name>.js` for any widgets.
   - `<div class="pop-marker" data-topic="ID"></div>` triggers a pop quiz when the reader scrolls past it.
   - `<div class="quiz-set" data-topic="ID"></div>` lists all bank questions for that topic.
   - `<div class="num-set" data-gens="cd,pc" data-label="..."></div>` adds randomized numeric drills.
3. **Add questions**: append to `assets/questions.js` (format described at the top of the file). Math is written `\( ... \)` inside `R\`...\``. Money like `$5` can be written plainly.
4. Worked exercises with solutions: `<div class="exercise"> ... <details class="solution">`.

## Files
- `assets/plot.js` SVG plot helper · `assets/econ.js` utility, MRS, optimum, demand math
- `assets/quiz.js` quiz engine, pop-ups, random drills · `assets/core.js` header, theme, helpers

## Deploy (free)
- **GitHub Pages**: push the contents of this folder to a repo, then Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
- **Cloudflare Pages / Netlify**: connect the repo (or drag-and-drop the folder). No build command, publish directory `/`.
