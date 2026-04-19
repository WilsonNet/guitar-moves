import { useEffect, useRef, useState } from 'react';
import { Factory, VexFlow } from 'vexflow';

export interface SheetMusicProps {
  /** EasyScore format string, e.g., "C#5/q, B4, A4, G#4" */
  notes: string;
  /** Optional title */
  title?: string;
  /** Time signature */
  timeSignature?: string;
  /** Responsive width - defaults to container width */
  width?: number;
  /** Visual theme: 'light' or 'dark' (defaults to match site) */
  theme?: 'light' | 'dark';
}

const THEME_COLORS = {
  light: {
    staff: '#000000',
    note: '#000000',
    background: '#ffffff',
  },
  dark: {
    staff: 'oklch(0.85 0.015 258)',
    note: 'oklch(0.85 0.015 258)',
    background: 'transparent',
  },
};

export function SheetMusic({
  notes,
  title,
  timeSignature = '4/4',
  width = 600,
  theme = 'dark',
}: SheetMusicProps): React.ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const colors = THEME_COLORS[theme];

  useEffect(() => {
    if (!divRef.current) return;

    // Clear previous render
    divRef.current.innerHTML = '';

    // Wait for fonts to be ready
    document.fonts.ready.then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady || !divRef.current) return;

    // Clear previous render
    divRef.current.innerHTML = '';

    try {
      // Set fonts
      VexFlow.setFonts('Bravura', 'Academico');

      // Create factory
      const vf = new Factory({
        renderer: {
          elementId: divRef.current,
          width,
          height: 200,
        },
      });

      const score = vf.EasyScore();
      const system = vf.System();

      // Add stave with notes
      system
        .addStave({
          voices: [score.voice(score.notes(notes, { stem: 'up' }))],
        })
        .addClef('treble')
        .addTimeSignature(timeSignature);

      // Draw everything
      vf.draw();

      // Apply dark theme colors to SVG if needed
      if (theme === 'dark' && divRef.current) {
        const svg = divRef.current.querySelector('svg');
        if (svg) {
          svg.style.color = colors.note;
          const elements = svg.querySelectorAll('path, text, line');
          elements.forEach((el) => {
            (el as SVGElement).style.stroke = colors.staff;
            (el as SVGElement).style.fill = colors.note;
          });
        }
      }
    } catch (error) {
      console.error('VexFlow rendering error:', error);
    }
  }, [notes, timeSignature, width, theme, colors.note, colors.staff, isReady]);

  return (
    <div
      style={{
        fontFamily: "'Jost', system-ui, sans-serif",
        marginBottom: '2rem',
      }}
    >
      {title && (
        <h3
          style={{
            fontFamily: "'Josefin Sans', system-ui, sans-serif",
            fontSize: '1.1rem',
            fontWeight: 400,
            color: 'oklch(0.85 0.015 258)',
            marginBottom: '0.75rem',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </h3>
      )}
      <div
        ref={divRef}
        style={{
          backgroundColor: colors.background,
          borderRadius: '4px',
          border: '1px solid oklch(0.22 0.018 258)',
          overflowX: 'auto',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!isReady && (
          <span style={{ color: colors.note, fontSize: '0.875rem' }}>
            Loading notation...
          </span>
        )}
      </div>
    </div>
  );
}
