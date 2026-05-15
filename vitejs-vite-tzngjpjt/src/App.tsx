import React, { useEffect, useMemo, useState } from "react";
import { melakartaData } from "./melakartaData";

// ─── Constants ────────────────────────────────────────────────────────────────

const KEY_OPTIONS = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"] as const;
type KeyName = typeof KEY_OPTIONS[number];

const KEY_TO_SEMITONE: Record<KeyName, number> = {
  C: 0, "C♯": 1, D: 2, "E♭": 3, E: 4, F: 5, "F♯": 6, G: 7,
  "A♭": 8, A: 9, "B♭": 10, B: 11,
};

const LETTER_BASE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

const SWARA_SEMITONE: Record<string, number> = {
  S: 0,
  R1: 1, R2: 2, R3: 3,
  G1: 2, G2: 3, G3: 4,
  M1: 5, M2: 6,
  P: 7,
  D1: 8, D2: 9, D3: 10,
  N1: 9, N2: 10, N3: 11,
  "S'": 12,
};

const SWARA_TO_LETTER_OFFSET: Record<string, number> = {
  S: 0, R: 1, G: 2, M: 3, P: 4, D: 5, N: 6, "S'": 7,
};

const CHAKRA_NAMES = [
  "Indu", "Netra", "Agni", "Veda", "Bana", "Rutu",
  "Rishi", "Vasu", "Brahma", "Disi", "Rudra", "Aditya",
];

const SWARA_LABELS: Record<string, string> = {
  S: "Sa", R: "Ri", G: "Ga", M: "Ma", P: "Pa", D: "Da", N: "Ni", "S'": "Tāra",
};

// ─── Music Logic (unchanged) ──────────────────────────────────────────────────

function normalizeSigned12(diff: number) {
  let d = ((diff % 12) + 12) % 12;
  if (d > 6) d -= 12;
  return d;
}

function accidentalFromDiff(diff: number) {
  if (diff === 0) return "";
  if (diff > 0) return "♯".repeat(diff);
  return "♭".repeat(-diff);
}

function getLetterForOffset(rootLetterIndex: number, offset: number) {
  return LETTERS[(rootLetterIndex + offset) % 7];
}

function spelledNoteForSwara(key: KeyName, swara: string) {
  const rootSemitone = KEY_TO_SEMITONE[key];
  const rootLetter = key[0];
  const rootLetterIndex = LETTERS.indexOf(rootLetter);
  const letterKey = swara[0] === "S" ? "S" : swara[0];
  const offset = SWARA_TO_LETTER_OFFSET[letterKey] ?? 0;
  const targetLetter = getLetterForOffset(rootLetterIndex, offset);
  const naturalLetterSemitone = LETTER_BASE[targetLetter];
  const desiredAbsolute = (rootSemitone + (SWARA_SEMITONE[swara] ?? 0)) % 12;
  const rawDiff = desiredAbsolute - naturalLetterSemitone;
  const signedDiff = normalizeSigned12(rawDiff);
  const accidental = accidentalFromDiff(signedDiff);
  return { spelled: `${targetLetter}${accidental}`, semitone: desiredAbsolute };
}

const C4 = 261.63;
function freqForSemitone(semi: number) {
  return C4 * Math.pow(2, semi / 12);
}

function playSineTone(freq: number, duration = 0.48) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
    setTimeout(() => {
      try { osc.disconnect(); gain.disconnect(); ctx.close(); } catch {}
    }, (duration + 0.1) * 1000);
  } catch (e) {
    console.warn("Audio play failed", e);
  }
}

function semitoneForToken(key: KeyName, token: string) {
  const root = KEY_TO_SEMITONE[key];
  const swaraSemi = SWARA_SEMITONE[token] ?? 0;
  return root + swaraSemi;
}

function normalizeArr(arr: string[]) {
  return arr.map((x) => x.trim());
}

