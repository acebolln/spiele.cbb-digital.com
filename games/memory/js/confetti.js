/* ============================================================
   confetti.js - lightweight canvas confetti for the win screen.
   Self-contained, no dependencies, auto-stops so it never keeps
   a laptop fan spinning after the celebration is over.
   ============================================================ */

(function () {
  'use strict';

  var COLORS = ['#FF5A5A', '#FFC93C', '#3FA7E0', '#57C785', '#8A63C9', '#FF8FB1', '#F3B52C'];

  function Confetti(canvas) {
    this.cv = canvas;
    this.cx = canvas.getContext('2d');
    this.parts = [];
    this.raf = 0;
    this.until = 0;
  }

  Confetti.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = this.cv.clientWidth * dpr;
    this.cv.height = this.cv.clientHeight * dpr;
    this.cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  Confetti.prototype.burst = function (count, durationMs) {
    var reduce = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    this.resize();
    var w = this.cv.clientWidth;
    for (var i = 0; i < count; i++) {
      this.parts.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 260,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 1.6 + Math.random() * 2.6,
        w: 7 + Math.random() * 8,
        h: 9 + Math.random() * 11,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        col: COLORS[(Math.random() * COLORS.length) | 0],
        sway: Math.random() * Math.PI * 2
      });
    }
    this.until = Date.now() + (durationMs || 5200);
    if (!this.raf) this.tick();
  };

  Confetti.prototype.tick = function () {
    var self = this;
    var h = this.cv.clientHeight;
    this.cx.clearRect(0, 0, this.cv.clientWidth, h);

    for (var i = this.parts.length - 1; i >= 0; i--) {
      var p = this.parts[i];
      p.sway += 0.06;
      p.x += p.vx + Math.sin(p.sway) * 0.9;
      p.y += p.vy;
      p.rot += p.vr;

      if (p.y > h + 40) {
        this.parts.splice(i, 1);
        continue;
      }
      this.cx.save();
      this.cx.translate(p.x, p.y);
      this.cx.rotate(p.rot);
      this.cx.fillStyle = p.col;
      // Squash on the Y axis over time so pieces look like they tumble.
      this.cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
      this.cx.restore();
    }

    if (this.parts.length === 0 && Date.now() > this.until) {
      this.raf = 0;
      this.cx.clearRect(0, 0, this.cv.clientWidth, h);
      return;
    }
    this.raf = requestAnimationFrame(function () { self.tick(); });
  };

  Confetti.prototype.stop = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.parts.length = 0;
    this.cx.clearRect(0, 0, this.cv.clientWidth, this.cv.clientHeight);
  };

  window.Confetti = Confetti;
})();
