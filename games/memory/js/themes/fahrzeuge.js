/* ============================================================
   theme: fahrzeuge - vehicles.
   Second theme, drawn from scratch like the first one. It exists
   to keep the theme boundary honest: if adding a theme ever needs
   a change in game.js, the abstraction has leaked.
   ============================================================ */

(function () {
  'use strict';

  // Wheels are the one shape that repeats across almost every motif.
  function wheel(cx, cy, r, hub) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#2E2A3B"/>' +
           '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.44).toFixed(1) + '" fill="' + (hub || '#D6D6DE') + '"/>';
  }

  var MOTIFS = [
    {
      id: 'auto',
      name: 'Das Auto',
      bg: '#FFE7E7',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M28 46 38 32q2-3 6-3h14q4 0 6 3l10 14z" fill="#E24E4E"/>' +
        '<path d="M34 44 41 33h7v11z" fill="#BFE6FA"/>' +
        '<path d="M52 44V33h7l7 11z" fill="#BFE6FA"/>' +
        '<rect x="10" y="44" width="80" height="22" rx="8" fill="#E24E4E"/>' +
        '<rect x="10" y="56" width="80" height="10" rx="5" fill="#C93E3E"/>' +
        '<rect x="83" y="49" width="8" height="7" rx="3.5" fill="#FFE27A"/>' +
        '<rect x="9" y="49" width="8" height="7" rx="3.5" fill="#FFB0B0"/>' +
        wheel(30, 68, 12) + wheel(70, 68, 12) +
      '</svg>'
    },
    {
      id: 'bus',
      name: 'Der Bus',
      bg: '#FFF6D6',
      svg: '<svg viewBox="0 0 100 100">' +
        '<rect x="9" y="24" width="82" height="44" rx="9" fill="#F5C93F"/>' +
        '<rect x="15" y="31" width="17" height="15" rx="3" fill="#BFE6FA"/>' +
        '<rect x="37" y="31" width="17" height="15" rx="3" fill="#BFE6FA"/>' +
        '<rect x="59" y="31" width="17" height="15" rx="3" fill="#BFE6FA"/>' +
        '<rect x="9" y="52" width="82" height="7" fill="#E0A81F"/>' +
        '<rect x="82" y="60" width="9" height="7" rx="3.5" fill="#FFF3C4"/>' +
        '<rect x="9" y="60" width="9" height="7" rx="3.5" fill="#FFB0B0"/>' +
        wheel(28, 71, 11) + wheel(72, 71, 11) +
      '</svg>'
    },
    {
      id: 'zug',
      name: 'Die Lokomotive',
      bg: '#E2F1FB',
      svg: '<svg viewBox="0 0 100 100">' +
        '<circle cx="64" cy="19" r="6" fill="#fff" opacity=".85"/>' +
        '<circle cx="74" cy="11" r="7.5" fill="#fff" opacity=".6"/>' +
        '<rect x="57" y="26" width="13" height="18" rx="3" fill="#2A7FB0"/>' +
        '<rect x="13" y="28" width="34" height="34" rx="6" fill="#3FA7E0"/>' +
        '<rect x="19" y="34" width="22" height="16" rx="3" fill="#BFE6FA"/>' +
        '<rect x="43" y="42" width="45" height="24" rx="8" fill="#3FA7E0"/>' +
        '<circle cx="85" cy="54" r="9.5" fill="#2A7FB0"/>' +
        '<rect x="11" y="62" width="79" height="9" rx="4.5" fill="#2A7FB0"/>' +
        '<rect x="4" y="86" width="92" height="5" rx="2.5" fill="#9B8E7A"/>' +
        wheel(27, 76, 9) + wheel(53, 76, 9) + wheel(78, 76, 9) +
      '</svg>'
    },
    {
      id: 'flugzeug',
      name: 'Das Flugzeug',
      bg: '#E7F3FF',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M44 54 30 78h15l16-24z" fill="#2A7FB0"/>' +
        '<path d="M44 52 30 28h15l16 24z" fill="#3FA7E0"/>' +
        '<path d="M14 52 10 32h9l9 20z" fill="#3FA7E0"/>' +
        '<ellipse cx="50" cy="54" rx="42" ry="11" fill="#fff" stroke="#C9D2DC" stroke-width="2"/>' +
        '<path d="M80 48q9 2 9 6-4 3-9 3z" fill="#BFE6FA"/>' +
        '<g fill="#BFE6FA">' +
          '<circle cx="40" cy="53" r="3"/><circle cx="52" cy="53" r="3"/><circle cx="64" cy="53" r="3"/>' +
        '</g>' +
      '</svg>'
    },
    {
      id: 'traktor',
      name: 'Der Traktor',
      bg: '#E6F7EC',
      svg: '<svg viewBox="0 0 100 100">' +
        '<rect x="57" y="18" width="7" height="18" rx="3.5" fill="#3FA764"/>' +
        '<rect x="30" y="30" width="27" height="25" rx="5" fill="#57C785"/>' +
        '<rect x="34" y="34" width="19" height="14" rx="2.5" fill="#BFE6FA"/>' +
        '<rect x="18" y="52" width="58" height="19" rx="6" fill="#57C785"/>' +
        '<rect x="72" y="44" width="13" height="11" rx="3" fill="#3FA764"/>' +
        wheel(30, 72, 15, '#F5C93F') + wheel(74, 77, 10, '#F5C93F') +
      '</svg>'
    },
    {
      id: 'bagger',
      name: 'Der Bagger',
      bg: '#FFF3D9',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M50 50 76 32" stroke="#F5C93F" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M76 32 82 58" stroke="#F5C93F" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M74 58q15 2 16 12-2 8-14 6-9-2-7-12z" fill="#E0A81F"/>' +
        '<rect x="15" y="38" width="35" height="32" rx="6" fill="#F5C93F"/>' +
        '<rect x="20" y="43" width="23" height="17" rx="3" fill="#BFE6FA"/>' +
        '<rect x="9" y="71" width="60" height="19" rx="9.5" fill="#2E2A3B"/>' +
        '<circle cx="21" cy="80.5" r="6" fill="#8A8A96"/>' +
        '<circle cx="39" cy="80.5" r="6" fill="#8A8A96"/>' +
        '<circle cx="57" cy="80.5" r="6" fill="#8A8A96"/>' +
      '</svg>'
    },
    {
      id: 'feuerwehr',
      name: 'Das Feuerwehrauto',
      bg: '#FFE9E9',
      svg: '<svg viewBox="0 0 100 100">' +
        '<g transform="rotate(-8 66 30)" fill="#C9C9D4">' +
          '<rect x="44" y="23" width="47" height="3.5" rx="1.75"/>' +
          '<rect x="44" y="32" width="47" height="3.5" rx="1.75"/>' +
          '<rect x="51" y="23" width="3" height="12"/><rect x="61" y="23" width="3" height="12"/>' +
          '<rect x="71" y="23" width="3" height="12"/><rect x="81" y="23" width="3" height="12"/>' +
        '</g>' +
        '<rect x="17" y="23" width="11" height="8" rx="4" fill="#3FA7E0"/>' +
        '<rect x="8" y="30" width="33" height="19" rx="5" fill="#E24E4E"/>' +
        '<rect x="13" y="34" width="22" height="12" rx="2.5" fill="#BFE6FA"/>' +
        '<rect x="8" y="42" width="84" height="26" rx="7" fill="#E24E4E"/>' +
        '<rect x="8" y="58" width="84" height="10" rx="5" fill="#C93E3E"/>' +
        '<rect x="50" y="46" width="34" height="9" rx="3" fill="#F5C93F"/>' +
        wheel(26, 71, 11) + wheel(72, 71, 11) +
      '</svg>'
    },
    {
      id: 'rakete',
      name: 'Die Rakete',
      bg: '#EDE9FB',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M50 76q-9 13-5 20 5 4 5-5 0 9 5 5 4-7-5-20z" fill="#F5C93F"/>' +
        '<path d="M50 79q-5 9-3 14 3 3 3-3 0 6 3 3 2-5-3-14z" fill="#E24E4E"/>' +
        '<path d="M34 52q-15 10-15 25h15z" fill="#E24E4E"/>' +
        '<path d="M66 52q15 10 15 25H66z" fill="#E24E4E"/>' +
        '<path d="M50 7q16 15 16 39v28H34V46q0-24 16-39z" fill="#fff" stroke="#C9D2DC" stroke-width="2"/>' +
        '<path d="M50 7q8 8 12 19H38q4-11 12-19z" fill="#E24E4E"/>' +
        '<circle cx="50" cy="43" r="9" fill="#BFE6FA" stroke="#8FB8CF" stroke-width="2.5"/>' +
      '</svg>'
    },
    {
      id: 'fahrrad',
      name: 'Das Fahrrad',
      bg: '#E9F7EE',
      svg: '<svg viewBox="0 0 100 100">' +
        '<circle cx="25" cy="64" r="19" fill="none" stroke="#2E2A3B" stroke-width="5"/>' +
        '<circle cx="75" cy="64" r="19" fill="none" stroke="#2E2A3B" stroke-width="5"/>' +
        '<path d="M25 64 44 38h20l11 26M44 38 58 64M25 64h33" stroke="#E24E4E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="36" y="31" width="17" height="6" rx="3" fill="#4A4252"/>' +
        '<path d="M64 38q9-5 11 2" stroke="#4A4252" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="58" cy="64" r="5.5" fill="#F5C93F"/>' +
      '</svg>'
    },
    {
      id: 'ballon',
      name: 'Der Heißluftballon',
      bg: '#FFF0F5',
      svg: '<svg viewBox="0 0 100 100">' +
        '<path d="M50 8q26 0 26 28 0 18-26 34Q24 54 24 36 24 8 50 8z" fill="#F5C93F"/>' +
        '<path d="M50 8Q37 32 37 66q-8-8-11-18Q24 16 50 8z" fill="#E24E4E"/>' +
        '<path d="M50 8q13 24 13 58 8-8 11-18Q76 16 50 8z" fill="#3FA7E0"/>' +
        '<path d="M41 66 44 78M59 66 56 78" stroke="#8A5A30" stroke-width="2.5"/>' +
        '<path d="M42 77h16l-2 13q0 3-3 3h-6q-3 0-3-3z" fill="#A9713E"/>' +
        '<rect x="41" y="75" width="18" height="5" rx="2.5" fill="#C08A52"/>' +
      '</svg>'
    }
  ];

  window.MemoryThemes.register({
    id: 'fahrzeuge',
    name: 'Fahrzeuge',
    title: 'Ayas<br>Fahrzeug-Memory',
    cover: 'auto',
    vars: {
      '--sky-top':    '#CDE9FF',
      '--sky-mid':    '#E6F2FF',
      '--sky-bottom': '#FFF4E0',
      '--meadow':     '#8FC96B',
      '--back-a':     '#3FA7E0',
      '--back-b':     '#EFF8FF',
      '--back-badge': '#F5C93F',
      '--title-ink':  '#2A7FB0',
      '--accent':     '#E24E4E'
    },
    motifs: MOTIFS
  });
})();
