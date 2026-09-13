/* ============================================================
   dev-server.js - zero-dependency static server.
   Serves the repository root exactly the way the future
   *.cbb-digital.com hosting will, so what you test locally is
   what ships. Not needed to play: index.html also runs from
   file:// via start-memory.cmd.

     node tools/dev-server.js [port]
   ============================================================ */

var http = require('http');
var fs   = require('fs');
var path = require('path');
var url  = require('url');

var ROOT = path.resolve(__dirname, '..');
var PORT = parseInt(process.argv[2], 10) || 5173;

var TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2': 'font/woff2'
};

http.createServer(function (req, res) {
  var pathname = decodeURIComponent(url.parse(req.url).pathname);
  var file = path.join(ROOT, pathname);

  // Never serve anything outside the project root.
  if (file.indexOf(ROOT) !== 0) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(file, function (err, st) {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');

    fs.readFile(file, function (err2, buf) {
      if (err2) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - ' + pathname);
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(buf);
    });
  });
}).listen(PORT, function () {
  console.log('Aya Spiele dev server:  http://localhost:' + PORT + '/games/memory/');
});
