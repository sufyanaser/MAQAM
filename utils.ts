import { MAQAMS, KEYS, KEY_LABELS } from './constants';
import { ScaleNote } from './types';

// Convert pitch (0-11) to Note Name (Arabic)
const getNoteName = (semitonesFromC: number): { name: string; isQuarterTone: boolean } => {
  const normalized = (semitonesFromC % 12 + 12) % 12; // Ensure 0-11.99 positive
  const index = Math.round(normalized);
  const isQuarterTone = Math.abs(normalized - index) > 0.1; // Check if it was roughly X.5

  // If it's a perfect semitone
  if (!isQuarterTone) {
    const rawKey = KEYS[index];
    const arabicName = KEY_LABELS[rawKey].split(' (')[0]; // Extract "دو" from "دو (C)"
    return { name: arabicName, isQuarterTone: false };
  }

  // If it's a quarter tone (Half-Flat)
  // We determine the name based on the NEXT natural note flattened by a quarter.
  // e.g., E Half Flat (Sikah) descends from E.
  const ceilingKeyIndex = Math.ceil(normalized) % 12;
  const rawKey = KEYS[ceilingKeyIndex];
  
  // Basic mapping of raw keys to simple Arabic letters for the base
  const baseMap: Record<string, string> = {
    "C": "دو", "C#": "دو", "D": "ري", "Eb": "مي", "E": "مي", "F": "فا", 
    "F#": "فا", "G": "صول", "Ab": "لا", "A": "لا", "Bb": "سي", "B": "سي"
  };
  
  const baseName = baseMap[rawKey] || rawKey;
  
  return { 
    name: `${baseName} نصف بيمول`, 
    isQuarterTone: true 
  };
};

export const calculateScale = (rootKeyIndex: number, maqamName: string): ScaleNote[] => {
  const maqam = MAQAMS[maqamName];
  if (!maqam) return [];

  const notes: ScaleNote[] = [];
  let currentPitch = rootKeyIndex; // Start at root (0-11 scale)
  
  // Add Root
  notes.push({
    degree: 1,
    pitch: currentPitch,
    intervalFromPrev: "الركوز", // Root
    ...getNoteName(currentPitch),
    midiIndex: currentPitch
  });

  maqam.intervals.forEach((intervalTones, idx) => {
    // intervalTones is in Whole Tones. 1 Tone = 2 Semitones.
    const semiToneJump = intervalTones * 2;
    currentPitch += semiToneJump;
    
    // Determine interval label
    let intervalLabel = "";
    if (intervalTones === 1) intervalLabel = "بُعد كامل"; // Whole Tone
    else if (intervalTones === 0.5) intervalLabel = "نصف بُعد"; // Half Tone
    else if (intervalTones === 0.75) intervalLabel = "ثلاثة أرباع"; // 3/4 Tone
    else if (intervalTones === 1.5) intervalLabel = "بُعد ونصف"; // 1.5 Tones
    else intervalLabel = `${intervalTones} بُعد`;

    const info = getNoteName(currentPitch);
    
    notes.push({
      degree: idx + 2,
      pitch: currentPitch,
      intervalFromPrev: intervalLabel,
      name: info.name,
      isQuarterTone: info.isQuarterTone,
      midiIndex: currentPitch
    });
  });

  return notes;
};

// Helper to determine active visual key for piano
export const getKeyStatus = (keyIndex: number, scaleNotes: ScaleNote[]) => {
  const keyPitch = keyIndex % 12;

  // 1. Check for Standard Matches (Exact semitones)
  const exactMatch = scaleNotes.find(n => {
    // Strictly skip quarter tones for standard matching to avoid ambiguity
    if (n.isQuarterTone) return false;
    
    // Round to nearest integer to handle floating point drift (e.g. 4.000001)
    const notePitch = Math.round(n.midiIndex) % 12;
    return notePitch === keyPitch;
  });

  if (exactMatch) return 'standard';

  // 2. Check for Quarter Tone matches (Half-Flat logic)
  const quarterMatch = scaleNotes.find(n => {
    if (!n.isQuarterTone) return false;

    // We map X.5 quarter tones to X+1 (the key they are flattened from).
    // e.g., E Half Flat (3.5) maps to E (4).
    const visualTarget = Math.ceil(n.midiIndex) % 12;
    
    // Match the target visual key
    return visualTarget === keyPitch;
  });

  if (quarterMatch) return 'quarter';

  return 'none';
};