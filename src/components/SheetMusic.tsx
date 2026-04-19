import { useEffect, useRef } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';

export interface SheetMusicProps {
  /** ABC notation string to render */
  abc: string;
  /** Optional title override */
  title?: string;
  /** Show guitar tablature staff below standard notation */
  showTablature?: boolean;
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
  abc,
  title,
  showTablature = true,
  width = 800,
  theme = 'dark',
}: SheetMusicProps): React.ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  const colors = THEME_COLORS[theme];

  useEffect(() => {
    if (!divRef.current) return;

    // Clear previous render
    divRef.current.innerHTML = '';

    // Prepare ABC with tablature if requested
    let processedAbc = abc;
    if (showTablature && !abc.includes('%%tablature')) {
      // Add guitar tablature directive for standard tuning
      processedAbc = `%%tablature {E2,A2,D3,G3,B3,e4}\n${abc}`;
    }

    // Render the notation
    abcjs.renderAbc(divRef.current, processedAbc, {
      staffwidth: width - 40,
      paddingtop: 15,
      paddingbottom: 15,
      paddingleft: 15,
      paddingright: 15,
      responsive: 'resize',
      scale: 1.2,
      add_classes: true,
      jazzchords: true,
      ...(showTablature && {
        tablature: [
          {
            instrument: 'guitar',
            label: 'Guitar',
            tuning: ['E,', 'A,', 'D', 'G', 'B', 'e'],
          },
        ],
      }),
    });

    // Apply theme colors to SVG
    const svg = divRef.current.querySelector('svg');
    if (svg) {
      svg.style.color = colors.staff;
    }
  }, [abc, showTablature, width, colors.staff]);

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
        }}
      />
    </div>
  );
}
