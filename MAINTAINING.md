# Maintaining the site

Plain HTML, CSS and JavaScript. There is no build step and no backend. Open `index.html` to preview locally (the equations need internet for KaTeX).

## Weekly update checklist

1. **Add a topic.** Edit `assets/topics.js`: add an entry (`exam`, `week`, `href`, `title`, `blurb`, `status`). It appears in the Topics menu and on the home page. `status: 'new'` shows a NEW badge; `'soon'` greys it out. Update `window.SITE` (the date and note on the home page).
2. **Add the page.** Copy an existing topic page (for example `budget.html`), change `data-page`, the title and the content. Put any interactive widget code in `assets/pages/<name>.js`.
3. **Add questions.** Append to `assets/questions.js` (the format is described at the top of that file).
4. **Publish.** `git add .`, `git commit -m "Week N"`, `git push`. GitHub Pages updates in about a minute.

## Page building blocks

| Markup | What it does |
|---|---|
| `<div class="pop-marker" data-topic="ID"></div>` | A pop quiz appears when the reader scrolls past |
| `<div class="quiz-set" data-topic="ID"></div>` | Lists every bank question for that topic |
| `<div class="num-set" data-gens="inv,gcross" data-label="..."></div>` | Randomized drills, one new problem per generator listed |
| `<div class="exercise">...<details class="solution">...</details></div>` | A worked exercise with a hidden solution |
| `<div class="widget split">...` | A card for an interactive graph (see `assets/pages/` for examples) |

Math is written `\( ... \)` (inline) and `\[ ... \]` (display). In JavaScript strings, use ``R`...` `` (`String.raw`) so backslashes survive. Write `&lt;` instead of `<` inside math in HTML or in question text.

## Question types (`assets/questions.js`)

- `mc`: multiple choice (`choices`, `answer` = index of the correct one; set `fixed: true` to keep the order).
- `tf`: statements with True/False buttons. Add `three: true` for True/False/**Uncertain** (answers are `true`, `false` or `'U'`).
- `num`: typed numeric answer(s). Use `answer`, or `parts: [{label, answer}]` for several boxes. Fractions like `1/2` are accepted. Add `sol` for the written solution.
- `pick`: tap a bundle on a graph (see the `pick` figure).
- Any question can have `fig: {...}` to show a graph (see below).

## Graphs in questions (`assets/figures.js`)

`fig: {kind: ...}` draws a number-free graph like the ones on exams:
`cross` (indifference curve and budget line, bundle A), `which` (four bundles, which is optimal), `shape` (what kind of preferences), `shift` (how did the budget line move), `pick` (tap a possible new choice).

## Generated drills (`assets/drills.js`)

Each generator returns a fresh question every time. Register one with `addGen(key, fn, label, group)`, where `group` is `'calc'` or `'graph'`. They appear on the Exercises page automatically, and on any page via a `num-set`. When you add one, verify it against `Econ` (see `assets/econ.js`) rather than trusting the algebra.

## Other files

- `assets/econ.js`: utility, MRS, optimal bundle, compensated bundle, indifference curves.
- `assets/plot.js`: the small SVG plotting helper.
- `assets/quiz.js`: quiz engine, pop-ups, progress, answer checking.
- `assets/notation.js`: the data behind the Math notation page (append rows to add symbols).
- `assets/style.css`: all styles and colours (colours are variables at the top).
- `assets/theme.js`: dark mode (remembered across pages).

## Before you push

- Open the site, click through every page once, and try one question of each kind.
- Keep **only this folder** in the repository. Never add rosters, grades, or other student information.
