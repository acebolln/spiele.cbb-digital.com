# Progress — Aya Spiele

Neueste Einträge oben. Arbeitsweise und Konventionen stehen in
[`../CLAUDE.md`](../CLAUDE.md), nicht hier.

---

## 2026-09-13

### Completed Tasks

- **Memory-Spiel gebaut und live gestellt.** Statisch, ohne Build und ohne
  Abhängigkeiten. Vier Größen (6/8/12/16 Karten), Maus und Touch, Ton per
  Web-Audio-Synthese (keine Audiodateien), Offline-Betrieb.
- **24 eigene SVG-Motive** in zwei Themes: `wirbelwind` (14) und
  `fahrzeuge` (10). Alles selbst gezeichnet, nichts heruntergeladen oder
  nachgezeichnet.
- **Theme-Architektur.** Motive, Palette und Texte liegen im Theme, die
  Engine kennt keinen Inhalt. Zweites Theme gebaut, um die Grenze zu
  belegen — es brauchte keine Zeile in `game.js`.
- **Portal im cbb-digital-CI** unter `index.html`, Tokens direkt von der
  Live-Seite übernommen, Schriften selbst gehostet.
- **Hosting auf Vercel** mit Auto-Deploy bei jedem Push auf `main`.
- **PWA**: Manifest, Service Worker, Icons. Installierbar, läuft offline.
- **Windows-Launcher** `start-memory.cmd` (Edge/Chrome im Kioskfenster).

### Changed Files

Neues Repo, 33 Dateien. Struktur siehe `CLAUDE.md`. Wesentlich:

| Datei | Zweck |
|-------|-------|
| `games/memory/js/game.js` | Engine: Zustand, Layout, Interaktion |
| `games/memory/js/themes.js` + `themes/*.js` | Registry und Themes |
| `games/memory/js/audio.js` | Web-Audio-Synth |
| `games/memory/sw.js`, `js/pwa.js` | Offline und Update-Verhalten |
| `shared/cbb-tokens.css` | CI-Tokens + Spielpalette + `@font-face` |
| `shared/portal.css`, `index.html` | Portal |
| `tools/build.js`, `tools/dev-server.js` | Standalone-Build, Vorschau |

### Technical Decisions

- **Eigene SVGs statt heruntergeladener Bilder.** Der Auftrag lautete
  „Bilder runterladen". Bewusst abgewichen: Fremdbilder bringen genau das
  Lizenzproblem zurück, das vermieden werden soll, pixeln auf großen
  Schirmen und machen aus dem Spiel einen Ordner mit Abhängigkeiten.
  Vektoren lösen alle drei Punkte. Mit dem Nutzer abgestimmt.
- **Keine geschützten Namen.** Auch „Kunterbunt" ist als etablierte
  Übersetzung vermieden. Das Spiel heißt „Ayas Wirbelwind-Memory", die
  Motive sind generische Themen.
- **Vercel statt GitHub Pages.** `cbb-digital.com` ist bei Vercel
  registriert und genameservert, die Subdomain löste bereits dorthin auf.
  Pages war der falsche Ort; es ist abgeschaltet, damit es nur eine
  Wahrheit gibt.
- **Rückweg zum Portal nur auf dem Startbildschirm.** Mitten im Spiel
  darf ein Kind nicht einen Fehltipp vom Verlassen entfernt sein.
- **Zwei getrennte Paletten.** Das Portal trägt die Marke, die Spiele
  nicht.

### Current State

Grün und verifiziert:

- `https://spiele.cbb-digital.com` — Portal, 200
- `https://spiele.cbb-digital.com/games/memory/` — Spiel, 200
- Runden auf der Live-Domain in beiden Themes durchgespielt, keine
  Konsolenfehler
- Layout geprüft auf 1280×800, 1100×700, 900×640, 844×390, 768×1024,
  390×844, 360×640, 320×568 — alle vier Level, kein Überlauf, kein Scrollen
