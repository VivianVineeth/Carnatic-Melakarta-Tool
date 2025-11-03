import React, { useMemo, useState } from "react";

/* ------------------------- Configuration ------------------------- */

/* Key options (display with musical symbols) */
const KEY_OPTIONS = [
  "C",
  "C♯",
  "D",
  "E♭",
  "E",
  "F",
  "F♯",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
] as const;
type KeyName = typeof KEY_OPTIONS[number];

/* map display key -> semitone relative to C=0 */
const KEY_TO_SEMITONE: Record<KeyName, number> = {
  C: 0,
  "C♯": 1,
  D: 2,
  "E♭": 3,
  E: 4,
  F: 5,
  "F♯": 6,
  G: 7,
  "A♭": 8,
  A: 9,
  "B♭": 10,
  B: 11,
};

/* diatonic letter base semitones (relative to C) */
const LETTER_BASE: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/* swara -> semitone offsets from Sa */
const SWARA_SEMITONE: Record<string, number> = {
  S: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  G1: 2,
  G2: 3,
  G3: 4,
  M1: 5,
  M2: 6,
  P: 7,
  D1: 8,
  D2: 9,
  D3: 10,
  N1: 9,
  N2: 10,
  N3: 11,
  "S'": 12,
};

/* display interval names */
const SWARA_INTERVAL_NAME: Record<string, string> = {
  R1: "Minor 2nd",
  R2: "Major 2nd",
  R3: "Augmented 2nd",
  G1: "Diminished 3rd",
  G2: "Minor 3rd",
  G3: "Major 3rd",
  M1: "Perfect 4th",
  M2: "Augmented 4th",
  P: "Perfect 5th",
  D1: "Minor 6th",
  D2: "Major 6th",
  D3: "Augmented 6th",
  N1: "Diminished 7th",
  N2: "Minor 7th",
  N3: "Major 7th",
};

/* SWARA sets for UI */
const SWARA_GROUPS = {
  R: ["R1", "R2", "R3"],
  G: ["G1", "G2", "G3"],
  M: ["M1", "M2"],
  D: ["D1", "D2", "D3"],
  N: ["N1", "N2", "N3"],
};

/* letter offsets for diatonic spelling relative to root letter:
   S->0, R->1 (2nd), G->2 (3rd), M->3 (4th), P->4 (5th), D->5 (6th), N->6 (7th), S'->7 */
const SWARA_TO_LETTER_OFFSET: Record<string, number> = {
  S: 0,
  R: 1,
  G: 2,
  M: 3,
  P: 4,
  D: 5,
  N: 6,
  "S'": 7,
};

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

/* Full melakarta names 1..72 */
const MELAKARTA_NAMES: Record<number, string> = {
  1: "Kanakangi",
  2: "Ratnangi",
  3: "Ganamurti",
  4: "Vanaspati",
  5: "Manavati",
  6: "Tanarupi",
  7: "Senavati",
  8: "Hanumatodi",
  9: "Dhenuka",
  10: "Natakapriya",
  11: "Kokilapriya",
  12: "Rupavati",
  13: "Gayakapriya",
  14: "Vakulabharanam",
  15: "Mayamalavagowla",
  16: "Chakravakam",
  17: "Suryakantam",
  18: "Hatakambari",
  19: "Jhankaradhwani",
  20: "Natabhairavi",
  21: "Keeravani",
  22: "Kharaharapriya",
  23: "Gourimanohari",
  24: "Varunapriya",
  25: "Mararanjani",
  26: "Charukesi",
  27: "Sarasangi",
  28: "Harikambhoji",
  29: "Dheerasankarabharanam",
  30: "Naganandini",
  31: "Yagapriya",
  32: "Ragavardhini",
  33: "Gangeyabhushani",
  34: "Vagadheeswari",
  35: "Shoolini",
  36: "Chalanata",
  37: "Salagam",
  38: "Jalarnavam",
  39: "Jhalavarali",
  40: "Navaneetam",
  41: "Pavani",
  42: "Raghupriya",
  43: "Gavambodhi",
  44: "Bhavapriya",
  45: "Shubhapantuvarali",
  46: "Shadvidhamargini",
  47: "Suvarnangi",
  48: "Divyamani",
  49: "Dhavalambari",
  50: "Namanarayani",
  51: "Kamavardhini",
  52: "Ramapriya",
  53: "Gamanashrama",
  54: "Vishwambari",
  55: "Shamalangi",
  56: "Shanmukhapriya",
  57: "Simhendramadhyamam",
  58: "Hemavati",
  59: "Dharmavati",
  60: "Neetimati",
  61: "Kantamani",
  62: "Rishabhapriya",
  63: "Latangi",
  64: "Vachaspati",
  65: "Mechakalyani",
  66: "Chitrambari",
  67: "Sucharitra",
  68: "Jyotiswarupini",
  69: "Dhatuvardhini",
  70: "Nasikabhushani",
  71: "Kosalam",
  72: "Rasikapriya",
};

