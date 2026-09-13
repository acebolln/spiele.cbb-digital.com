/* ============================================================
   audio.js - tiny Web Audio synth.
   No sound files: everything is generated, so the game stays a
   single self-contained folder that also works from file://.
   Tuned to be friendly - there is no "wrong" buzzer anywhere,
   a miss just gets a soft, low, neutral blip.
   ============================================================ */

(function () {
  'use strict';

  var ctx = null;
  var master = null;
  var muted = false;

  try {
    muted = localStorage.getItem('aya.memory.muted') === '1';
  } catch (e) { /* private mode - just stay unmuted */ }

  // C major pentatonic over two octaves - anything picked from this
  // scale sounds pleasant, whatever order it is played in.
  var SCALE = [261.63, 293.66, 329.63, 392.00, 440.00,
               523.25, 587.33, 659.25, 784.00, 880.00, 1046.50];

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
    return ctx;
  }

  // Browsers suspend audio until a real user gesture. Call this from
  // the first pointerdown.
  function unlock() {
    var c = ensure();
    if (c && c.state === 'suspended') c.resume();
  }

  function tone(freq, startIn, dur, type, peak) {
    if (muted) return;
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime + (startIn || 0);
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    // Short attack, exponential decay - reads as a soft mallet/pluck.
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak || 0.5, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(startIn, dur, peak) {
    if (muted) return;
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime + (startIn || 0);
    var frames = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, frames, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    var src = c.createBufferSource();
    src.buffer = buf;
    var filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 1400;
    var g = c.createGain();
    g.gain.value = peak || 0.18;
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0);
  }

  window.Sfx = {
    unlock: unlock,

    isMuted: function () { return muted; },

    setMuted: function (v) {
      muted = !!v;
      try { localStorage.setItem('aya.memory.muted', muted ? '1' : '0'); } catch (e) {}
    },

    // Card turns over.
    flip: function () {
      noise(0, 0.09, 0.12);
      tone(660, 0.01, 0.13, 'triangle', 0.30);
    },

    // Cards are dealt onto the table (one call per card, staggered).
    deal: function (i) {
      noise(i * 0.055, 0.07, 0.08);
    },

    // A pair was found. Rises through the scale as the board fills up,
    // so the whole round sounds like one climbing melody.
    match: function (step) {
      var i = Math.min(step || 0, SCALE.length - 3);
      tone(SCALE[i], 0.00, 0.30, 'triangle', 0.50);
      tone(SCALE[i + 1], 0.09, 0.30, 'triangle', 0.42);
      tone(SCALE[i + 2], 0.18, 0.45, 'sine', 0.40);
    },

    // Not a pair. Deliberately gentle and neutral - never a buzzer.
    miss: function () {
      tone(220, 0.00, 0.16, 'sine', 0.24);
      tone(196, 0.10, 0.22, 'sine', 0.20);
    },

    // All pairs found.
    win: function () {
      var mel = [523.25, 659.25, 784.00, 1046.50, 784.00, 1046.50];
      for (var i = 0; i < mel.length; i++) {
        tone(mel[i], i * 0.14, 0.42, 'triangle', 0.52);
        tone(mel[i] / 2, i * 0.14, 0.42, 'sine', 0.22);
      }
      tone(1318.51, 0.86, 0.9, 'sine', 0.40);
    },

    // UI tap on a menu button.
    tap: function () {
      tone(880, 0, 0.09, 'sine', 0.30);
    }
  };
})();
