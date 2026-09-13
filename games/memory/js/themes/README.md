# Adding a memory theme

A theme supplies the pictures, the palette and the wording. The engine
in `game.js` knows nothing about pirates or tractors — if adding a theme
ever requires a change in `game.js`, the abstraction has leaked and that
is a bug worth fixing rather than working around.

## 1. Create the file

`js/themes/<id>.js`:

```js
(function () {
  'use strict';

  var MOTIFS = [
    {
      id: 'katze',                  // unique within the theme
      name: 'Die Katze',            // screen-reader label when flipped
      bg:   '#FFE9F0',              // card background behind the drawing
      svg:  '<svg viewBox="0 0 100 100">…</svg>'
    }
    // … at least 8, more is better
  ];

  window.MemoryThemes.register({
    id:    'katzen',
    name:  'Katzen',                // theme picker label
    title: 'Ayas<br>Katzen-Memory', // start screen headline
    cover: 'katze',                 // motif id shown on the picker and win screen
    vars: {
      '--sky-top': '#…', '--sky-mid': '#…', '--sky-bottom': '#…',
      '--meadow':  '#…',
      '--back-a':  '#…',            // card back stripes
      '--back-b':  '#…',
      '--back-badge': '#…',         // star on the card back
      '--title-ink':  '#…',
      '--accent':     '#…'
    },
    motifs: MOTIFS
  });
})();
```

## 2. Register it

Add one line to `index.html`, after `js/themes.js`:

```html
<script src="js/themes/katzen.js"></script>
```

And add the same path to `ASSETS` in `sw.js`, then bump `CACHE`.

That is all. The theme picker appears automatically as soon as a second
theme is registered, and disappears again if only one is left.

## Rules the registry enforces

At load time, `register()` throws on:

- a missing or duplicate `id`
- fewer than 8 motifs — 8 pairs is the largest round, so a smaller theme
  cannot fill the big board without repeating a picture
- a motif without `id`, `bg` or `svg`, or a duplicate motif `id`

Failing loudly at startup beats a half-broken board later.

## Drawing the motifs

- `viewBox="0 0 100 100"`, no `width`/`height` — the CSS sizes it.
- No `id` attributes and no `<defs>`: each SVG is injected twice per
  round, and duplicate ids inside one document break `url(#…)`
  references in unpredictable ways.
- Bold flat shapes. The card is around 140 px on a laptop and smaller on
  a phone; fine detail turns to mush.
- Strong silhouettes that differ from each other. Two motifs that are
  hard to tell apart make the game frustrating, not harder — this is
  what sent the first horse back to the drawing board when it read as a
  cow.
- Give each motif a `bg` distinct from its neighbours. Colour is the
  first thing a small child matches on, well before shape.
- A `class="m-spin"` on a group gets a slow rotation for free (see the
  sun in `wirbelwind.js`).

## Choosing the theme at runtime

1. `?theme=<id>` in the URL — handy for a bookmark that always opens the
   same one.
2. otherwise the last picked theme, from `localStorage`.
3. otherwise the first registered theme.