/* ------------------------- Helpers: spelling & audio ------------------------- */

/* map a root letter index + offset to letter (C D E F G A B) */
function getLetterForOffset(rootLetterIndex: number, offset: number) {
  return LETTERS[(rootLetterIndex + offset) % 7];
}

/* normalize diff to -6..+6 so we can express accidentals as few symbols */
function normalizeSigned12(diff: number) {
  let d = ((diff % 12) + 12) % 12;
  if (d > 6) d -= 12;
  return d;
}

/* accidental string from signed difference */
function accidentalFromDiff(diff: number) {
  if (diff === 0) return "";
  if (diff > 0) return "♯".repeat(diff);
  return "♭".repeat(-diff);
}

/* Given key (KeyName) and a swara token ('R2','G1', etc),
   return spelled note and absolute semitone (0..11 relative to C).
   Uses diatonic-letter spelling rules so double flats/sharps are preserved.
*/
function spelledNoteForSwara(key: KeyName, swara: string) {
  const rootSemitone = KEY_TO_SEMITONE[key]; // 0..11 relative to C
  const rootLetter = key[0]; // first char is letter (works for 'E♭' etc)
  const rootLetterIndex = LETTERS.indexOf(rootLetter);
  const letterKey = swara[0] === "S" ? "S" : swara[0]; // 'R','G','M','D','N','S'
  const offset = SWARA_TO_LETTER_OFFSET[letterKey] ?? 0;
  const targetLetter = getLetterForOffset(rootLetterIndex, offset);
  const naturalLetterSemitone = LETTER_BASE[targetLetter];

  const desiredAbsolute =
    ((rootSemitone + (SWARA_SEMITONE[swara] ?? 0)) % 12 + 12) % 12;

  const rawDiff = desiredAbsolute - naturalLetterSemitone;
  const signedDiff = normalizeSigned12(rawDiff);
  const accidental = accidentalFromDiff(signedDiff);
  const spelled = `${targetLetter}${accidental}`;
  return { spelled, semitone: desiredAbsolute };
}

/* Frequency: C4 = 261.63 for semitone 0 (C). Returns Hz for absolute semitone (0..11). */
const C4 = 261.63;
function freqForSemitone(semi: number) {
  return C4 * Math.pow(2, semi / 12);
}

/* play frequency for short duration (sine) */
function playFrequency(freq: number, duration = 0.45) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.02);
  o.start();
  o.stop(ctx.currentTime + duration + 0.05);
}

/* ------------------------- Melakarta generation / find ------------------------- */

/* generate 72 melakarta objects with aro/ava as swara tokens */
function generateMelakartas() {
  const melas: {
    id: number;
    name?: string;
    r: string;
    g: string;
    m: string;
    d: string;
    n: string;
    aro: string[];
    ava: string[];
  }[] = [];
  let count = 1;
  const R = ["R1", "R2", "R3"];
  const G = ["G1", "G2", "G3"];
  const M = ["M1", "M2"];
  const D = ["D1", "D2", "D3"];
  const N = ["N1", "N2", "N3"];
  for (let m of M) {
    for (let r of R) {
      for (let g of G) {
        if (parseInt(r[1]) >= parseInt(g[1])) continue;
        for (let d of D) {
          for (let n of N) {
            if (parseInt(d[1]) >= parseInt(n[1])) continue;
            const aro = ["S", r, g, m, "P", d, n, "S'"];
            const ava = ["S'", n, d, "P", m, g, r, "S"];
            melas.push({
              id: count,
              name: MELAKARTA_NAMES[count],
              r,
              g,
              m,
              d,
              n,
              aro,
              ava,
            });
            count++;
          }
        }
      }
    }
  }
  return melas;
}
const MELAKARTAS = generateMelakartas();

/* ------------------------- Component ------------------------- */

