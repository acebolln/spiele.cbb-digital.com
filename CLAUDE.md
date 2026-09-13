# Aya Spiele — Projektanweisungen

Browserspiele für Aya (3 Jahre). Live unter **https://spiele.cbb-digital.com**.

> Statusinformationen gehören **nicht** hierher, sondern in
> [`docs/progress.md`](docs/progress.md). Diese Datei beschreibt, wie
> gearbeitet wird — nicht, wo wir gerade stehen.

---

## Sprachregel

| Was | Sprache |
|-----|---------|
| Alles auf dem Bildschirm (UI, aria-labels, Manifest) | **Deutsch**, mit echten Umlauten |
| **Commit-Nachrichten** | **Deutsch** |
| Code, Kommentare, Doku, Dateinamen | **Englisch** |

Aya spricht Deutsch — die Oberfläche muss Deutsch sein.

Commit-Nachrichten sind auf Wunsch des Nutzers deutsch (13.09.2026) und
überschreiben damit für dieses Projekt die globale Artefakt-Regel aus
`~/Documents/CLAUDE.md`. Die ersten neun Commits sind noch englisch — die
Historie bleibt, wie sie ist.

ASCII-Ersatzschreibweisen („fuer", „Zurueck") sind ein Fehler, keine
Vorsichtsmaßnahme: Die Dateien sind UTF-8 und deklarieren das. Das gilt
auch für Commit-Nachrichten.

---

## Die Zielgruppe bestimmt die Technik

Jede Entscheidung im Code lässt sich auf eine dieser Regeln zurückführen.
Wer etwas ändert, prüft es gegen diese Liste.

1. **Nichts zu lesen.** Eine Dreijährige kann nicht lesen. Schwierigkeit,
   Themes und alle Bedienelemente sind Bilder oder Icons. Text auf dem
   Schirm richtet sich an Erwachsene.
2. **Kein Verlieren.** Keine Uhr, kein Punktestand, kein Zugzähler, kein
   Fehlerton. Ein Fehlversuch bekommt einen weichen, tiefen, neutralen
   Ton — nie einen Buzzer.
3. **Großzügige Zeiten.** Falsches Paar bleibt 1,5 s offen, richtiges
   0,42 s bevor es einrastet. Kleine Kinder schauen langsam.
4. **Das Brett scrollt nie.** Kartengröße wird bei jeder Größenänderung
   neu berechnet, alle Maße auf ganze Pixel abgerundet. Das Raster ist
   immer ein vollständiges Rechteck — eine halbleere letzte Reihe liest
   sich als kaputtes Spiel.
5. **Maus und Touch teilen einen Pfad.** `pointerdown` löst aus,
   `click` nur bei Tastatur (`event.detail === 0`). Sonst zählt ein Tipp
   doppelt.
6. **Kein Build, kein Framework, keine Abhängigkeiten.** Klassische
   `<script>`-Tags und pures CSS. ES-Module und `fetch` sind unter
   `file://` blockiert, das würde den Doppelklick-Start zerstören.

---

## Architektur

```
index.html          Portal im cbb-digital-CI (einzige Marken-Fläche)
shared/             Tokens, Schriften, UI-Primitive für ALLE Spiele
games/<name>/       ein Ordner pro Spiel, ansonsten frei gestaltet
tools/              dev-server.js (Vorschau), build.js (Standalone-Build)
docs/progress.md    Projektstand und Verlauf
```

**Zwei Paletten, absichtlich getrennt** (beide in `shared/cbb-tokens.css`):

- `--cbb-*` ist das echte CI von cbb-digital.com. Nur das Portal nutzt es.
- `--toy-*` und die Theme-Variablen gehören den Spielen. Firmen-Petrol ist
  die falsche Palette für ein Kleinkind — die Marke endet an der Haustür.

Schriften liegen selbst gehostet in `shared/fonts/`, genau wie auf der
Hauptseite. Kein Google-Fonts-Aufruf, keine DSGVO-Frage.

---

## Ein Theme hinzufügen

Der Engine ist egal, was auf den Karten ist. Braucht ein neues Theme eine
Änderung an `game.js`, ist die Abstraktion undicht — das ist ein Bug.

Vollständige Anleitung: [`games/memory/js/themes/README.md`](games/memory/js/themes/README.md)

Kurz: Datei unter `js/themes/<id>.js`, `window.MemoryThemes.register({...})`,
eine `<script>`-Zeile in `index.html`, Pfad in `sw.js` ergänzen, `CACHE`
hochzählen. Die Registry wirft beim Laden bei unter 8 Motiven oder
doppelten IDs — lautes Scheitern beim Start schlägt ein halbkaputtes Brett.

