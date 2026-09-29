// Kleine geluidjes, ter plekke gemaakt met Web Audio: geen bestanden nodig.

import { OPNAMES } from "@/avatar/geluiden";
import type { Zang } from "@/avatar/vogels";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    ctx ??= new AudioContext();
    // iPad start de context pas na een tik; elke aanroep komt uit een tik.
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function toon(freq: number, start: number, duur: number, type: OscillatorType = "sine", volume = 0.2) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duur + 0.05);
}

export function pling() {
  toon(880, 0, 0.18);
  toon(1320, 0.09, 0.3);
}

export function nogEens() {
  toon(330, 0, 0.15, "triangle", 0.15);
  toon(294, 0.12, 0.25, "triangle", 0.15);
}

export function fanfare() {
  [523, 659, 784, 1047].forEach((f, i) => toon(f, i * 0.12, 0.3, "triangle", 0.18));
  toon(1047, 0.5, 0.6, "sine", 0.2);
  toon(1319, 0.5, 0.6, "sine", 0.12);
}

export function klik() {
  toon(660, 0, 0.08, "sine", 0.1);
}

/** Een held die voorbijvliegt: een zoevende glijtoon en een klein heldendeuntje. */
export function woesj() {
  glij(180, 1400, 0, 0.32, "sawtooth", 0.05);
  glij(240, 1800, 0.02, 0.3, "triangle", 0.12);
  [784, 1047, 1319].forEach((f, i) => toon(f, 0.3 + i * 0.09, 0.22, "square", 0.05));
}

// ---- Vogels -------------------------------------------------------------------

/** Een toon die van f1 naar f2 glijdt: de bouwsteen van getjilp en gefluit. */
function glij(f1: number, f2: number, start: number, duur: number, type: OscillatorType = "sine", volume = 0.14) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f1, t);
  osc.frequency.exponentialRampToValueAtTime(f2, t + duur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + Math.min(0.02, duur / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duur + 0.05);
}

const spelers = new Map<string, HTMLAudioElement>();

/**
 * Laat een vogel zingen: een echte opname uit public/geluiden (zie
 * geluiden.ts), of het nagemaakte geluidje als er geen opname is of die niet
 * wil spelen.
 */
export function zingVogel(vogel: { id: string; zang: Zang }) {
  if (typeof window === "undefined" || !OPNAMES[vogel.id]) return zing(vogel.zang);
  let speler = spelers.get(vogel.id);
  if (!speler) {
    speler = new Audio(`/geluiden/${vogel.id}.m4a`);
    spelers.set(vogel.id, speler);
  }
  // Wie opnieuw tikt, hoort het opnieuw van bij het begin.
  spelers.forEach((s) => s !== speler && s.pause());
  speler.currentTime = 0;
  speler.play().catch(() => zing(vogel.zang));
}

/** Een nagemaakt geluidje per soort vogel (zie `Zang` in vogels.tsx). */
export function zing(zang: Zang) {
  switch (zang) {
    case "tjilp":
      [0, 0.13, 0.26].forEach((s) => glij(3200, 4200, s, 0.07));
      break;
    case "fluit":
      glij(1800, 2600, 0, 0.18);
      glij(2600, 2000, 0.2, 0.16);
      glij(2200, 3000, 0.4, 0.22);
      break;
    case "hoe":
      glij(360, 320, 0, 0.3, "sine", 0.22);
      glij(360, 300, 0.42, 0.5, "sine", 0.22);
      break;
    case "krijs":
      glij(2400, 1300, 0, 0.35, "sawtooth", 0.06);
      glij(2600, 1500, 0, 0.35, "triangle", 0.1);
      break;
    case "kwak":
      [0, 0.22].forEach((s) => glij(420, 300, s, 0.14, "sawtooth", 0.07));
      break;
    case "gak":
      glij(700, 520, 0, 0.18, "square", 0.05);
      glij(760, 540, 0.24, 0.2, "square", 0.05);
      break;
    case "lach":
      [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach((s, i) => glij(900 + (i % 2) * 400, 700 + (i % 2) * 300, s, 0.08, "triangle", 0.12));
      break;
    case "roffel":
      for (let i = 0; i < 10; i++) glij(260, 180, i * 0.045, 0.03, "square", 0.08);
      break;
    case "klapper":
      for (let i = 0; i < 8; i++) glij(1400, 900, i * 0.06, 0.025, "square", 0.06);
      break;
    case "zoem":
      glij(180, 200, 0, 0.5, "sawtooth", 0.04);
      glij(5200, 6000, 0.12, 0.06);
      break;
    default:
      pling();
  }
}
