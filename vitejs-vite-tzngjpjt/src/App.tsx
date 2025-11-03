import React, { useMemo, useState } from "react";
import { melakartaData } from "./melakartaData";

const KEY_OPTIONS = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"] as const;
type KeyName = typeof KEY_OPTIONS[number];

const KEY_TO_SEMITONE: Record<KeyName, number> = {
  C: 0, "C♯": 1, D: 2, "E♭": 3, E: 4, F: 5, "F♯": 6, G: 7,
  "A♭": 8, A: 9, "B♭": 10, B: 11,
};

const LETTER_BASE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
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
      try {
        osc.disconnect();
        gain.disconnect();
        ctx.close();
      } catch {}
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

export default function App(): JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [key, setKey] = useState<KeyName>("C");
  const [selected, setSelected] = useState<{
    R?: string | null; G?: string | null; M?: string | null; D?: string | null; N?: string | null;
  }>({ R: null, G: null, M: null, D: null, N: null });

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

  // ✅ Corrected raga-matching logic
  const matched = useMemo(() => {
    if (!selected.R || !selected.G || !selected.M || !selected.D || !selected.N) return null;

    const selectedPattern = ["S", selected.R, selected.G, selected.M, "P", selected.D, selected.N, "S'"];

    const match = melakartaData.find((raga) => {
      const aro = normalizeArr(raga.aro ?? raga.Arohanam ?? raga.arohanam ?? []);
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
        playSineTone(freq, tempoMs / 1000 * 0.9);
      }, i * tempoMs);
    });
  };

  const groupsUI = [
    { id: "S", tokens: ["S"] },
    { id: "R", tokens: ["R1", "R2", "R3"] },
    { id: "G", tokens: ["G1", "G2", "G3"] },
    { id: "M", tokens: ["M1", "M2"] },
    { id: "P", tokens: ["P"] },
    { id: "D", tokens: ["D1", "D2", "D3"] },
    { id: "N", tokens: ["N1", "N2", "N3"] },
    { id: "S'", tokens: ["S'"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4">Carnatic Melakarta Tool</h1>

        {step === 1 && (
          <div className="bg-white rounded shadow p-4">
            <p className="mb-2 font-medium">Step 1 — Select Key</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {KEY_OPTIONS.map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setKey(k);
                    setStep(2);
                  }}
                  className={`px-3 py-1 rounded ${
                    k === key ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded shadow p-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Step 2 — Pick swara variants (S & P fixed)</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setStep(1)}>← Back</button>
                <button
                  className={`px-3 py-1 rounded ${
                    selected.R && selected.G && selected.M && selected.D && selected.N
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  onClick={() => {
                    if (selected.R && selected.G && selected.M && selected.D && selected.N) setStep(3);
                  }}
                >
                  Next →
                </button>
              </div>
            </div>

            {groupsUI.map((grp) => (
              <div key={grp.id} className="flex flex-wrap gap-3 items-center">
                {grp.tokens.map((tok) => {
                  const info = spelledNoteForSwara(key, tok);
                  const isSelected = selected[grp.id as keyof typeof selected] === tok;
                  const reserved = reservedSemitones.has(info.semitone);
                  const isFixed = tok === "S" || tok === "P";
                  const disabled = reserved && !isSelected && !isFixed;
                  return (
                    <button
                      key={tok}
                      onClick={() => toggleSelect(grp.id as keyof typeof selected, tok)}
                      className={`px-3 py-2 rounded-md border text-sm ${
                        isFixed
                          ? "bg-gray-200 text-gray-400 cursor-pointer"
                          : isSelected
                          ? "bg-blue-600 text-white"
                          : disabled
                          ? "bg-gray-200 text-gray-400"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">{tok}</div>
                      <div className="text-xs text-gray-600 mt-1">{info.spelled}</div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {step === 3 && matched && (
          <div className="bg-white rounded shadow p-4 space-y-3">
            <h2 className="text-xl font-bold">
              #{matched.Number ?? matched.number} — {matched.Name ?? matched.name}
            </h2>

            <div>
              <p><strong>Arohanam:</strong> {(matched.aro ?? matched.Arohanam ?? matched.arohanam ?? []).join(" - ")}</p>
              <p><strong>Notes:</strong> {(matched.aro ?? matched.Arohanam ?? matched.arohanam ?? [])
                .map((s: string) => spelledNoteForSwara(key, s).spelled).join(" - ")}</p>
            </div>
            <div>
              <p><strong>Avarohanam:</strong> {(matched.ava ?? matched.Avarohanam ?? matched.avarohanam ?? []).join(" - ")}</p>
              <p><strong>Notes:</strong> {(matched.ava ?? matched.Avarohanam ?? matched.avarohanam ?? [])
                .map((s: string) => spelledNoteForSwara(key, s).spelled).join(" - ")}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => playSequence((matched.aro ?? matched.Arohanam ?? matched.arohanam) as string[])}>
                ▶ Play Arohanam
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={() => playSequence((matched.ava ?? matched.Avarohanam ?? matched.avarohanam) as string[])}>
                ▼ Play Avarohanam
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setStep(2)}>← Back</button>
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded"
                onClick={() => {
                  setStep(1);
                  setSelected({ R: null, G: null, M: null, D: null, N: null });
                }}
              >
                🔁 Pick a New Key
              </button>
            </div>
          </div>
        )}

        {step === 3 && !matched && (
          <div className="bg-white rounded shadow p-4 text-center">
            <p>No matching Melakarta found for this swara combination.</p>
            <button className="mt-3 px-3 py-1 bg-gray-300 rounded" onClick={() => setStep(2)}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
