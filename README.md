# Aya Spiele

Small browser games for Aya, built to run offline on the PC and to be
published under `cbb-digital.com` subdomains — one subdomain per game,
starting with `memory.cbb-digital.com`.

First game: **Memory**, for a 3-year-old, with two picture themes.

---

## Play it

**On the PC:** double-click `start-memory.cmd`. It opens the game in Edge
(or Chrome) as a chrome-less fullscreen window — no tabs, no address bar,
and Edge's sign-in and sync popups suppressed. Leave with `F11` or
`Alt+F4`.

No server, no install, no internet needed. `games/memory/index.html` also
works by plain double-click; the launcher only adds the kiosk-style
window.

**On a phone or tablet:** open the hosted URL and use "Add to home
screen". It then launches fullscreen with no browser UI and, thanks to
the service worker, keeps working with no signal — which is the point in
a car or a train.

---

## Design decisions

These are deliberate. Worth reading before "improving" anything.

**Nothing to read.** A 3-year-old cannot read. Difficulty is four tiles
showing a miniature of the actual board plus the card count; themes are
picked by picture; every control is an icon. The only words on screen are
for the adult.

**No way to lose.** No timer, no score, no move counter, no buzzer. A
wrong pair gets a soft, low, neutral tone — never a failure sound.

**Generous timings.** A wrong pair stays visible for 1.5 s before turning
back, a correct pair for 0.42 s before it locks. Toddlers look slowly.
Both live at the top of `js/game.js` under "tuning".

**The board never scrolls.** Card size is recomputed on every board
resize and every dimension is floored to whole pixels, so the grid can
never exceed its container. The grid is always a complete rectangle — a
half-empty last row reads as a broken game. Lopsided grids (6×2 for
twelve cards) are penalised so a compact 4×3 wins; a board smeared across
a wide monitor makes a small child lose track of where she already
looked.

**Mouse and touch share one path.** `pointerdown` fires the flip, so a
tap responds instantly. The `click` handler only runs for keyboard
activation (`event.detail === 0`), so a tap never counts twice.
Pinch-zoom, double-tap-zoom, long-press menus and text selection are all
disabled.

**Sound is generated, not loaded.** `audio.js` is a small Web Audio
synth, so there are no audio files and the game stays a self-contained
folder that works from `file://`. Each found pair plays one step higher
up a pentatonic scale, so a round sounds like a climbing melody. Mute
state is remembered.

**No build step, no framework, no dependencies.** Classic `<script>` tags
and plain CSS — ES modules and `fetch` are blocked on `file://`, which
would break the double-click launch.

---

## Themes

Two ship today: **Wirbelwind** (14 motifs) and **Fahrzeuge** (10). At most
8 are used per round, so the cards differ from game to game.

A theme supplies the motifs, the palette and the wording; the engine
knows nothing about what is drawn. The picker on the start screen only
appears when more than one theme is registered.

Adding one is a single file plus one `<script>` tag — see
**[`games/memory/js/themes/README.md`](games/memory/js/themes/README.md)**.

### Artwork and licensing

Every illustration is drawn from scratch as SVG. Nothing is traced from
or derived from Astrid Lindgren or Pippi Longstocking artwork, and no
image was downloaded from anywhere.

The Wirbelwind motifs are generic themes in that spirit — a red-haired
girl with braids and freckles, a monkey in a hat and waistcoat, a spotted
white horse, a colourful house, pancakes, gold coins, a pirate ship,
striped socks, a treasure map, a parrot, the sun, a scrubbing brush, a
cake and a travel suitcase. No protected name appears anywhere in the
game, in the code or in the title.

---

## Layout

```
Aya Spiele/
├─ index.html              portal page listing the games
├─ start-memory.cmd        launcher (Edge/Chrome kiosk window)
├─ shared/                 tokens + UI primitives for ALL games
│  ├─ cbb-tokens.css       colours, radii, motion  <- swap in real CI here
│  └─ kids-ui.css          toddler-proof defaults, buttons
├─ games/
│  └─ memory/
│     ├─ index.html
│     ├─ manifest.webmanifest   installable, display: fullscreen
│     ├─ sw.js                  offline cache (bump CACHE when files change)
│     ├─ icons/
│     ├─ css/game.css           layout, card 3D flip, all keyframes
│     └─ js/
│        ├─ themes.js           theme registry
│        ├─ themes/*.js         one file per theme
│        ├─ audio.js            Web Audio synth
│        ├─ confetti.js         canvas confetti
│        ├─ pwa.js              service worker registration
│        └─ game.js             state machine, layout, interaction
├─ tools/
│  ├─ dev-server.js        zero-dependency static server
│  └─ build.js             produces deploy-ready dist/<game>/
└─ dist/                   build output (git-ignored, safe to delete)
```

### Transform layering

Three levels, so nothing fights over `transform`:

| Element       | Owns                                         |
|---------------|----------------------------------------------|
| `.card`       | keyframes: deal, idle float, wobble, wave    |
| `.card-inner` | pointer state + flip, composed from CSS vars |
| `.face`       | flat; only the static `rotateY(180deg)`      |

A note on the `animation` shorthand: only **two** time values are allowed
per animation (duration, delay). A third silently invalidates the whole
declaration and every animation on the element disappears.

### Fullscreen

The button hides itself in two cases, both on purpose:

- the platform has no element fullscreen (iOS Safari) — a dead button is
  worse than no button;
- the window already fills the screen, which is what `start-memory.cmd`
  produces with `--start-fullscreen`. `requestFullscreen()` then changes
  nothing visible, and a button that does nothing reads as broken.

---

## Local preview

```bash
node tools/dev-server.js
```

Then open `http://localhost:5173/`. Service workers need https or
localhost, so offline mode can only be tested here, not from `file://`.

---

## Deploying

`shared/` sits outside the game folder, so the game folder alone is not
uploadable. The build flattens it in and rewrites the links:

```bash
node tools/build.js memory
```

Upload the **contents** of `dist/memory/` to the subdomain root. Fully
static — any host will do. Run `node tools/build.js` with no argument to
build every game.

For GitHub Pages, publish the repository root instead: `index.html` is
the portal and the relative paths already work from a subdirectory.

After changing any file under `games/memory/`, bump `CACHE` in
`games/memory/sw.js` — otherwise returning visitors keep the cached old
version.

---

## Open item

`shared/cbb-tokens.css` carries **placeholder** brand values under
`--cbb-*`. The playful `--toy-*` palette and the per-theme variables are
finished and intentionally separate — a kids' game should not be painted
in corporate colours. Drop the real cbb-digital CI into the `--cbb-*`
block when the portal page gets its proper design.

---

## Hosting

Live on GitHub Pages from `main` / root:
**https://acebolln.github.io/spiele.cbb-digital.com/**

`.nojekyll` is required: without it Pages runs the tree through Jekyll,
which ignores paths beginning with `_` and needlessly rewrites files.

### Putting it on spiele.cbb-digital.com

1. At the DNS provider for `cbb-digital.com`, add a CNAME record:
   `spiele` → `acebolln.github.io`
2. Once it resolves, set the custom domain on the repository:
   ```bash
   gh api repos/acebolln/spiele.cbb-digital.com/pages -X PUT -f cname=spiele.cbb-digital.com
   ```
   That commits a `CNAME` file. Do it only after step 1 — with the file
   in place but DNS missing, Pages serves nothing at either address.
3. Enable "Enforce HTTPS" once the certificate is issued.

Per-game subdomains (`memory.cbb-digital.com`) are the other option and
need no extra work here: `node tools/build.js memory` produces a
self-contained `dist/memory/` for any static host.