// ─── Sub-component: Swara sequence display ────────────────────────────────────

function SwaraSeq({
  tokens,
  label,
  keyName,
}: {
  tokens: string[];
  label: string;
  keyName: KeyName;
}) {
  return (
    <div className="mk-scale-section">
      <div className="mk-scale-heading">{label}</div>
      <div className="mk-swara-seq">
        {tokens.map((tok, i) => {
          const isFixed = tok === "S" || tok === "P" || tok === "S'";
          const note = spelledNoteForSwara(keyName, tok).spelled;
          return (
            <React.Fragment key={`${tok}-${i}`}>
              {i > 0 && <span className="mk-seq-dash">–</span>}
              <span className={`mk-seq-pill${!isFixed ? " highlight" : ""}`}>
                <span className="mk-seq-pill-swara">{tok}</span>
                <span className="mk-seq-pill-note">{note}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── Global Styles ────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:           #fdf6ec;
  --bg-card:      #ffffff;
  --border:       #e6d5b8;
  --text-1:       #2c1810;
  --text-2:       #7c5c3e;
  --text-3:       #a08060;
  --accent:       #8b1a1a;
  --accent-h:     #a82020;
  --gold:         #c6882a;
  --gold-l:       #e8a84c;
  --fixed-bg:     #f0e6d0;
  --fixed-text:   #9c7a50;
  --sel-bg:       #8b1a1a;
  --sel-text:     #ffffff;
  --hover-bg:     #faf0e0;
  --dis-bg:       #f4eee4;
  --dis-text:     #c0a888;
  --sh-sm:        0 1px 4px rgba(44,24,16,.07);
  --sh-md:        0 3px 16px rgba(44,24,16,.11);
  --sh-lg:        0 6px 32px rgba(44,24,16,.15);
  --r-sm: 8px; --r-md: 14px; --r-lg: 20px;
  --ease: 0.18s ease;
}

[data-theme="dark"] {
  --bg:           #100c08;
  --bg-card:      #1c1510;
  --border:       #352818;
  --text-1:       #f5e6d0;
  --text-2:       #c0986a;
  --text-3:       #7a5a3a;
  --accent:       #e8a84c;
  --accent-h:     #f5c060;
  --gold:         #e8a84c;
  --gold-l:       #f5c870;
  --fixed-bg:     #261e14;
  --fixed-text:   #7a5a3a;
  --sel-bg:       #e8a84c;
  --sel-text:     #100c08;
  --hover-bg:     #241c12;
  --dis-bg:       #181210;
  --dis-text:     #3e3028;
  --sh-sm:        0 1px 4px rgba(0,0,0,.35);
  --sh-md:        0 3px 16px rgba(0,0,0,.45);
  --sh-lg:        0 6px 32px rgba(0,0,0,.55);
}

html, body {
  background: var(--bg);
  transition: background var(--ease);
}

/* ── Root ── */
.mk-root {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-1);
  min-height: 100vh;
  background: var(--bg);
  transition: background var(--ease), color var(--ease);
  padding: 24px 16px 56px;
}
.mk-inner {
  max-width: 620px;
  margin: 0 auto;
}

/* ── Header ── */
.mk-header {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
}
.mk-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: clamp(1.35rem, 5vw, 2rem);
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: .05em;
  line-height: 1.2;
  margin-bottom: 4px;
}
.mk-subtitle {
  font-size: .75rem;
  color: var(--text-3);
  letter-spacing: .15em;
  text-transform: uppercase;
}
.mk-ornament { color: var(--gold); }
.mk-theme-btn {
  position: absolute;
  top: 2px; right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 38px; height: 38px;
  cursor: pointer;
  font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--ease);
  box-shadow: var(--sh-sm);
}
.mk-theme-btn:hover { box-shadow: var(--sh-md); transform: scale(1.1); }

/* ── Step indicator ── */
.mk-steps {
  display: flex;
  align-items: center;
  margin-bottom: 22px;
  padding: 0 4px;
}
.mk-step-node {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.mk-step-circle {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  border: 2px solid var(--border);
  background: var(--bg-card);
  color: var(--text-3);
  transition: all .25s ease;
}
.mk-step-circle.active {
  background: var(--accent); border-color: var(--accent); color: #fff;
  box-shadow: 0 0 0 4px rgba(139,26,26,.15);
}
[data-theme="dark"] .mk-step-circle.active { color: var(--bg); box-shadow: 0 0 0 4px rgba(232,168,76,.18); }
.mk-step-circle.done {
  background: var(--gold); border-color: var(--gold); color: #fff;
}
[data-theme="dark"] .mk-step-circle.done { color: var(--bg); }
.mk-step-label {
  font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--text-3); transition: color var(--ease);
}
.mk-step-label.active { color: var(--accent); }
.mk-step-label.done   { color: var(--gold); }
.mk-step-line {
  flex: 1; height: 2px;
  background: var(--border);
  margin: 0 8px; margin-bottom: 20px;
  border-radius: 1px; transition: background .3s ease;
}
.mk-step-line.done { background: var(--gold); }

/* ── Card ── */
.mk-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-md);
  padding: 24px;
  transition: background var(--ease), border-color var(--ease), box-shadow var(--ease);
}
.mk-section-label {
  font-size: .68rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 14px;
}

