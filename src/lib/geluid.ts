// Kleine geluidjes, ter plekke gemaakt met Web Audio: geen bestanden nodig.

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
