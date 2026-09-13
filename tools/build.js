/* ============================================================
   build.js - produce a deploy-ready folder per game.

     node tools/build.js            # build every game
     node tools/build.js memory     # build one

   Each game lives at games/<name>/ and references the shared
   design tokens via ../../shared/. That relative path only works
   inside this repository. Every game gets its own subdomain
   (memory.cbb-digital.com, ...), so the build flattens shared/
   into the game folder and rewrites the links.

   Output: dist/<name>/ - upload its CONTENTS to the subdomain root.
   Zero dependencies, no bundling, no transpiling: the sources are
   already plain HTML/CSS/JS and ship as they are.
   ============================================================ */

var fs   = require('fs');
var path = require('path');

var ROOT   = path.resolve(__dirname, '..');
var GAMES  = path.join(ROOT, 'games');
var SHARED = path.join(ROOT, 'shared');
var DIST   = path.join(ROOT, 'dist');

// Where the games overview lives. A standalone build has no portal of
// its own, so in-game links back to it must be absolute.
var PORTAL = 'https://spiele.cbb-digital.com/';

// Developer docs are for the repository, not for the deployment.
var SKIP = /\.md$/i;

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach(function (e) {
    var s = path.join(src, e.name);
    var d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else if (!SKIP.test(e.name)) fs.copyFileSync(s, d);
  });
}

function rmDir(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function build(name) {
  var src = path.join(GAMES, name);
  if (!fs.statSync(src).isDirectory()) return null;

  var out = path.join(DIST, name);
  rmDir(out);
  copyDir(src, out);
  copyDir(SHARED, path.join(out, 'shared'));

  // A standalone build is served from its own domain root, so every
  // path that escapes the game folder has to be rewritten.
  //
  //   ../../shared/      -> shared/           (flattened in above)
  //   ../../index.html   -> PORTAL            (the portal is not part
  //                                            of this deployment)
  var rewritten = 0;
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      var p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      if (!/\.(html|css|js)$/i.test(e.name)) return;
      var txt = fs.readFileSync(p, 'utf8');
      var next = txt
        .split('../../shared/').join('shared/')
        .split('../../index.html').join(PORTAL);
      if (next !== txt) { fs.writeFileSync(p, next); rewritten++; }
    });
  })(out);

  // Nothing may still point outside the deployment root.
  (function check(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      var p = path.join(dir, e.name);
      if (e.isDirectory()) return check(p);
      if (!/\.(html|css|js)$/i.test(e.name)) return;
      if (fs.readFileSync(p, 'utf8').indexOf('../../') !== -1) {
        throw new Error('escapes the deployment root: ' + path.relative(out, p));
      }
    });
  })(out);

  var files = 0;
  (function count(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
      if (e.isDirectory()) count(path.join(dir, e.name));
      else files++;
    });
  })(out);

  return { name: name, out: path.relative(ROOT, out), files: files, rewritten: rewritten };
}

var only = process.argv[2];
var names = fs.readdirSync(GAMES).filter(function (n) {
  return fs.statSync(path.join(GAMES, n)).isDirectory() && (!only || n === only);
});

if (!names.length) {
  console.error('No game found' + (only ? ' named "' + only + '"' : '') + ' in games/');
  process.exit(1);
}

names.map(build).filter(Boolean).forEach(function (r) {
  console.log('built ' + r.name + '  ->  ' + r.out +
              '  (' + r.files + ' files, ' + r.rewritten + ' path rewrites)');
});
console.log('\nUpload the CONTENTS of each dist/<game>/ to its subdomain root.');