/* ── Key grid ── */
.mk-key-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}
@media (max-width: 400px) {
  .mk-key-grid { grid-template-columns: repeat(4, 1fr); }
}
.mk-key-btn {
  padding: 11px 4px;
  border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text-1);
  font-size: 14px; font-weight: 600;
  cursor: pointer; text-align: center;
  transition: all var(--ease);
  font-family: inherit;
}
.mk-key-btn:hover {
  background: var(--hover-bg); border-color: var(--accent);
  transform: translateY(-1px); box-shadow: var(--sh-sm);
}
.mk-key-btn.selected {
  background: var(--accent); border-color: var(--accent); color: #fff;
  transform: translateY(-1px); box-shadow: var(--sh-md);
}
[data-theme="dark"] .mk-key-btn.selected { color: var(--bg); }
.mk-key-hint {
  margin-top: 16px; font-size: 12px;
  color: var(--text-3); font-style: italic;
}

/* ── Key bar (step 2 header) ── */
.mk-key-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap; gap: 10px;
}
.mk-key-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--fixed-bg);
  border: 1px solid var(--border);
  border-radius: 20px; padding: 5px 14px;
  font-weight: 700; font-size: 14px; color: var(--accent);
}
.mk-progress {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600;
  color: var(--text-3);
  background: var(--fixed-bg);
  border: 1px solid var(--border);
  border-radius: 20px; padding: 4px 12px;
}
.mk-progress-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--border); transition: background .2s;
}
.mk-progress-dot.filled { background: var(--accent); }

/* ── Swara rows ── */
.mk-swara-rows { display: flex; flex-direction: column; gap: 9px; }
.mk-swara-row  { display: flex; align-items: center; gap: 10px; }
.mk-swara-row-label {
  width: 48px; flex-shrink: 0; text-align: right; padding-right: 4px;
}
.mk-swara-row-label-main {
  font-size: 13px; font-weight: 700; color: var(--text-2); line-height: 1.2;
}
.mk-swara-row-label-sub {
  font-size: 10px; color: var(--text-3); font-style: italic;
}
.mk-swara-btn-group { display: flex; gap: 7px; flex-wrap: wrap; }
.mk-swara-btn {
  padding: 9px 12px; border-radius: var(--r-sm);
  border: 1.5px solid var(--border);
  background: var(--bg-card); color: var(--text-1);
  font-family: inherit; cursor: pointer;
  transition: all var(--ease); min-width: 58px; text-align: center;
}
.mk-swara-btn:hover:not(.fixed):not(.disabled):not(.selected) {
  background: var(--hover-bg); border-color: var(--accent);
  transform: translateY(-2px); box-shadow: var(--sh-sm);
}
.mk-swara-btn.selected {
  background: var(--sel-bg); border-color: var(--sel-bg); color: var(--sel-text);
  transform: translateY(-2px); box-shadow: var(--sh-md);
}
.mk-swara-btn.fixed {
  background: var(--fixed-bg); border-color: var(--fixed-bg);
  color: var(--fixed-text); cursor: default;
}
.mk-swara-btn.disabled {
  background: var(--dis-bg); border-color: var(--dis-bg);
  color: var(--dis-text); cursor: not-allowed; opacity: .6;
}
.mk-swara-name { font-size: 13px; font-weight: 700; line-height: 1.2; }
.mk-swara-note { font-size: 10px; margin-top: 2px; opacity: .75; }

