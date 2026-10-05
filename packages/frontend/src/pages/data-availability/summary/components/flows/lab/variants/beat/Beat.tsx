import { formatNumberWithCommas } from '@l2beat/shared-pure'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { LabLegend, LegendValue } from '../../BlobLab'
import { readableColor } from '../../color'
import {
  prepareCanvas,
  useAnimationFrame,
  useElementSize,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../../hooks'
import { SLOT_SECONDS } from '../../model'
import type { LabVariantProps } from '../../types'
import { BeatTooltip } from './BeatTooltip'
import {
  drawSequencer,
  getSequencerHeight,
  getSequencerLayout,
} from './drawSequencer'
import {
  describeSequencer,
  formatClockTime,
  formatTimeScale,
  getSlotNumber,
} from './format'
import { Gutter } from './Gutter'
import { pulseRings, showSoundLevel, showText } from './readouts'
import { buildSequence, type Track } from './sequence'
import { getInstruments } from './synth'
import { TEMPOS, type Tempo, Transport } from './Transport'
import { usePlayer } from './usePlayer'
import { useSequencerHover } from './useSequencerHover'

// Narrower than this, rows lose their names and fewer projects get one
const COMPACT_BELOW = 560
const SIZES = {
  regular: { tracks: 13, visibleBlocks: 32, gutter: 148, rowHeight: 42 },
  compact: { tracks: 9, visibleBlocks: 16, gutter: 40, rowHeight: 40 },
}
// notes are small marks on a tinted band, so they need more contrast than
// the default to be told apart from it
const NOTE_CONTRAST = 2.4

/**
 * Blobspace has a rhythm. Ethereum takes data once a block, every 12
 * seconds, which is what a step sequencer does: blocks are its steps,
 * projects its instruments and batches its notes. Played back fast, every
 * project keeps its own beat, and with the sound on it can be heard.
 */
export function Beat({
  data,
  batches,
  highlighted,
  onSelect,
}: LabVariantProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sequencerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ringRefs = useRef<(HTMLSpanElement | null)[]>([])
  const timeRef = useRef<HTMLSpanElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)
  const speakerRef = useRef<SVGSVGElement>(null)
  const shownStep = useRef<number | undefined>(undefined)

  const tokens = useThemeTokens()
  const reducedMotion = usePrefersReducedMotion()
  const onScreen = useIsOnScreen(rootRef)
  const pageVisible = usePageVisible()
  const rootSize = useElementSize(rootRef)
  const box = useElementSize(sequencerRef)
  const compact = rootSize.width > 0 && rootSize.width < COMPACT_BELOW
  const size = compact ? SIZES.compact : SIZES.regular

  const sequence = useMemo(
    () => buildSequence(data, batches, size.tracks),
    [data, batches, size.tracks],
  )
  const instruments = useMemo(() => getInstruments(sequence.tracks), [sequence])
  const colors = useMemo(
    () =>
      data.posters.map((p) =>
        readableColor(p.color, tokens.surface, NOTE_CONTRAST),
      ),
    [data.posters, tokens.surface],
  )
  const hasEveryoneElse = sequence.tracks.at(-1)?.isEveryoneElse ?? false
  const layout = useMemo(
    () =>
      getSequencerLayout(
        Math.max(0, box.width - size.gutter),
        box.height,
        sequence.tracks.length,
        hasEveryoneElse,
        size.visibleBlocks,
      ),
    [box.width, box.height, size, sequence.tracks.length, hasEveryoneElse],
  )
  const highlightedIndex = data.posters.findIndex((p) => p.id === highlighted)
  const spotlight = getSpotlight(sequence.tracks, highlighted)

  const [tempo, setTempo] = useState<Tempo>(TEMPOS[1])
  const [playChoice, setPlayChoice] = useState<boolean>()
  const playing = playChoice ?? !reducedMotion
  const [soundOn, setSoundOn] = useState(false)
  const [soundAvailable, setSoundAvailable] = useState(true)
  const settling = useSettling(playing)
  const audible = soundOn && playing && onScreen && pageVisible
  const running = onScreen && pageVisible && (playing || settling)

  const player = usePlayer({
    sequence,
    instruments,
    tempo,
    playing,
    audible,
    solo: highlightedIndex,
  })
  const hovering = useSequencerHover({
    rootRef,
    canvasRef,
    getView: () => ({ layout, sequence, clock: player.clock.current }),
    sequence,
    posters: data.posters,
    onSelect,
  })

  const formatTime = (seconds: number) =>
    formatClockTime(data.range[0], seconds)
  const formatSlot = (step: number) =>
    formatNumberWithCommas(getSlotNumber(data.range[0], step))

  const paint = (now: number) => {
    const canvas = canvasRef.current
    if (!canvas || layout.width <= 0 || layout.height <= 0) return
    const ctx = prepareCanvas(canvas, layout.width, layout.height)
    if (!ctx) return
    drawSequencer(ctx, {
      layout,
      sequence,
      clock: player.clock.current,
      now,
      firedAt: player.firedAt.current,
      colors,
      neutral: tokens.secondary,
      tokens,
      highlighted: highlightedIndex,
      hovered: hovering.target.current,
      formatTime,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    })
  }

  const showPosition = () => {
    const step = Math.floor(player.clock.current / SLOT_SECONDS)
    if (step === shownStep.current) return
    shownStep.current = step
    showText(timeRef.current, formatTime(step * SLOT_SECONDS))
    showText(slotRef.current, formatSlot(step))
  }

  useAnimationFrame((dt, now) => {
    player.advance(dt, now)
    pulseRings(ringRefs.current, player.lastFired.current, now)
    // paused, the speaker rests with its waves full
    showSoundLevel(
      speakerRef.current,
      soundOn && playing ? player.level.current : 1,
    )
    showPosition()
    if (playing) hovering.followNotes()
    paint(now)
  }, running)

  // a still frame is drawn whenever what it shows changes
  useEffect(() => {
    if (!running) paint(performance.now() / 1000)
  })

  const togglePlay = () => {
    // the click lets the browser start sound again, were it put to sleep
    if (!playing && soundOn) player.enableSound()
    setPlayChoice(!playing)
  }

  const toggleSound = () => {
    if (soundOn) {
      setSoundOn(false)
      return
    }
    if (!player.enableSound()) {
      setSoundAvailable(false)
      return
    }
    setSoundOn(true)
    // there is nothing to hear while paused
    if (!playing) setPlayChoice(true)
  }

  const ringColors = sequence.tracks.map((track) => {
    const poster = track.isEveryoneElse ? spotlight : track.poster
    return (poster && colors[data.posters.indexOf(poster)]) ?? tokens.secondary
  })
  const step = Math.floor(player.clock.current / SLOT_SECONDS)
  const { hover } = hovering

  return (
    <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col gap-4">
      <Transport
        playing={playing}
        onPlayToggle={togglePlay}
        soundOn={soundOn}
        soundAvailable={soundAvailable}
        onSoundToggle={toggleSound}
        tempo={tempo}
        onTempoChange={setTempo}
        timeRef={timeRef}
        slotRef={slotRef}
        speakerRef={speakerRef}
        time={formatTime(step * SLOT_SECONDS)}
        slot={formatSlot(step)}
        compact={compact}
      />
      <div
        ref={sequencerRef}
        className="relative h-(--sequencer-height) shrink-0 lg:h-auto lg:min-h-0 lg:flex-1"
        style={
          {
            '--sequencer-height': `${getSequencerHeight(
              sequence.tracks.length,
              hasEveryoneElse,
              size.rowHeight,
            )}px`,
          } as CSSProperties
        }
      >
        <Gutter
          tracks={sequence.tracks}
          layout={layout}
          width={size.gutter}
          compact={compact}
          ringColors={ringColors}
          ringRefs={ringRefs}
          highlighted={highlighted}
          hoveredTrack={hover?.target.track}
          spotlight={spotlight}
          onSelect={onSelect}
          onHover={hovering.onGutterHover}
          onLeave={hovering.clear}
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={describeSequencer(data)}
          className="absolute top-0 touch-pan-y"
          style={{
            left: size.gutter,
            width: layout.width,
            height: layout.height,
          }}
          {...hovering.canvasHandlers}
        />
      </div>
      <BeatLegend tempo={tempo} />
      {hover && (
        <BeatTooltip
          hover={hover}
          containerWidth={rootSize.width}
          containerHeight={rootSize.height}
          data={data}
          sequence={sequence}
          spotlight={spotlight}
        />
      )}
    </div>
  )
}

