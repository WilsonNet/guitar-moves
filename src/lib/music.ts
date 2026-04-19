export const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export type Note = (typeof NOTES)[number];

/** Semitone distance from root: 0 (unison) … 11 (major 7th) */
export type IntervalSemitone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface IntervalInfo {
  readonly name: string;
  readonly short: string;
  readonly color: string;
}

/** OKLCH interval colors — perceptually distinct, dark-background optimised */
export const INTERVAL_INFO = [
  { name: 'Root',         short: 'R',  color: 'oklch(0.56 0.22 27)'  },
  { name: 'Minor 2nd',    short: 'b2', color: 'oklch(0.56 0.18 38)'  },
  { name: 'Major 2nd',    short: '2',  color: 'oklch(0.52 0.18 72)'  },
  { name: 'Minor 3rd',    short: 'b3', color: 'oklch(0.55 0.18 145)' },
  { name: 'Major 3rd',    short: '3',  color: 'oklch(0.57 0.15 170)' },
  { name: 'Perfect 4th',  short: '4',  color: 'oklch(0.58 0.13 202)' },
  { name: 'Tritone',      short: 'b5', color: 'oklch(0.50 0.20 290)' },
  { name: 'Perfect 5th',  short: '5',  color: 'oklch(0.52 0.17 245)' },
  { name: 'Minor 6th',    short: 'b6', color: 'oklch(0.50 0.18 268)' },
  { name: 'Major 6th',    short: '6',  color: 'oklch(0.50 0.20 308)' },
  { name: 'Minor 7th',    short: 'b7', color: 'oklch(0.54 0.20 338)' },
  { name: 'Major 7th',    short: '7',  color: 'oklch(0.50 0.22 18)'  },
] as const satisfies readonly IntervalInfo[];

/** Standard tuning: index 0 = string 1 (high e), index 5 = string 6 (low E) */
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'] as const satisfies readonly Note[];

export const STRING_LABELS = [
  '1 (e)', '2 (B)', '3 (G)', '4 (D)', '5 (A)', '6 (E)',
] as const;

/** Frets with a single inlay dot */
export const FRET_MARKERS = new Set<number>([3, 5, 7, 9]);
/** Frets with a double inlay dot */
export const DOUBLE_MARKERS = new Set<number>([12]);

const NOTE_TO_INDEX = new Map<Note, number>(NOTES.map((n, i) => [n, i]));

export function noteIndex(note: Note): number {
  return NOTE_TO_INDEX.get(note) ?? 0;
}

export function getNoteAtFret(openNote: Note, fret: number): Note {
  const idx = (noteIndex(openNote) + fret) % 12;
  const note = NOTES[idx];
  if (note === undefined) throw new Error(`Invalid note index: ${idx}`);
  return note;
}

export function getInterval(root: Note, note: Note): IntervalSemitone {
  return ((noteIndex(note) - noteIndex(root) + 12) % 12) as IntervalSemitone;
}

export function getIntervalInfo(semitone: IntervalSemitone): IntervalInfo {
  const info = INTERVAL_INFO[semitone];
  if (info === undefined) throw new Error(`Missing interval info for semitone: ${semitone}`);
  return info;
}

/** Replace ASCII # with musical ♯ for display */
export function displayNote(note: Note): string {
  return note.replace('#', '♯');
}

/** Replace ASCII b prefix with musical ♭ for display */
export function displayShort(short: string): string {
  return short.startsWith('b') ? '♭' + short.slice(1) : short;
}
