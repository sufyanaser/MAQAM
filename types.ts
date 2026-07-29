export type NoteName = "C" | "C#" | "D" | "Eb" | "E" | "F" | "F#" | "G" | "Ab" | "A" | "Bb" | "B";

export interface MaqamDef {
  name: string;
  intervals: number[]; // In tones (e.g., 1, 0.75, 0.5)
  description: string;
}

export interface ScaleNote {
  degree: number;
  pitch: number; // Semitones from root (can be float for quarter tones)
  intervalFromPrev: string;
  name: string;
  isQuarterTone: boolean;
  midiIndex: number; // 0-11 relative to C
}

export interface PlaylistData {
  maqam: string;
  songs: string[];
}