- Service Worker aktiv, Cache `aya-memory-v4`
- `file://`-Start geprüft (headless Edge): CSS und JS laden, Spiel läuft
- `node tools/build.js` läuft fehlerfrei, keine Pfade außerhalb des Roots
- Working tree sauber, keine offenen PRs

### Fehler, die unterwegs auffielen

Die teuersten zuerst — alle in `CLAUDE.md` unter „Fallstricke" festgehalten.

1. **Service Worker lieferte Updates zu spät.** Cache-first für alles
   hieß: Ein Deploy erreichte Geräte erst beim *zweiten* Besuch. Fiel erst
   auf, als der neue Zurück-Button auf dem Handy des Nutzers nicht
   erschien, obwohl er live war — und meine erste Antwort darauf („lade
   zweimal neu") war eine Zumutung statt einer Lösung. Jetzt network-first
   für Code, plus automatischer Reload bei Worker-Wechsel. Mit simuliertem
   Deployment bei aktivem Worker verifiziert: ein Laden genügt.
2. **Domain hing an einem einzelnen Deployment.** Mit `vercel alias set`
   gesetzt statt als Projekt-Domain. Der Push danach ging live, die Domain
   lieferte weiter den alten Stand.
3. **Automatisches Vollbild erzeugte ein Dauerbanner.** Auf Wunsch
   eingebaut, aber Element-Vollbild erzwingt einen Browser-Hinweis, den
   keine Seite unterdrücken darf. Entfernt; der bannerfreie Weg ist die
   App-Installation.
4. **`animation`-Kurzschreibweise mit drei Zeitwerten** war ungültig —
   alle Kartenanimationen fielen still aus.
5. **`.card-inner` als `<span>` ohne `display:block`** hatte Größe 0, die
   Karten waren unsichtbar.
6. **Portal ohne `box-sizing`-Reset** — es lädt `kids-ui.css` nicht mehr.
   Auf 390 px wurde Text rechts abgeschnitten.
7. **Build führte aus dem Deployment-Root heraus.** Der Zurück-Link stand
   im Standalone-Build noch auf `../../index.html`. Beim Checkpoint
   entdeckt, korrigiert, und der Build bricht jetzt hart ab, wenn so etwas
   wieder auftritt.
8. **Zwei vermeintliche Bugs waren Screenshot-Artefakte** während
   CSS-Transitions. Erst messen, dann urteilen.

Nebenbefunde: Vercel schützt neue Projekte per SSO (musste für öffentlichen
Zugriff abgeschaltet werden); Edge zeigte im frischen Launcher-Profil einen
Microsoft-Sync-Dialog über dem Kinderspiel (per Flags unterdrückt).

### Next Steps

Nichts davon ist angefangen.

- **Zweites Spiel.** Der Platzhalter „Nächstes Spiel" im Portal markiert
  die Stelle, die Anleitung steht in `CLAUDE.md`.
- **Weitere Themes fürs Memory** — Tiere, Bauernhof, Essen. Eine Datei
  plus eine `<script>`-Zeile.
- **Beobachten, ob 16 Karten mit drei Jahren funktionieren.** Notfalls
  Level 4 vorerst ausblenden.

### Open Questions

- **Grafikfehler nicht reproduziert.** Gemeldet war ein gelegentlich
  sichtbarer Kartenrest rechts neben dem Brett. Im Ruhezustand über acht
  Viewports nicht nachstellbar. Drei plausible Ursachen beseitigt
  (Rundung, fehlender `ResizeObserver`, fehlendes Containment). Ob das
  Symptom weg ist, muss der Alltag zeigen — falls nicht: Tritt es beim
  Levelwechsel, nach Fenstergrößenwechsel oder direkt beim Start auf?
- **`gh` steht auf `acebolln`.** Für Appvantage-Arbeit umschalten:
  `gh auth switch --user christian-appvantage`.
- **Ayas Name ist öffentlich.** Repo und Seite sind public, der Vorname
  steht in Titel und Texten. Bewusst so entschieden; bei anderer Meinung
  sind Titel und Repo-Beschreibung die Stellen.
