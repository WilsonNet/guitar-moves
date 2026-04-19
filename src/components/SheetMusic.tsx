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
  /** Enable audio playback */
  enableAudio?: boolean;
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
  enableAudio = false,
  width = 800,
  theme = 'dark',
}: SheetMusicProps): React.ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<abcjs.SynthObjectController | null>(null);

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
    const visualObj = abcjs.renderAbc(divRef.current, processedAbc, {
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

    // Setup audio if enabled
    if (enableAudio && audioRef.current && visualObj[0]) {
      synthRef.current = new abcjs.synth.SynthObjectController();
      synthRef.current.load(visualObj[0], null, {
        soundFontUrl: 'https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/',
      });
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
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
      {enableAudio && (
        <div ref={audioRef} style={{ marginTop: '0.5rem' }}>
          <button
            onClick={() => synthRef.current?.play()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'oklch(0.56 0.14 242)',
              color: 'oklch(0.92 0.012 258)',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: "'Josefin Sans', system-ui, sans-serif",
              fontSize: '0.875rem',
              letterSpacing: '0.06em',
            }}
          >
            ▶ Play
          </button>
          <button
            onClick={() => synthRef.current?.stop()}
            style={{
              padding: '0.5rem 1rem',
              marginLeft: '0.5rem',
              backgroundColor: 'oklch(0.15 0.020 258)',
              color: 'oklch(0.85 0.015 258)',
              border: '1px solid oklch(0.22 0.018 258)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: "'Josefin Sans', system-ui, sans-serif",
              fontSize: '0.875rem',
              letterSpacing: '0.06em',
            }}
          >
            ⏹ Stop
          </button>
        </div>
      )}
    </div>
  );
}
