/* ============================================================
   theme: wirbelwind - original illustrations
   ------------------------------------------------------------
   All artwork is drawn from scratch as SVG. Nothing is traced,
   copied or derived from Astrid Lindgren / Pippi Longstocking
   artwork. The motifs are generic themes (a red-haired girl,
   a dressed monkey, a spotted white horse, pancakes, coins,
   a pirate ship ...) which are not protectable on their own.

   See js/themes/README.md for how to add a theme of your own.
   ============================================================ */

(function () {
  'use strict';

  // Sun rays - 8 rounded spokes, built instead of hand-repeated.
  function rays() {
    var out = '';
    for (var a = 0; a < 360; a += 45) {
      out += '<rect x="46.5" y="1" width="7" height="15" rx="3.5" transform="rotate(' + a + ' 50 50)"/>';
    }
    return out;
  }

  // Bristles for the scrubbing brush.
  function bristles() {
    var out = '';
    for (var x = 22; x <= 72; x += 7) {
      out += '<rect x="' + x + '" y="66" width="5.5" height="19" rx="2.75"/>';
    }
    return out;
  }

  var MOTIFS = [
    {
      id: 'maedchen',
      name: 'Das freche Maedchen',
      bg: '#FFE3EC',
      // Braids are built from shrinking overlapping circles so they read
      // as plaited strands; as smooth blobs they looked like headphones.
      svg: '<svg viewBox="0 0 100 100">' +
        '<g fill="#F2622B">' +
          '<circle cx="26" cy="53" r="8.5"/><circle cx="18" cy="60" r="7"/><circle cx="12" cy="68" r="5.5"/>' +
          '<circle cx="74" cy="53" r="8.5"/><circle cx="82" cy="60" r="7"/><circle cx="88" cy="68" r="5.5"/>' +
        '</g>' +
        '<circle cx="9" cy="75" r="6" fill="#3FA7E0"/>' +
        '<circle cx="91" cy="75" r="6" fill="#3FA7E0"/>' +
        '<circle cx="9" cy="75" r="2.3" fill="#2A7FB0"/>' +
        '<circle cx="91" cy="75" r="2.3" fill="#2A7FB0"/>' +
        '<circle cx="23" cy="53" r="5.5" fill="#FFDFC4"/>' +
        '<circle cx="77" cy="53" r="5.5" fill="#FFDFC4"/>' +
        '<circle cx="50" cy="51" r="27" fill="#FFDFC4"/>' +
        '<path d="M22 49C22 27 34 15 50 15s28 12 28 34c-6-12-16-16-28-16s-22 4-28 16z" fill="#F2622B"/>' +
        '<circle cx="40" cy="50" r="4.6" fill="#2E2A3B"/>' +
        '<circle cx="60" cy="50" r="4.6" fill="#2E2A3B"/>' +
        '<circle cx="41.6" cy="48.4" r="1.7" fill="#fff"/>' +
        '<circle cx="61.6" cy="48.4" r="1.7" fill="#fff"/>' +
        '<circle cx="50" cy="57" r="2.6" fill="#E8A57E"/>' +
        '<g fill="#D98A5E">' +
          '<circle cx="33" cy="58" r="1.8"/><circle cx="38" cy="63" r="1.8"/><circle cx="32" cy="65" r="1.8"/>' +
          '<circle cx="67" cy="58" r="1.8"/><circle cx="62" cy="63" r="1.8"/><circle cx="68" cy="65" r="1.8"/>' +
        '</g>' +
        '<path d="M38 64q12 13 24 0z" fill="#B53A3A"/>' +
        '<rect x="38" y="64" width="24" height="3.4" fill="#fff"/>' +
      '</svg>'
    },
    {
      id: 'affe',
      name: 'Der angezogene Affe',
      bg: '#FFF0D6',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M28 84q22-11 44 0v16H28z" fill="#E24E4E"/>' +
        '<path d="M50 82 62 100H38z" fill="#FFF6E5"/>' +
        '<circle cx="21" cy="57" r="10.5" fill="#A9713E"/>' +
        '<circle cx="21" cy="57" r="5.5" fill="#E3B487"/>' +
        '<circle cx="79" cy="57" r="10.5" fill="#A9713E"/>' +
        '<circle cx="79" cy="57" r="5.5" fill="#E3B487"/>' +
        '<circle cx="50" cy="57" r="25" fill="#A9713E"/>' +
        '<ellipse cx="50" cy="65" rx="17.5" ry="13" fill="#E3B487"/>' +
        '<circle cx="41" cy="53" r="4.2" fill="#2E2A3B"/>' +
        '<circle cx="59" cy="53" r="4.2" fill="#2E2A3B"/>' +
        '<circle cx="42.3" cy="51.7" r="1.5" fill="#fff"/>' +
        '<circle cx="60.3" cy="51.7" r="1.5" fill="#fff"/>' +
        '<ellipse cx="46" cy="61" rx="1.9" ry="2.5" fill="#8A5A30"/>' +
        '<ellipse cx="54" cy="61" rx="1.9" ry="2.5" fill="#8A5A30"/>' +
        '<path d="M42 69q8 7 16 0" stroke="#8A5A30" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="35" rx="33" ry="7.5" fill="#E0B45C"/>' +
        '<ellipse cx="50" cy="33.5" rx="33" ry="7" fill="#F6D584"/>' +
        '<path d="M32 34q1-17 18-17t18 17z" fill="#FFE7A8"/>' +
        '<path d="M33 29q17-5 34 0l.4 4.5q-17-5-34.4 0z" fill="#E24E4E"/>' +
      '</svg>'
    },
    {
      id: 'pferd',
      name: 'Der gepunktete Schimmel',
      bg: '#E7F3FF',
      // Ears point clearly up and the mane sits as a forelock between
      // them - an earlier version put dark shapes on both sides of the
      // head and the whole thing read as a cow.
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M33 44Q31 18 38 16q3 10 6 26z" fill="#fff"/>' +
        '<path d="M67 44Q69 18 62 16q-3 10-6 26z" fill="#fff"/>' +
        '<path d="M35 40Q34 23 37.5 21q1.5 6 2.5 18z" fill="#F6C9C9"/>' +
        '<path d="M65 40Q66 23 62.5 21q-1.5 6-2.5 18z" fill="#F6C9C9"/>' +
        '<path d="M35 45q0-17 15-17t15 17l-3 29q-1 14-12 14t-12-14z" fill="#fff"/>' +
        '<g fill="#4A4252">' +
          '<circle cx="39" cy="59" r="3.2"/><circle cx="61" cy="56" r="2.7"/>' +
          '<circle cx="50" cy="48" r="2.4"/><circle cx="60" cy="66" r="2"/>' +
        '</g>' +
        '<path d="M41 35q2-13 9-13t9 13q-4-5-9-5t-9 5z" fill="#4A4252"/>' +
        '<path d="M50 24q-6 6-5 16" stroke="#4A4252" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="41" cy="49" r="4" fill="#2E2A3B"/>' +
        '<circle cx="59" cy="49" r="4" fill="#2E2A3B"/>' +
        '<circle cx="42.2" cy="47.7" r="1.4" fill="#fff"/>' +
        '<circle cx="60.2" cy="47.7" r="1.4" fill="#fff"/>' +
        '<ellipse cx="50" cy="78" rx="13.5" ry="11" fill="#FFE2E2"/>' +
        '<ellipse cx="45.5" cy="76" rx="2.3" ry="3.1" fill="#C98A8A"/>' +
        '<ellipse cx="54.5" cy="76" rx="2.3" ry="3.1" fill="#C98A8A"/>' +
        '<path d="M45 84q5 4 10 0" stroke="#C98A8A" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '</svg>'
    },
    {
      id: 'haus',
      name: 'Das bunte Haus',
      bg: '#E9F7EE',
      svg: '<svg viewBox="0 0 100 100">' +
        '<circle cx="70" cy="14" r="5" fill="#fff" opacity=".8"/>' +
        '<circle cx="79" cy="8" r="6.5" fill="#fff" opacity=".6"/>' +
        '<rect x="63" y="22" width="10" height="18" rx="2.5" fill="#9B5B3F"/>' +
        '<path d="M12 46 50 15 88 46z" fill="#E24E4E"/>' +
        '<path d="M12 46 50 15l4 4-34 27z" fill="#F06C6C"/>' +
        '<path d="M20 46h60l3 46H17z" fill="#FFC93C"/>' +
        '<rect x="26" y="54" width="19" height="19" rx="3.5" fill="#3FA7E0"/>' +
        '<rect x="55" y="54" width="19" height="19" rx="3.5" fill="#57C785"/>' +
        '<path d="M35.5 54v19M26 63.5h19M64.5 54v19M55 63.5h19" stroke="#fff" stroke-width="2.6"/>' +
        '<path d="M41 92V76q9-9 18 0v16z" fill="#8A63C9"/>' +
        '<circle cx="55" cy="85" r="2.2" fill="#FFC93C"/>' +
        '<rect x="10" y="90" width="80" height="7" rx="3.5" fill="#9B5B3F"/>' +
      '</svg>'
    },
    {
      id: 'pfannkuchen',
      name: 'Pfannkuchen',
      bg: '#FFF3D9',
      svg: '<svg viewBox="0 0 100 100">' +
        '<ellipse cx="50" cy="83" rx="39" ry="9.5" fill="#DDDDE6"/>' +
        '<ellipse cx="50" cy="80" rx="39" ry="9.5" fill="#fff"/>' +
        '<ellipse cx="50" cy="72" rx="30" ry="9.5" fill="#D79A4F"/>' +
        '<ellipse cx="50" cy="69" rx="30" ry="9.5" fill="#EFC078"/>' +
        '<ellipse cx="50" cy="60" rx="28" ry="9" fill="#D79A4F"/>' +
        '<ellipse cx="50" cy="57" rx="28" ry="9" fill="#EFC078"/>' +
        '<ellipse cx="50" cy="48" rx="26" ry="8.5" fill="#D79A4F"/>' +
        '<ellipse cx="50" cy="45" rx="26" ry="8.5" fill="#EFC078"/>' +
        '<path d="M28 46q4 9 0 13-5-5 0-13z" fill="#B9762C"/>' +
        '<path d="M72 46q-4 9 0 13 5-5 0-13z" fill="#B9762C"/>' +
        '<rect x="41" y="34" width="18" height="10" rx="2.5" fill="#F5C93F"/>' +
        '<rect x="41" y="34" width="18" height="4.5" rx="2.2" fill="#FFE68C"/>' +
      '</svg>'
    },
    {
      id: 'taler',
      name: 'Goldtaler',
      bg: '#FFF6D6',
      svg: '<svg viewBox="0 0 100 100">' +
        '<ellipse cx="30" cy="82" rx="21" ry="7.5" fill="#D99A18"/>' +
        '<ellipse cx="30" cy="78" rx="21" ry="7.5" fill="#F3B52C"/>' +
        '<ellipse cx="30" cy="73" rx="21" ry="7.5" fill="#D99A18"/>' +
        '<ellipse cx="30" cy="69" rx="21" ry="7.5" fill="#F3B52C"/>' +
        '<ellipse cx="72" cy="84" rx="17" ry="6.5" fill="#D99A18"/>' +
        '<ellipse cx="72" cy="81" rx="17" ry="6.5" fill="#F3B52C"/>' +
        '<circle cx="58" cy="38" r="27" fill="#D99A18"/>' +
        '<circle cx="58" cy="38" r="21.5" fill="#F3B52C"/>' +
        '<path d="M58 24.5 62.3 33.6 72 35l-7 7 1.7 9.7-8.7-4.6-8.7 4.6L51 42l-7-7 9.7-1.4z" fill="#FFE27A"/>' +
      '</svg>'
    },
    {
      id: 'schiff',
      name: 'Das Piratenschiff',
      bg: '#DFF1FB',
      svg: '<svg viewBox="0 0 100 100">' +
        '<rect x="47" y="10" width="5" height="58" rx="2.5" fill="#8A5A30"/>' +
        '<path d="M52 10 76 17 52 24z" fill="#2E2A3B"/>' +
        '<circle cx="61" cy="17" r="2.4" fill="#fff"/>' +
        // Outlined sails: plain white disappeared against the pale sky.
        '<path d="M55 22q27 14 25 38H55z" fill="#FFFDF6" stroke="#BFB09A" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M44 30q-20 11-19 28h19z" fill="#EFE7D8" stroke="#BFB09A" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M58 38q14 9 16 22h-16z" fill="#E24E4E" opacity=".22"/>' +
        '<path d="M10 64h80l-10 20q-3 5-9 5H29q-6 0-9-5z" fill="#9B5B3F"/>' +
        '<rect x="9" y="60" width="82" height="8" rx="4" fill="#E24E4E"/>' +
        '<circle cx="34" cy="75" r="4.2" fill="#FFC93C"/>' +
        '<circle cx="50" cy="75" r="4.2" fill="#FFC93C"/>' +
        '<circle cx="66" cy="75" r="4.2" fill="#FFC93C"/>' +
        '<path d="M0 88q10-6 20 0t20 0 20 0 20 0 20 0V100H0z" fill="#3FA7E0"/>' +
        '<path d="M0 93q10-6 20 0t20 0 20 0 20 0 20 0V100H0z" fill="#2A7FB0" opacity=".55"/>' +
      '</svg>'
    },
    {
      id: 'socken',
      name: 'Ringelsocken',
      bg: '#F3EAFF',
      svg: '<svg viewBox="0 0 100 100">' +
        '<rect x="56" y="26" width="25" height="46" rx="5" fill="#FFC93C"/>' +
        '<g fill="#57C785">' +
          '<rect x="56" y="26" width="25" height="9" rx="4.5"/>' +
          '<rect x="56" y="42" width="25" height="9"/>' +
          '<rect x="56" y="58" width="25" height="9"/>' +
        '</g>' +
        '<rect x="38" y="64" width="43" height="24" rx="12" fill="#57C785"/>' +
        '<rect x="13" y="8" width="25" height="46" rx="5" fill="#fff"/>' +
        '<g fill="#E24E4E">' +
          '<rect x="13" y="8" width="25" height="9" rx="4.5"/>' +
          '<rect x="13" y="24" width="25" height="9"/>' +
          '<rect x="13" y="40" width="25" height="9"/>' +
        '</g>' +
        '<rect x="13" y="46" width="43" height="24" rx="12" fill="#E24E4E"/>' +
      '</svg>'
    },
    {
      id: 'karte',
      name: 'Die Schatzkarte',
      bg: '#FBEFD9',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M10 18q20-7 40 0t40 0v64q-20 7-40 0t-40 0z" fill="#F1DCAE"/>' +
        '<path d="M10 18q20-7 40 0t40 0v7q-20 7-40 0t-40 0z" fill="#E3C88F"/>' +
        '<path d="M24 70q12-18 24-12t22-20" stroke="#8A5A30" stroke-width="3.4" stroke-dasharray="1 8" stroke-linecap="round" fill="none"/>' +
        '<circle cx="24" cy="70" r="4.5" fill="#8A5A30"/>' +
        '<path d="M44 46q8-11 16 0z" fill="#57C785"/>' +
        // A palm tree instead of a compass rose - the compass circle with
        // its needle read as a "no entry" sign at card size.
        '<path d="M28 46q1-11 2-15" stroke="#8A5A30" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        '<path d="M30 31q-10-5-13 2 8-1 12 1z" fill="#57C785"/>' +
        '<path d="M30 31q10-5 13 2-8-1-12 1z" fill="#57C785"/>' +
        '<path d="M30 31q-3-10 4-12-3 6-2 11z" fill="#3FA764"/>' +
        '<path d="M62 30 78 46M78 30 62 46" stroke="#E24E4E" stroke-width="6.5" stroke-linecap="round"/>' +
      '</svg>'
    },
    {
      id: 'papagei',
      name: 'Der Papagei',
      bg: '#E6FBF0',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M58 60 90 84l-9 7-25-24z" fill="#3FA7E0"/>' +
        '<path d="M53 63 76 92l-11 2-17-26z" fill="#57C785"/>' +
        '<ellipse cx="46" cy="52" rx="22" ry="26" fill="#E24E4E"/>' +
        '<path d="M50 36q21 7 17 29-15 6-21-9z" fill="#FFC93C"/>' +
        '<path d="M52 44q13 6 11 20-9 3-13-8z" fill="#F09B1F"/>' +
        '<circle cx="40" cy="28" r="16" fill="#E24E4E"/>' +
        '<path d="M36 13q1-9 7-9-3 4-1 9z" fill="#FFC93C"/>' +
        '<path d="M42 12q3-8 9-7-5 3-5 8z" fill="#3FA7E0"/>' +
        '<path d="M30 14q-2-8 3-9-2 5 1 9z" fill="#57C785"/>' +
        '<circle cx="36" cy="27" r="5.5" fill="#fff"/>' +
        '<circle cx="35" cy="27" r="3.2" fill="#2E2A3B"/>' +
        '<circle cx="36.2" cy="25.8" r="1.2" fill="#fff"/>' +
        '<path d="M26 24q-13 3-10 9 3 8 12 4z" fill="#FFC93C"/>' +
        '<path d="M26 34q-6 6 1 9 8-1 5-9z" fill="#D98A16"/>' +
        '<path d="M42 76v7M52 76v7" stroke="#E09A20" stroke-width="4.5" stroke-linecap="round"/>' +
        '<rect x="12" y="82" width="76" height="8" rx="4" fill="#9B5B3F"/>' +
      '</svg>'
    },
    {
      id: 'sonne',
      name: 'Die Sonne',
      bg: '#FFF8D6',
      svg: '<svg viewBox="0 0 100 100">' +
        '<g fill="#FFB020" class="m-spin">' + rays() + '</g>' +
        '<circle cx="50" cy="50" r="26" fill="#FFC93C"/>' +
        '<circle cx="50" cy="50" r="21" fill="#FFD866"/>' +
        '<circle cx="42" cy="46" r="3.6" fill="#2E2A3B"/>' +
        '<circle cx="58" cy="46" r="3.6" fill="#2E2A3B"/>' +
        '<circle cx="43.2" cy="44.8" r="1.3" fill="#fff"/>' +
        '<circle cx="59.2" cy="44.8" r="1.3" fill="#fff"/>' +
        '<circle cx="36" cy="54" r="4" fill="#FF9AA8" opacity=".65"/>' +
        '<circle cx="64" cy="54" r="4" fill="#FF9AA8" opacity=".65"/>' +
        '<path d="M42 56q8 9 16 0" stroke="#2E2A3B" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        '<g fill="#E8A020">' +
          '<circle cx="46" cy="52" r="1.3"/><circle cx="54" cy="52" r="1.3"/><circle cx="50" cy="55" r="1.3"/>' +
        '</g>' +
      '</svg>'
    },
    {
      id: 'buerste',
      name: 'Schrubber und Seifenblasen',
      bg: '#E4F4FF',
      svg: '<svg viewBox="0 0 100 100">' +
        '<circle cx="22" cy="20" r="11" fill="#BFE6FA"/>' +
        '<circle cx="18.5" cy="16.5" r="3.4" fill="#fff"/>' +
        '<circle cx="47" cy="11" r="7.5" fill="#BFE6FA"/>' +
        '<circle cx="45" cy="9" r="2.4" fill="#fff"/>' +
        '<circle cx="73" cy="22" r="12.5" fill="#BFE6FA"/>' +
        '<circle cx="69" cy="17.5" r="4.2" fill="#fff"/>' +
        // Upright handle, not a bow: as an arch over the body the whole
        // thing read as a wicker basket.
        '<rect x="45" y="14" width="10" height="40" rx="5" fill="#E0AC68" transform="rotate(12 50 34)"/>' +
        '<rect x="16" y="48" width="68" height="20" rx="9" fill="#C98C46"/>' +
        '<rect x="16" y="48" width="68" height="9" rx="4.5" fill="#E0AC68"/>' +
        '<g fill="#E8B23C">' + bristles() + '</g>' +
      '</svg>'
    },
    {
      id: 'kuchen',
      name: 'Kirschkuchen',
      bg: '#FFECEF',
      svg: '<svg viewBox="0 0 100 100">' +
        // A whole small cake seen head-on. The earlier side-on wedge with
        // a cream cap read as a pudding rather than as cake.
        '<ellipse cx="50" cy="88" rx="37" ry="7.5" fill="#DDDDE6"/>' +
        '<ellipse cx="50" cy="86" rx="37" ry="7.5" fill="#fff"/>' +
        '<rect x="20" y="50" width="60" height="34" rx="6" fill="#E8C48A"/>' +
        '<rect x="20" y="62" width="60" height="9" fill="#D9384E"/>' +
        '<path d="M20 46q0-6 6-6h48q6 0 6 6v8H20z" fill="#FFFDF8"/>' +
        '<g fill="#FFFDF8">' +
          '<circle cx="26" cy="54" r="5"/><circle cx="38" cy="54" r="5"/><circle cx="50" cy="54" r="5"/>' +
          '<circle cx="62" cy="54" r="5"/><circle cx="74" cy="54" r="5"/>' +
        '</g>' +
        '<circle cx="50" cy="32" r="8.5" fill="#D9384E"/>' +
        '<circle cx="46.8" cy="29.8" r="2.5" fill="#FF8FA0" opacity=".85"/>' +
        '<path d="M51 24q3-10 12-10" stroke="#57C785" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
      '</svg>'
    },
    {
      id: 'koffer',
      name: 'Der Reisekoffer',
      bg: '#EFEAE2',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M39 27q11-13 22 0" stroke="#6E4A2E" stroke-width="6.5" fill="none" stroke-linecap="round"/>' +
        '<rect x="11" y="29" width="78" height="54" rx="8" fill="#A9713E"/>' +
        '<rect x="11" y="29" width="78" height="13" rx="6.5" fill="#C08A52"/>' +
        '<rect x="27" y="29" width="9" height="54" fill="#6E4A2E"/>' +
        '<rect x="64" y="29" width="9" height="54" fill="#6E4A2E"/>' +
        '<rect x="25" y="50" width="13" height="9" rx="2.5" fill="#F3B52C"/>' +
        '<rect x="62" y="50" width="13" height="9" rx="2.5" fill="#F3B52C"/>' +
        '<circle cx="50" cy="62" r="10" fill="#57C785"/>' +
        '<path d="M50 54 52.4 59.2 58 60l-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8z" fill="#fff"/>' +
        '<rect x="11" y="86" width="18" height="6" rx="3" fill="#6E4A2E"/>' +
        '<rect x="71" y="86" width="18" height="6" rx="3" fill="#6E4A2E"/>' +
      '</svg>'
    }
  ];

  window.MemoryThemes.register({
    id: 'wirbelwind',
    name: 'Wirbelwind',
    title: 'Ayas<br>Wirbelwind-Memory',
    cover: 'maedchen',                 // motif shown on the theme picker
    vars: {
      '--sky-top':    '#BFE8FF',
      '--sky-mid':    '#DDF1FF',
      '--sky-bottom': '#FFF6E5',
      '--meadow':     '#57C785',
      '--back-a':     '#FF5A5A',       // card back stripes
      '--back-b':     '#FFF3F3',
      '--back-badge': '#F3B52C',
      '--title-ink':  '#FF5A5A',
      '--accent':     '#3FA7E0'
    },
    motifs: MOTIFS
  });
})();
