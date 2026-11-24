// Génère les illustrations SVG provisoires (poids lourd porteur plateau, vue de profil).
// Dessin original, sans marque ni marquage. Usage : node scripts/build-illus.mjs
// Ces fichiers sont des visuels d'attente : les remplacer par des photos via src/data/site.json.
import { writeFileSync, mkdirSync } from 'node:fs';

const INK = '#171B20', LINE = '#3A424D', GREY = '#C9CFD6', LIGHT = '#F1F3F5', WHITE = '#FFFFFF', ORANGE = '#F58225', DORANGE = '#C25E0E';
const W = 1200, H = 520, G = 440; // sol

const wheel = (cx, r = 44) => `
  <g><circle cx="${cx}" cy="${G - r}" r="${r}" fill="${INK}"/>
  <circle cx="${cx}" cy="${G - r}" r="${r * 0.52}" fill="${GREY}" stroke="${LINE}" stroke-width="3"/>
  <circle cx="${cx}" cy="${G - r}" r="${r * 0.16}" fill="${LINE}"/></g>`;

const truck = () => `
  <ellipse cx="620" cy="${G + 4}" rx="520" ry="10" fill="${INK}" opacity=".08"/>
  <line x1="40" y1="${G}" x2="1160" y2="${G}" stroke="${GREY}" stroke-width="2"/>
  <!-- châssis -->
  <rect x="150" y="360" width="905" height="22" rx="3" fill="${LINE}"/>
  <!-- garde-boue arrière -->
  <path d="M640 384 a64 64 0 0 1 128 0 M736 384 a64 64 0 0 1 128 0" fill="none" stroke="${INK}" stroke-width="10"/>
  <!-- réservoir / coffre -->
  <rect x="860" y="384" width="80" height="34" rx="6" fill="${GREY}" stroke="${LINE}" stroke-width="3"/>
  <!-- plateau 10 m -->
  <rect x="160" y="336" width="720" height="24" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>
  <line x1="166" y1="352" x2="874" y2="352" stroke="${ORANGE}" stroke-width="3" stroke-dasharray="26 18"/>
  <!-- ridelle avant / tablier -->
  <rect x="872" y="232" width="18" height="104" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>
  <line x1="881" y1="244" x2="881" y2="326" stroke="${GREY}" stroke-width="3"/>
  <!-- treuil -->
  <rect x="826" y="314" width="40" height="22" rx="4" fill="${LINE}"/>
  <circle cx="846" cy="325" r="7" fill="${GREY}"/>
  <!-- rampes arrière relevées -->
  <path d="M146 336 L132 196 L152 194 L166 336 Z" fill="${WHITE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M138 226 L156 225 M140 256 L159 255 M143 286 L161 285 M145 316 L163 315" stroke="${GREY}" stroke-width="3"/>
  <!-- cabine -->
  <path d="M900 380 L900 196 Q900 168 928 166 L1046 162 Q1066 162 1072 182 L1098 300 L1104 380 Z" fill="${WHITE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M1032 178 L1052 178 Q1060 178 1063 188 L1084 286 L1032 286 Z" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
  <rect x="930" y="186" width="84" height="88" rx="6" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
  <line x1="1020" y1="296" x2="1020" y2="376" stroke="${GREY}" stroke-width="3"/>
  <rect x="1078" y="324" width="28" height="26" rx="3" fill="${GREY}" stroke="${LINE}" stroke-width="2"/>
  <rect x="1094" y="356" width="18" height="26" rx="3" fill="${INK}"/>
  <rect x="918" y="300" width="48" height="10" rx="3" fill="${GREY}"/>
  <!-- gyrophares -->
  <rect x="940" y="152" width="18" height="12" rx="4" fill="${ORANGE}"/><rect x="1018" y="150" width="18" height="12" rx="4" fill="${ORANGE}"/>
  <!-- garde-boue avant -->
  <path d="M960 384 a50 50 0 0 1 100 0" fill="none" stroke="${INK}" stroke-width="10"/>
  ${wheel(704)}${wheel(800)}${wheel(1010)}
  <!-- feux latéraux -->
  <rect x="300" y="384" width="10" height="6" fill="${ORANGE}"/><rect x="480" y="384" width="10" height="6" fill="${ORANGE}"/>`;

const strap = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${DORANGE}" stroke-width="4" stroke-linecap="round"/>`;
const chock = x => `<path d="M${x} 336 l14 -16 l14 16 z" fill="${INK}"/>`;