export default function CarnaticMelakartaTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [key, setKey] = useState<KeyName>("C");

  /* selections: store chosen variant tokens for R,G,M,D,N; S and P are implicit */
  const [selected, setSelected] = useState<{
    R?: string | null;
    G?: string | null;
    M?: string | null;
    D?: string | null;
    N?: string | null;
  }>({ R: null, G: null, M: null, D: null, N: null });

  /* build rows for step 2 display (S, R1..R3, G1..G3, M1.., P, D1.., N1.., S') */
  const rows = useMemo(() => {
    const tokens = ["S", ...SWARA_GROUPS.R, ...SWARA_GROUPS.G, ...SWARA_GROUPS.M, "P", ...SWARA_GROUPS.D, ...SWARA_GROUPS.N, "S'"];
    return tokens.map((t) => {
      const info = spelledNoteForSwara(key, t);
      const interval = t === "S" ? "Tonic" : t === "P" ? "Perfect 5th" : t === "S'" ? "Octave" : SWARA_INTERVAL_NAME[t] ?? "";
      return { swara: t, interval, spelled: info.spelled, semitone: info.semitone };
    });
  }, [key]);

  /* set of semitones currently reserved by selections (S and P included) */
  const reservedSemitones = useMemo(() => {
    const sSem = spelledNoteForSwara(key, "S").semitone;
    const pSem = spelledNoteForSwara(key, "P").semitone;
    const used: number[] = [sSem, pSem];
    (Object.keys(selected) as (keyof typeof selected)[]).forEach((k) => {
      const val = selected[k];
      if (val) {
        const sem = spelledNoteForSwara(key, val).semitone;
        if (!used.includes(sem)) used.push(sem);
      }
    });
    return used;
  }, [key, selected]);

  /* toggle a selection for swara group (R/G/M/D/N) */
  const toggleSelect = (group: keyof typeof selected, token: string) => {
    setSelected((prev) => {
      const current = prev[group];
      if (current === token) {
        // deselect
        return { ...prev, [group]: null };
      } else {
        return { ...prev, [group]: token };
      }
    });
    // play the swara pitch immediately
    const sem = spelledNoteForSwara(key, token).semitone;
    playFrequency(freqForSemitone(sem));
  };

  /* find matching melakarta given current selected variants (must match exact tokens) */
  const matchedMelakarta = useMemo(() => {
    if (!selected.R || !selected.G || !selected.M || !selected.D || !selected.N) return null;
    return MELAKARTAS.find(
      (m) => m.r === selected.R && m.g === selected.G && m.m === selected.M && m.d === selected.D && m.n === selected.N
    ) ?? null;
  }, [selected]);

  /* play an aro/ava token list at constant tempo (one note per 0.45s for example) */
  const playSequence = (tokens: string[]) => {
    const tempoMs = 450; // constant tempo
    // schedule each note using AudioContext
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let t = ctx.currentTime;
    tokens.forEach((tok) => {
      const semi = spelledNoteForSwara(key, tok).semitone;
      const freq = freqForSemitone(semi);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + tempoMs / 1000 - 0.02);
      o.start(t);
      o.stop(t + tempoMs / 1000 + 0.05);
      t += tempoMs / 1000;
    });
  };

  /* UI helpers */
  const allGroups = [
    { id: "R", tokens: SWARA_GROUPS.R },
    { id: "G", tokens: SWARA_GROUPS.G },
    { id: "M", tokens: SWARA_GROUPS.M },
    { id: "D", tokens: SWARA_GROUPS.D },
    { id: "N", tokens: SWARA_GROUPS.N },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Carnatic Melakarta Builder</h1>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="mb-3 font-medium">Step 1 — Select key</p>
          <div className="flex flex-wrap gap-2">
            {KEY_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setKey(k);
                  setStep(2);
                }}
                className={`px-3 py-1 rounded ${k === key ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-600">Selected key: <strong>{key}</strong></p>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 font-medium">Step 2 — Pick swara variants (S & P fixed)</p>
              <p className="text-sm text-gray-600">Click a swara to select it; selecting a swara disables any other swara that maps to the same pitch.</p>
            </div>
            <div>
              <button className="px-3 py-1 bg-gray-200 rounded mr-2" onClick={() => setStep(1)}>Change key</button>
              <button
                className={`px-3 py-1 rounded ${selected.R && selected.G && selected.M && selected.D && selected.N ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 cursor-not-allowed"}`}
                onClick={() => {
                  if (selected.R && selected.G && selected.M && selected.D && selected.N) setStep(3);
                }}
              >
                Next: Show Melakarta
              </button>
            </div>
          </div>

          {/* Table of swaras */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2">Swara</th>
                  <th className="px-3 py-2">Interval</th>
                  <th className="px-3 py-2">Spelling (click to select/play)</th>
                </tr>
              </thead>
              <tbody>
                {/* S row (fixed) */}
                {(() => {
                  const info = spelledNoteForSwara(key, "S");
                  return (
                    <tr key="S" className="border-t">
                      <td className="px-3 py-2 font-medium">S</td>
                      <td className="px-3 py-2">Tonic</td>
                      <td className="px-3 py-2">
                        <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => playFrequency(freqForSemitone(info.semitone))}>
                          {info.spelled} (fixed)
                        </button>
                      </td>
                    </tr>
                  );
                })()}

                {/* R/G/M/P/D/N rows grouped */}
                {allGroups.map((grp) => (
                  <React.Fragment key={grp.id}>
                    {/* group header row */}
                    <tr className="bg-gray-100">
                      <td className="px-3 py-2 font-semibold">{grp.id}</td>
                      <td className="px-3 py-2" />
                      <td className="px-3 py-2" />
                    </tr>

                    {/* tokens */}
                    {grp.tokens.map((tok) => {
                      const info = spelledNoteForSwara(key, tok);
                      const tokSem = info.semitone;
                      const isSelected = selected[grp.id as keyof typeof selected] === tok;
                      const reserved = reservedSemitones.includes(tokSem);
                      // Disabled if reserved and not the currently selected value for this group
                      const disabled = reserved && !isSelected;
                      return (
                        <tr key={tok} className="border-t">
                          <td className="px-3 py-2 font-medium">{tok}</td>
                          <td className="px-3 py-2 text-gray-600">{SWARA_INTERVAL_NAME[tok]}</td>
                          <td className="px-3 py-2">
                            <button
                              disabled={disabled}
                              onClick={() => toggleSelect(grp.id as keyof typeof selected, tok)}
                              className={`px-3 py-1 rounded text-sm ${disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                            >
                              {info.spelled} {disabled ? " (taken)" : ""}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* P row (fixed) */}
                {(() => {
                  const info = spelledNoteForSwara(key, "P");
                  return (
                    <tr key="P" className="border-t">
                      <td className="px-3 py-2 font-medium">P</td>
                      <td className="px-3 py-2">Perfect 5th</td>
                      <td className="px-3 py-2">
                        <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => playFrequency(freqForSemitone(info.semitone))}>
                          {info.spelled} (fixed)
                        </button>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {/* Summary of current selections */}
          <div className="mt-3">
            <p className="mb-1 font-medium">Current selections</p>
            <div className="flex gap-3 flex-wrap">
              <div className="px-3 py-1 bg-gray-50 rounded">S: {spelledNoteForSwara(key, "S").spelled}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">R: {selected.R ?? "—"}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">G: {selected.G ?? "—"}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">M: {selected.M ?? "—"}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">P: {spelledNoteForSwara(key, "P").spelled}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">D: {selected.D ?? "—"}</div>
              <div className="px-3 py-1 bg-gray-50 rounded">N: {selected.N ?? "—"}</div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">Step 3 — Matched Melakarta</p>
              <p className="text-sm text-gray-600">Key: {key}</p>
            </div>
            <div>
              <button className="px-3 py-1 bg-gray-200 rounded mr-2" onClick={() => setStep(2)}>Back</button>
            </div>
          </div>

          {matchedMelakarta ? (
            <div>
              <h2 className="text-xl font-bold mb-2">#{matchedMelakarta.id} — {matchedMelakarta.name ?? "Unnamed"}</h2>
              <p className="mb-2">Arohanam: {matchedMelakarta.aro.join(" - ")}</p>
              <p className="mb-4">Avarohanam: {matchedMelakarta.ava.join(" - ")}</p>
              <div className="flex gap-3">
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => playSequence(matchedMelakarta.aro)}>Play Arohanam</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => playSequence(matchedMelakarta.ava)}>Play Avarohanam</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-500 mb-3">No matching melakarta found. Make sure R,G,M,D,N are selected correctly.</p>
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setStep(2)}>Back</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