/* ── Buttons ── */
.mk-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; border-radius: var(--r-sm);
  font-family: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all var(--ease);
  border: 1.5px solid transparent;
}
.mk-btn-primary {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
[data-theme="dark"] .mk-btn-primary { color: var(--bg); }
.mk-btn-primary:hover:not(:disabled) {
  background: var(--accent-h); border-color: var(--accent-h);
  transform: translateY(-1px); box-shadow: var(--sh-md);
}
.mk-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.mk-btn-secondary {
  background: var(--fixed-bg); color: var(--text-2); border-color: var(--border);
}
.mk-btn-secondary:hover {
  background: var(--hover-bg); border-color: var(--text-3); transform: translateY(-1px);
}
.mk-btn-play-aro {
  background: var(--fixed-bg); color: var(--accent); border-color: var(--border);
}
.mk-btn-play-aro:hover {
  background: var(--accent); color: #fff; border-color: var(--accent);
  transform: translateY(-1px); box-shadow: var(--sh-md);
}
[data-theme="dark"] .mk-btn-play-aro:hover { color: var(--bg); }
.mk-btn-play-ava {
  background: var(--fixed-bg); color: var(--gold); border-color: var(--border);
}
.mk-btn-play-ava:hover {
  background: var(--gold); color: #fff; border-color: var(--gold);
  transform: translateY(-1px); box-shadow: var(--sh-md);
}
[data-theme="dark"] .mk-btn-play-ava:hover { color: var(--bg); }
.mk-btn-row {
  display: flex; flex-wrap: wrap; gap: 10px;
}

/* ── Result card ── */
.mk-result-top {
  display: flex; align-items: flex-start; gap: 16px; margin-bottom: 4px;
}
.mk-raga-num {
  font-family: 'Cinzel', Georgia, serif;
  font-size: clamp(2.8rem, 8vw, 3.4rem);
  font-weight: 900; color: var(--accent); line-height: 1;
  flex-shrink: 0;
}
.mk-raga-meta { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.mk-chakra-badge {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 20px;
  background: var(--fixed-bg); color: var(--gold);
  border: 1px solid var(--border);
  letter-spacing: .07em; text-transform: uppercase;
  width: fit-content;
}
.mk-raga-name {
  font-family: 'Cinzel', Georgia, serif;
  font-size: clamp(1.15rem, 4vw, 1.6rem);
  font-weight: 700; color: var(--text-1); line-height: 1.25;
}
.mk-madhyama-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; color: var(--text-3); font-weight: 500;
}
.mk-divider {
  height: 1px; background: var(--border); margin: 20px 0; border-radius: 1px;
}

/* ── Scale sequence ── */
.mk-scale-section { margin-bottom: 18px; }
.mk-scale-heading {
  font-size: .67rem; font-weight: 700; letter-spacing: .15em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 9px;
}
.mk-swara-seq {
  display: flex; flex-wrap: wrap; gap: 5px; align-items: center;
}
.mk-seq-pill {
  display: inline-flex; flex-direction: column; align-items: center;
  padding: 7px 10px; border-radius: 8px;
  background: var(--fixed-bg); border: 1px solid var(--border);
  min-width: 42px; transition: background var(--ease);
}
.mk-seq-pill.highlight {
  background: var(--hover-bg);
  border-color: var(--accent);
}
[data-theme="dark"] .mk-seq-pill.highlight {
  background: var(--fixed-bg);
  border-color: var(--accent);
}
.mk-seq-pill-swara {
  font-size: 12px; font-weight: 700; color: var(--text-1); line-height: 1.2;
}
.mk-seq-pill.highlight .mk-seq-pill-swara { color: var(--accent); }
.mk-seq-pill-note { font-size: 9px; color: var(--text-3); margin-top: 2px; }
.mk-seq-dash { color: var(--border); font-size: 12px; }

/* ── No match ── */
.mk-no-match { text-align: center; padding: 32px 8px; color: var(--text-2); }
.mk-no-match-icon { font-size: 2.4rem; margin-bottom: 12px; opacity: .5; }

/* ── Footer ── */
.mk-footer {
  text-align: center; margin-top: 28px;
  font-size: 11px; color: var(--text-3); letter-spacing: .1em;
}

/* ── Animations ── */
.mk-fade { animation: mkFade .28s ease forwards; }
@keyframes mkFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function App(): JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [key, setKey] = useState<KeyName>("C");
  const [dark, setDark] = useState<boolean>(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [selected, setSelected] = useState<{
    R?: string | null;
    G?: string | null;
    M?: string | null;
    D?: string | null;
    N?: string | null;
  }>({ R: null, G: null, M: null, D: null, N: null });

  // Sync theme to <html> so body background also matches
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const reservedSemitones = useMemo(() => {
    const used = new Set<number>();
    used.add(spelledNoteForSwara(key, "S").semitone);
    used.add(spelledNoteForSwara(key, "P").semitone);
    (Object.keys(selected) as (keyof typeof selected)[]).forEach((k) => {
      const tok = selected[k];
      if (tok) used.add(spelledNoteForSwara(key, tok).semitone);
    });
    return used;
  }, [key, selected]);

  const toggleSelect = (group: keyof typeof selected, token: string) => {
    const semi = semitoneForToken(key, token);
    const freq = freqForSemitone(12 + semi);
    playSineTone(freq, 0.48);
    if (token === "S" || token === "P") return;
    setSelected((prev) => ({
      ...prev,
      [group]: prev[group] === token ? null : token,
    }));
  };

  // ✅ Raga-matching logic (unchanged)
  const matched = useMemo(() => {
    if (!selected.R || !selected.G || !selected.M || !selected.D || !selected.N) return null;
    const selectedPattern = ["S", selected.R, selected.G, selected.M, "P", selected.D, selected.N, "S'"];
    const match = melakartaData.find((raga) => {
      const aro = normalizeArr(raga.Arohanam ?? []);
      return (
        aro.length === selectedPattern.length &&
        aro.every((sw, i) => sw === selectedPattern[i])
      );
    });
    return match ?? null;
  }, [selected]);

  const playSequence = (tokens: string[]) => {
    const tempoMs = 500;
    const baseOctaveShift = 12;
    const rootSemi = KEY_TO_SEMITONE[key];
    tokens.forEach((tok, i) => {
      setTimeout(() => {
        const swaraSemi = SWARA_SEMITONE[tok] ?? 0;
        const freq = freqForSemitone(baseOctaveShift + rootSemi + swaraSemi);
        playSineTone(freq, (tempoMs / 1000) * 0.9);
      }, i * tempoMs);
    });
  };

  const groupsUI = [
    { id: "S",  tokens: ["S"] },
    { id: "R",  tokens: ["R1", "R2", "R3"] },
    { id: "G",  tokens: ["G1", "G2", "G3"] },
    { id: "M",  tokens: ["M1", "M2"] },
    { id: "P",  tokens: ["P"] },
    { id: "D",  tokens: ["D1", "D2", "D3"] },
    { id: "N",  tokens: ["N1", "N2", "N3"] },
    { id: "S'", tokens: ["S'"] },
  ];

  const selCount = [selected.R, selected.G, selected.M, selected.D, selected.N].filter(Boolean).length;
  const allSelected = selCount === 5;

  const chakraInfo = matched
    ? {
        name: CHAKRA_NAMES[Math.ceil(matched.Number / 6) - 1],
        madhyama: matched.Number <= 36 ? "M1 · Shuddha Madhyamam" : "M2 · Prati Madhyamam",
      }
    : null;

  return (
    <div className="mk-root" data-theme={dark ? "dark" : "light"}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="mk-inner">

        {/* ── Header ── */}
        <header className="mk-header">
          <button
            className="mk-theme-btn"
            onClick={() => setDark((d) => !d)}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <h1 className="mk-title">
            <span className="mk-ornament">✦ </span>
            Melakarta Converter
            <span className="mk-ornament"> ✦</span>
          </h1>
          <p className="mk-subtitle">72 Parent Scales of Carnatic Music</p>
        </header>

        {/* ── Step Indicator ── */}
        <div className="mk-steps">
          <div className="mk-step-node">
            <div className={`mk-step-circle ${step === 1 ? "active" : "done"}`}>
              {step > 1 ? "✓" : "1"}
            </div>
            <span className={`mk-step-label ${step === 1 ? "active" : "done"}`}>Key</span>
          </div>
          <div className={`mk-step-line ${step > 1 ? "done" : ""}`} />
          <div className="mk-step-node">
            <div className={`mk-step-circle ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
              {step > 2 ? "✓" : "2"}
            </div>
            <span className={`mk-step-label ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
              Swaras
            </span>
          </div>
          <div className={`mk-step-line ${step > 2 ? "done" : ""}`} />
          <div className="mk-step-node">
            <div className={`mk-step-circle ${step === 3 ? "active" : ""}`}>3</div>
            <span className={`mk-step-label ${step === 3 ? "active" : ""}`}>Raga</span>
          </div>
        </div>

        {/* ── Step 1: Key Selection ── */}
        {step === 1 && (
          <div className="mk-card mk-fade">
            <div className="mk-section-label">Select your Tonic — Sa (षड्ज)</div>
            <div className="mk-key-grid">
              {KEY_OPTIONS.map((k) => (
                <button
                  key={k}
                  onClick={() => { playSineTone(freqForSemitone(12 + KEY_TO_SEMITONE[k]), 0.6); setKey(k); setStep(2); }}
                  className={`mk-key-btn${k === key ? " selected" : ""}`}
                >
                  {k}
                </button>
              ))}
            </div>
            <p className="mk-key-hint">
              Tap a key to set Sa and proceed to swara selection.
            </p>
          </div>
        )}

        {/* ── Step 2: Swara Selection ── */}
        {step === 2 && (
          <div className="mk-card mk-fade">
            {/* Top bar */}
            <div className="mk-key-bar">
              <span className="mk-key-badge">🎵 Sa = {key}</span>
              <div className="mk-progress">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`mk-progress-dot${i < selCount ? " filled" : ""}`}
                  />
                ))}
                <span style={{ marginLeft: 2 }}>{selCount} / 5</span>
              </div>
            </div>

            {/* Swara rows */}
            <div className="mk-swara-rows">
              {groupsUI.map((grp) => (
                <div key={grp.id} className="mk-swara-row">
                  <div className="mk-swara-row-label">
                    <div className="mk-swara-row-label-main">{grp.id}</div>
                    <div className="mk-swara-row-label-sub">
                      {SWARA_LABELS[grp.id] ?? ""}
                    </div>
                  </div>
                  <div className="mk-swara-btn-group">
                    {grp.tokens.map((tok) => {
                      const info = spelledNoteForSwara(key, tok);
                      const isSelected =
                        selected[grp.id as keyof typeof selected] === tok;
                      const reserved = reservedSemitones.has(info.semitone);
                      const isFixed = tok === "S" || tok === "P";
                      const disabled = reserved && !isSelected && !isFixed;
                      let cls = "mk-swara-btn";
                      if (isFixed) cls += " fixed";
                      else if (isSelected) cls += " selected";
                      else if (disabled) cls += " disabled";
                      return (
                        <button
                          key={tok}
                          onClick={() =>
                            toggleSelect(
                              grp.id as keyof typeof selected,
                              tok
                            )
                          }
                          className={cls}
                        >
                          <div className="mk-swara-name">{tok}</div>
                          <div className="mk-swara-note">{info.spelled}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div
              className="mk-btn-row"
              style={{
                marginTop: 20,
                paddingTop: 18,
                borderTop: "1px solid var(--border)",
              }}
            >
              <button className="mk-btn mk-btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="mk-btn mk-btn-primary"
                disabled={!allSelected}
                onClick={() => { if (allSelected) setStep(3); }}
              >
                Identify Raga →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Result (matched) ── */}
        {step === 3 && matched && (
          <div className="mk-card mk-fade">
            {/* Identity */}
            <div className="mk-result-top">
              <div className="mk-raga-num">#{matched.Number}</div>
              <div className="mk-raga-meta">
                {chakraInfo && (
                  <span className="mk-chakra-badge">
                    {chakraInfo.name} Chakra
                  </span>
                )}
                <h2 className="mk-raga-name">{matched.Name}</h2>
                {chakraInfo && (
                  <span className="mk-madhyama-tag">
                    <span className="mk-ornament">♩</span>
                    {chakraInfo.madhyama} · Key: {key}
                  </span>
                )}
              </div>
            </div>

            <div className="mk-divider" />

            {/* Scale display */}
            <SwaraSeq
              tokens={matched.Arohanam ?? []}
              label="Arohanam — Ascending ↑"
              keyName={key}
            />
            <SwaraSeq
              tokens={matched.Avarohanam ?? []}
              label="Avarohanam — Descending ↓"
              keyName={key}
            />

            {/* Play buttons */}
            <div
              className="mk-btn-row"
              style={{
                paddingBottom: 20,
                marginBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <button
                className="mk-btn mk-btn-play-aro"
                onClick={() => playSequence(matched.Arohanam ?? [])}
              >
                ▶ Play Arohanam
              </button>
              <button
                className="mk-btn mk-btn-play-ava"
                onClick={() => playSequence(matched.Avarohanam ?? [])}
              >
                ▼ Play Avarohanam
              </button>
            </div>

            {/* Navigation */}
            <div className="mk-btn-row">
              <button className="mk-btn mk-btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="mk-btn mk-btn-secondary"
                onClick={() => {
                  setStep(1);
                  setSelected({ R: null, G: null, M: null, D: null, N: null });
                }}
              >
                ↺ New Search
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: No match ── */}
        {step === 3 && !matched && (
          <div className="mk-card mk-fade">
            <div className="mk-no-match">
              <div className="mk-no-match-icon">𝄞</div>
              <p style={{ fontWeight: 600, marginBottom: 8, color: "var(--text-1)" }}>
                No matching Melakarta found
              </p>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>
                This swara combination doesn't correspond to a standard Melakarta raga.
              </p>
              <button className="mk-btn mk-btn-secondary" onClick={() => setStep(2)}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <p className="mk-footer">
          <span className="mk-ornament">✦</span>
          &nbsp;Carnatic Classical Music · 72 Melakarta System&nbsp;
          <span className="mk-ornament">✦</span>
        </p>

      </div>
    </div>
  );
}