function BeatLegend({ tempo }: { tempo: Tempo }) {
  return (
    <LabLegend
      items={[
        <>
          1 column ≈ <LegendValue>1 block (12 s)</LegendValue>
        </>,
        <>
          1 note ≈ <LegendValue>1 batch</LegendValue>
        </>,
        <>
          note height ≈ <LegendValue>blobs</LegendValue>
        </>,
        <>
          1 second ≈{' '}
          <LegendValue>
            {formatTimeScale(tempo.blocksPerSecond * SLOT_SECONDS)}
          </LegendValue>
        </>,
        <>batch timing simulated from hourly totals</>,
      ]}
    />
  )
}

/** A project of everyone else, when it was picked: it takes over that row */
function getSpotlight(tracks: Track[], highlighted: string | undefined) {
  const everyoneElse = tracks.at(-1)
  if (!everyoneElse?.isEveryoneElse || highlighted === undefined) return
  return everyoneElse.members.find((p) => p.id === highlighted)
}

/** Sound and motion stop with the tab out of sight, not only with the card */
function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return visible
}

/** True for a moment after a pause, for the last notes to settle rather than freeze mid-flare */
function useSettling(playing: boolean): boolean {
  const [settling, setSettling] = useState(false)
  useEffect(() => {
    if (playing) return
    setSettling(true)
    const timer = setTimeout(() => setSettling(false), 700)
    return () => clearTimeout(timer)
  }, [playing])
  return settling
}