**Motive zeichnen:** `viewBox="0 0 100 100"`, keine `id`-Attribute und
kein `<defs>` (jedes SVG wird zweimal pro Runde eingefügt, doppelte IDs
brechen `url(#…)`). Kräftige, flache Formen — die Karte ist auf dem Handy
klein. Silhouetten müssen sich klar unterscheiden: Der erste Schimmel
wurde als Kuh gelesen und musste neu.

---

## Ein neues Spiel hinzufügen

1. `games/<name>/` anlegen, `../../shared/cbb-tokens.css` und
   `../../shared/kids-ui.css` einbinden.
2. Rückweg zum Portal einbauen: Link auf `../../index.html`, **nur auf dem
   Startbildschirm**. Mitten im Spiel darf ein Kind nicht einen Fehltipp
   vom Verlassen entfernt sein.
3. Kachel in `index.html` (Root) ergänzen — der Platzhalter „Nächstes
   Spiel" markiert die Stelle.
4. Eigenes `manifest.webmanifest`, `sw.js` und `icons/` nach dem Muster
   von `games/memory/`.
5. `node tools/build.js <name>` muss fehlerfrei durchlaufen. Der Build
   bricht ab, wenn ein Pfad aus dem Deployment-Root herausführt.

---

## Ausliefern

Vercel, verknüpft mit dem GitHub-Repo: **jeder Push auf `main` deployt
automatisch**. Kein manueller Schritt.

- Projekt: `spiele-cbb-digital` (Vercel-Team `acebollns-projects`)
- Repo: `acebolln/spiele.cbb-digital.com`
- `gh` muss auf `acebolln` stehen (nicht `christian-appvantage`)

**Nach jeder Änderung unter `games/<name>/`: `CACHE` in dessen `sw.js`
hochzählen.** Sonst behalten Wiederkehrer die alte Fassung.

---

## Fallstricke

Alles hier ist einmal passiert und hat Zeit gekostet.

**CSS `animation`-Kurzschreibweise nimmt nur zwei Zeitwerte** (Dauer,
Verzögerung). Ein dritter macht die gesamte Deklaration ungültig — alle
Animationen des Elements verschwinden wortlos.

**`<span>` als Flip-Container braucht `display: block`.** Inline-Elemente
ignorieren `width`/`height`; die Karten waren unsichtbar.

**Jede CSS-Datei, die `kids-ui.css` nicht lädt, braucht ihren eigenen
`box-sizing`-Reset.** Fehlte im Portal — `width:100%` plus Padding machte
`<main>` breiter als den Viewport, Text wurde rechts abgeschnitten.

**Service Worker: Code network-first, Assets cache-first.** Cache-first
für alles bedeutet, dass ein Deploy die Nutzer erst beim *zweiten* Besuch
erreicht. Kostete zwei Runden Fehlersuche, weil ein neuer Button auf dem
Handy nicht auftauchte, obwohl er live war.

**Domain als Projekt-Domain registrieren, nicht mit `vercel alias set`.**
Der Alias klebt an einem einzelnen Deployment; der nächste Push geht live,
die Domain liefert weiter den alten Stand.

**Kein automatisches Vollbild.** Element-Vollbild erzwingt einen
dauerhaften Browser-Hinweis („nach unten wischen"), den keine Seite
unterdrücken darf. Der bannerfreie Weg ist die Installation als App
(`display: fullscreen` im Manifest).

**Beim Testen im Browser-Pane:** Screenshots während einer CSS-Transition
zeigen Zwischenzustände. Erst `getComputedStyle` messen, dann urteilen —
zwei vermeintliche Bugs waren nur Überblendungen.

**Vercel schützt neue Projekte per SSO.** Muss für öffentliche Seiten
abgeschaltet werden, sonst antwortet alles mit 302 auf den Vercel-Login.

---

## Nicht anfassen ohne Grund

- **Kartengeometrie in `layout()`** — die Abrundung auf ganze Pixel und
  die Strafe für schiefe Raster (6×2 statt 4×3) sind absichtlich.
- **`overflow: clip` mit `overflow-clip-margin` am Brett** — fängt den
  einen Frame ab, in dem nach einer Größenänderung noch die alte
  Kartengröße gilt. Der Rand lässt Hover-Hub und Gewinn-Welle heraus.
- **Die Transform-Schichtung** (`.card` = Keyframes, `.card-inner` =
  Zeiger/Flip, `.face` = flach). Wird sie vermischt, kämpfen Animationen
  um `transform`.
