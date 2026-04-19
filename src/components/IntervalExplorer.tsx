import { useState } from 'react';
import { Fretboard } from './Fretboard';
import { NOTES, INTERVAL_INFO, displayNote, displayShort, type Note } from '@/lib/music';

const FONT_DISPLAY = "'Josefin Sans', system-ui, sans-serif";
const FONT_BODY    = "'Jost', system-ui, sans-serif";

const C = {
  border:      'oklch(0.22 0.018 258)',
  borderHover: 'oklch(0.38 0.018 258)',
  text:        'oklch(0.85 0.015 258)',
  textMuted:   'oklch(0.52 0.018 258)',
  textDim:     'oklch(0.38 0.018 258)',
  accent:      'oklch(0.56 0.14 242)',
  accentText:  'oklch(0.92 0.012 258)',
  toggleBg:    'oklch(0.15 0.020 258)',
} as const;

const sectionLabel: React.CSSProperties = {
  fontFamily:    FONT_DISPLAY,
  fontSize:      '0.625rem',
  fontWeight:    400,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color:         C.textDim,
};

function SectionDivider({ label }: { readonly label: string }): React.ReactElement {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={sectionLabel}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

export interface IntervalExplorerProps {
  /** Show the interval/note-name toggle. Default false. */
  readonly showToggle?: boolean;
  /** Which label to show inside fretboard circles. Default 'interval'. */
  readonly defaultDisplay?: 'interval' | 'note';
}

export function IntervalExplorer({
  showToggle = false,
  defaultDisplay = 'interval',
}: IntervalExplorerProps): React.ReactElement {
  const [root, setRoot]       = useState<Note>('C');
  const [display, setDisplay] = useState<'interval' | 'note'>(defaultDisplay);

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.text }}>

      {/* ── Root note selector ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <SectionDivider label="Root" />
        <div
          role="group"
          aria-label="Select root note"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}
        >
          {NOTES.map((note) => {
            const isActive = note === root;
            return (
              <button
                key={note}
                onClick={() => { setRoot(note); }}
                aria-pressed={isActive}
                aria-label={`Root: ${displayNote(note)}`}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  height:          34,
                  minWidth:        38,
                  padding:         '0 10px',
                  border:         `1px solid ${isActive ? C.accent : C.border}`,
                  borderRadius:    2,
                  background:      isActive ? C.accent : 'transparent',
                  color:           isActive ? C.accentText : C.textMuted,
                  cursor:          'pointer',
                  fontFamily:      FONT_DISPLAY,
                  fontSize:        '0.78rem',
                  fontWeight:      isActive ? 600 : 300,
                  letterSpacing:   '0.06em',
                  transition:      'all 0.14s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {displayNote(note)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Display toggle (optional) ─────────────────────────────────────── */}
      {showToggle && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ ...sectionLabel, marginBottom: 0 }}>Show</span>
          {(['interval', 'note'] as const).map((mode) => {
            const isActive = display === mode;
            return (
              <button
                key={mode}
                onClick={() => { setDisplay(mode); }}
                aria-pressed={isActive}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  height:          28,
                  padding:         '0 12px',
                  border:         `1px solid ${isActive ? C.accent : C.border}`,
                  borderRadius:    2,
                  background:      isActive ? C.accent : C.toggleBg,
                  color:           isActive ? C.accentText : C.textMuted,
                  cursor:          'pointer',
                  fontFamily:      FONT_DISPLAY,
                  fontSize:        '0.7rem',
                  fontWeight:      isActive ? 600 : 300,
                  letterSpacing:   '0.10em',
                  textTransform:   'uppercase',
                  transition:      'all 0.14s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {mode === 'interval' ? 'Intervals' : 'Note names'}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Fretboard ────────────────────────────────────────────────────── */}
      <div
        key={`${root}-${display}`}
        className="fretboard-reveal"
        style={{ marginBottom: 28 }}
      >
        <Fretboard root={root} display={display} />
      </div>

      {/* ── Interval legend ──────────────────────────────────────────────── */}
      <div>
        <SectionDivider label="Intervals" />
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '2px 40px',
          }}
        >
          {INTERVAL_INFO.map((info, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 0' }}
            >
              <svg width={10} height={10} aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx={5} cy={5} r={5} fill={info.color} />
              </svg>
              <span
                style={{
                  fontFamily:         FONT_DISPLAY,
                  fontSize:           '0.8rem',
                  fontWeight:         600,
                  letterSpacing:      '0.04em',
                  color:              C.text,
                  minWidth:           '2.4ch',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {displayShort(info.short)}
              </span>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize:   '0.8125rem',
                  fontWeight: 300,
                  color:      C.textMuted,
                }}
              >
                {info.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
