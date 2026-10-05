import type { RefObject } from 'react'
import { cn } from '~/utils/cn'

export const TEMPOS = [
  { id: 'slow', label: 'Slow', blocksPerSecond: 4 },
  { id: 'normal', label: 'Normal', blocksPerSecond: 8 },
  { id: 'fast', label: 'Fast', blocksPerSecond: 16 },
] as const

export type Tempo = (typeof TEMPOS)[number]

interface Props {
  playing: boolean
  onPlayToggle: () => void
  soundOn: boolean
  /** False once the browser turned out unable to make sound */
  soundAvailable: boolean
  onSoundToggle: () => void
  tempo: Tempo
  onTempoChange: (tempo: Tempo) => void
  /** Filled in every frame by the player, so playback never re-renders */
  timeRef: RefObject<HTMLSpanElement | null>
  slotRef: RefObject<HTMLSpanElement | null>
  /** Its waves follow the sound, through a `--level` set every frame */
  speakerRef: RefObject<SVGSVGElement | null>
  time: string
  slot: string
  compact: boolean
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary'

/** The controls of the sequencer, and where in the day it is */
export function Transport({
  playing,
  onPlayToggle,
  soundOn,
  soundAvailable,
  onSoundToggle,
  tempo,
  onTempoChange,
  timeRef,
  slotRef,
  speakerRef,
  time,
  slot,
  compact,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      <button
        type="button"
        onClick={onPlayToggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-invert transition-transform duration-150 ease-out active:scale-[0.94]',
          FOCUS_RING,
        )}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        onClick={onSoundToggle}
        aria-pressed={soundOn}
        disabled={!soundAvailable}
        title={soundAvailable ? undefined : 'This browser cannot play sound'}
        className={cn(
          'flex h-9 shrink-0 items-center gap-1.5 rounded-full border pr-3.5 pl-3 font-bold text-label-value-14 transition-colors duration-150 disabled:opacity-50',
          soundOn
            ? 'border-transparent bg-surface-secondary text-primary'
            : 'border-divider text-secondary hover:text-primary',
          FOCUS_RING,
        )}
      >
        <SpeakerIcon on={soundOn} svgRef={speakerRef} />
        Sound
      </button>
      <div
        role="radiogroup"
        aria-label="Tempo"
        className="flex h-9 shrink-0 items-center rounded-full bg-surface-secondary p-1"
      >
        {TEMPOS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={option.id === tempo.id}
            title={`${option.blocksPerSecond} blocks a second`}
            onClick={() => onTempoChange(option)}
            className={cn(
              'h-7 rounded-full px-3 font-bold text-label-value-13 transition-colors duration-150',
              option.id === tempo.id
                ? 'bg-surface-primary text-primary shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:bg-surface-tertiary'
                : 'text-secondary hover:text-primary',
              FOCUS_RING,
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div
        className={cn(
          'ml-auto flex font-medium tabular-nums',
          compact
            ? 'w-full items-baseline justify-between'
            : 'flex-col items-end gap-1',
        )}
      >
        <span className="text-label-value-14 text-secondary">
          {playing ? 'Replaying' : 'Paused at'}{' '}
          <span ref={timeRef} className="font-bold text-primary">
            {time}
          </span>{' '}
          UTC
        </span>
        <span className="text-label-value-12 text-secondary">
          Slot <span ref={slotRef}>{slot}</span>
        </span>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5.5 3.4v9.2a.9.9 0 0 0 1.36.77l7.36-4.6a.9.9 0 0 0 0-1.53L6.86 2.63A.9.9 0 0 0 5.5 3.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.75" y="3" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="9.25" y="3" width="3" height="10" rx="1" fill="currentColor" />
    </svg>
  )
}

function SpeakerIcon({
  on,
  svgRef,
}: {
  on: boolean
  svgRef: RefObject<SVGSVGElement | null>
}) {
  return (
    <svg
      ref={svgRef}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d="M2 6.6c0-.5.4-.9.9-.9h1.8l3-2.6c.5-.4 1.3 0 1.3.6v8.6c0 .6-.8 1-1.3.6l-3-2.6H2.9a.9.9 0 0 1-.9-.9V6.6Z"
        fill="currentColor"
      />
      {on ? (
        <>
          <path
            d="M10.6 5.9a3 3 0 0 1 0 4.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ opacity: 'calc(0.45 + 0.55 * var(--level, 1))' }}
          />
          <path
            d="M12.4 4.1a5.6 5.6 0 0 1 0 7.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ opacity: 'calc(0.15 + 0.85 * var(--level, 1))' }}
          />
        </>
      ) : (
        <path
          d="m10.75 6.25 3.5 3.5m0-3.5-3.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
