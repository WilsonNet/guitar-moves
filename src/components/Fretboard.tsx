import {
  STANDARD_TUNING,
  STRING_LABELS,
  getNoteAtFret,
  getInterval,
  getIntervalInfo,
  FRET_MARKERS,
  DOUBLE_MARKERS,
  displayNote,
  displayShort,
  type Note,
} from '@/lib/music';

// ── Layout constants ──────────────────────────────────────────────────────────
const PAD_TOP    = 44;
const PAD_LEFT   = 70;
const PAD_RIGHT  = 20;
const PAD_BOTTOM = 40;
const OPEN_W     = 62;
const FRET_W     = 70;
const STR_H      = 54;
const NUM_STRINGS = 6;
const NUM_FRETS   = 12;

const NUT_X = PAD_LEFT + OPEN_W;
const SVG_W = NUT_X + NUM_FRETS * FRET_W + PAD_RIGHT;
const SVG_H = PAD_TOP + (NUM_STRINGS - 1) * STR_H + PAD_BOTTOM;

const STRING_WEIGHTS: readonly [number, number, number, number, number, number] = [
  0.7, 0.9, 1.1, 1.6, 2.0, 2.5,
];

const PLAIN_STRING_COLOR = 'oklch(0.82 0.008 240)';
const WOUND_STRING_COLOR = 'oklch(0.74 0.065 72)';
const FRETBOARD_BG       = 'oklch(0.09 0.025 258)';
const OPEN_BG            = 'oklch(0.07 0.022 258)';
const FRET_LINE_COLOR    = 'oklch(0.27 0.018 258)';
const NUT_COLOR          = 'oklch(0.78 0.025 60)';
const MARKER_COLOR       = 'oklch(0.17 0.018 258)';
const LABEL_COLOR        = 'oklch(0.38 0.018 258)';

const FONT_DISPLAY = "'Josefin Sans', system-ui, sans-serif";
const FONT_LABEL   = "'Jost', system-ui, sans-serif";

const FILL_TRANSITION = 'fill 0.22s cubic-bezier(0.25, 1, 0.5, 1)';

function fretCenterX(fret: number): number {
  return fret === 0
    ? PAD_LEFT + OPEN_W * 0.5
    : NUT_X + (fret - 0.5) * FRET_W;
}

function stringY(s: number): number {
  return PAD_TOP + s * STR_H;
}

export interface FretboardProps {
  readonly root: Note;
  readonly display?: 'interval' | 'note';
}

export function Fretboard({ root, display = 'interval' }: FretboardProps): React.ReactElement {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 8 }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block', minWidth: 520 }}
        role="img"
        aria-label={`Guitar fretboard — ${display === 'interval' ? 'intervals' : 'note names'} from ${root}`}
      >
        {/* Fretboard background */}
        <rect x={0} y={0} width={SVG_W} height={SVG_H} fill={FRETBOARD_BG} rx={8} />

        {/* Open-string column shading */}
        <rect
          x={PAD_LEFT}
          y={PAD_TOP - 14}
          width={OPEN_W}
          height={(NUM_STRINGS - 1) * STR_H + 28}
          fill={OPEN_BG}
          rx={3}
        />

        {/* String lines — plain (silver) vs wound (bronze) */}
        {STANDARD_TUNING.map((_, s) => (
          <line
            key={s}
            x1={PAD_LEFT}
            y1={stringY(s)}
            x2={SVG_W - PAD_RIGHT}
            y2={stringY(s)}
            stroke={s < 3 ? PLAIN_STRING_COLOR : WOUND_STRING_COLOR}
            strokeWidth={STRING_WEIGHTS[s] ?? 1}
          />
        ))}

        {/* Fret lines */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((fret) => (
          <line
            key={fret}
            x1={NUT_X + fret * FRET_W}
            y1={PAD_TOP - 14}
            x2={NUT_X + fret * FRET_W}
            y2={PAD_TOP + (NUM_STRINGS - 1) * STR_H + 14}
            stroke={FRET_LINE_COLOR}
            strokeWidth={1}
          />
        ))}

        {/* Nut */}
        <rect
          x={NUT_X - 3}
          y={PAD_TOP - 14}
          width={6}
          height={(NUM_STRINGS - 1) * STR_H + 28}
          fill={NUT_COLOR}
          rx={1}
        />

        {/* Fret inlay markers */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((fret) => {
          const cx = NUT_X + (fret - 0.5) * FRET_W;
          const cy = PAD_TOP + (NUM_STRINGS - 1) * STR_H + 22;
          if (DOUBLE_MARKERS.has(fret)) {
            return (
              <g key={fret}>
                <circle cx={cx - 7} cy={cy} r={3.5} fill={MARKER_COLOR} />
                <circle cx={cx + 7} cy={cy} r={3.5} fill={MARKER_COLOR} />
              </g>
            );
          }
          if (FRET_MARKERS.has(fret)) {
            return <circle key={fret} cx={cx} cy={cy} r={3.5} fill={MARKER_COLOR} />;
          }
          return null;
        })}

        {/* Fret number labels */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((fret) => (
          <text
            key={fret}
            x={NUT_X + (fret - 0.5) * FRET_W}
            y={PAD_TOP - 16}
            textAnchor="middle"
            fontSize={16}
            fill={LABEL_COLOR}
            fontFamily={FONT_LABEL}
          >
            {fret}
          </text>
        ))}

        {/* "open" column label */}
        <text
          x={PAD_LEFT + OPEN_W * 0.5}
          y={PAD_TOP - 16}
          textAnchor="middle"
          fontSize={16}
          fill={LABEL_COLOR}
          fontFamily={FONT_LABEL}
          letterSpacing={0.5}
        >
          open
        </text>

        {/* String labels */}
        {STRING_LABELS.map((label, s) => (
          <text
            key={s}
            x={PAD_LEFT - 7}
            y={stringY(s) + 4}
            textAnchor="end"
            fontSize={16}
            fill={LABEL_COLOR}
            fontFamily={FONT_LABEL}
          >
            {label}
          </text>
        ))}

        {/* Note circles */}
        {STANDARD_TUNING.map((openNote, s) =>
          Array.from({ length: NUM_FRETS + 1 }, (_, fret) => {
            const note     = getNoteAtFret(openNote, fret);
            const interval = getInterval(root, note);
            const info     = getIntervalInfo(interval);
            const isRoot   = interval === 0;
            const r        = 16;
            const cx       = fretCenterX(fret);
            const cy       = stringY(s);
            const label    = display === 'interval'
              ? displayShort(info.short)
              : displayNote(note);

            return (
              <g
                key={`${s}-${fret}`}
                role="graphics-symbol"
                aria-label={`${displayNote(note)} — ${info.name}`}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  style={{
                    fill: info.color,
                    stroke: isRoot ? 'oklch(0.92 0.010 258)' : 'none',
                    strokeWidth: isRoot ? 1.5 : 0,
                    transition: FILL_TRANSITION,
                  } as React.CSSProperties}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fontWeight="700"
                  fill="oklch(0.96 0.008 258)"
                  fontFamily={FONT_DISPLAY}
                  style={{ userSelect: 'none', pointerEvents: 'none' } as React.CSSProperties}
                >
                  {label}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