const loads = {
  'camion-vide': () => '',
  'camion-mini-pelle': () => `
    <rect x="340" y="296" width="230" height="40" rx="20" fill="${INK}"/>
    <rect x="352" y="306" width="206" height="20" rx="10" fill="${LINE}"/>
    ${[372, 412, 452, 492, 532].map(x => `<circle cx="${x}" cy="316" r="6" fill="${GREY}"/>`).join('')}
    <rect x="380" y="274" width="160" height="24" rx="4" fill="${LINE}"/>
    <path d="M372 274 L372 222 Q372 200 394 200 L470 200 L470 274 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M386 206 L452 206 L452 252 L386 252 Z" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
    <rect x="470" y="232" width="78" height="42" rx="6" fill="${ORANGE}" stroke="${INK}" stroke-width="4"/>
    <path d="M540 250 L610 170 L628 182 L566 262 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M612 172 L640 300 L620 304 L596 184 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M612 296 L668 296 L660 334 L620 334 Z" fill="${LINE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="300" y="318" width="40" height="14" rx="3" fill="${LINE}"/>
    ${strap(352, 312, 300, 336)}${strap(560, 312, 612, 336)}${chock(318)}${chock(578)}`,
  'camion-nacelle': () => `
    <rect x="360" y="290" width="300" height="34" rx="6" fill="${ORANGE}" stroke="${INK}" stroke-width="4"/>
    <circle cx="400" cy="326" r="10" fill="${INK}"/><circle cx="620" cy="326" r="10" fill="${INK}"/>
    <path d="M390 290 L630 250 M390 250 L630 290 M390 250 L630 210 M390 210 L630 250" stroke="${LINE}" stroke-width="8" stroke-linecap="round"/>
    <rect x="360" y="196" width="300" height="16" rx="3" fill="${ORANGE}" stroke="${INK}" stroke-width="4"/>
    <path d="M366 196 L366 150 L654 150 L654 196 M366 172 L654 172 M462 150 L462 196 M558 150 L558 196" fill="none" stroke="${INK}" stroke-width="4"/>
    ${strap(380, 300, 330, 336)}${strap(640, 300, 690, 336)}${chock(366)}${chock(626)}`,
  'camion-compacteur': () => `
    <circle cx="400" cy="296" r="38" fill="${LINE}" stroke="${INK}" stroke-width="4"/><circle cx="400" cy="296" r="14" fill="${GREY}"/>
    <circle cx="600" cy="296" r="38" fill="${LINE}" stroke="${INK}" stroke-width="4"/><circle cx="600" cy="296" r="14" fill="${GREY}"/>
    <path d="M380 252 L620 252 L636 290 L364 290 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="456" y="214" width="100" height="38" rx="6" fill="${ORANGE}" stroke="${INK}" stroke-width="4"/>
    <path d="M468 214 L468 156 L546 156 L546 214 M462 156 L552 156" fill="none" stroke="${INK}" stroke-width="5"/>
    <rect x="490" y="196" width="34" height="18" rx="4" fill="${INK}"/>
    ${strap(372, 296, 330, 336)}${strap(628, 296, 670, 336)}${chock(344)}${chock(628)}`,
  'camion-materiel': () => `
    ${[0, 1, 2].map(i => `<rect x="200" y="${318 - i * 18}" width="620" height="18" fill="${i % 2 ? GREY : LINE}" stroke="${INK}" stroke-width="3"/>`).join('')}
    <path d="M206 266 L206 300 M226 266 L226 300 M206 283 L226 283" stroke="${INK}" stroke-width="5"/>
    ${[0, 1, 2, 3].map(i => `<rect x="${250 + i * 140}" y="196" width="120" height="70" fill="none" stroke="${INK}" stroke-width="5"/><path d="M${250 + i * 140} 196 L${370 + i * 140} 266" stroke="${LINE}" stroke-width="3"/>`).join('')}
    ${[240, 520, 800].map(x => strap(x, 192, x, 336)).join('')}`,
  'camion-utilitaire': () => `
    <path d="M300 320 L300 214 Q300 196 318 196 L640 196 Q664 196 680 216 L742 278 Q756 290 756 306 L756 320 Z" fill="${WHITE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M652 210 L676 210 L730 274 L652 274 Z" fill="${LIGHT}" stroke="${INK}" stroke-width="3"/>
    <line x1="640" y1="200" x2="640" y2="318" stroke="${GREY}" stroke-width="3"/>
    <line x1="470" y1="200" x2="470" y2="318" stroke="${GREY}" stroke-width="3"/>
    <circle cx="370" cy="312" r="24" fill="${INK}"/><circle cx="370" cy="312" r="10" fill="${GREY}"/>
    <circle cx="680" cy="312" r="24" fill="${INK}"/><circle cx="680" cy="312" r="10" fill="${GREY}"/>
    ${strap(370, 312, 330, 336)}${strap(370, 312, 410, 336)}${strap(680, 312, 640, 336)}${strap(680, 312, 720, 336)}`
};

mkdirSync(new URL('../src/assets/img/illus/', import.meta.url), { recursive: true });
for (const [name, load] of Object.entries(loads)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><title>Illustration — poids lourd porteur plateau</title>${truck()}${load()}</svg>`;
  writeFileSync(new URL(`../src/assets/img/illus/${name}.svg`, import.meta.url), svg.replace(/\n\s*/g, ' ').replace(/<!--.*?-->/g, ''));
}
console.log('Illustrations générées :', Object.keys(loads).join(', '));
