import { type RefObject, useEffect, useRef } from 'react'
import { SLOT_SECONDS } from '../../model'
import { getPlaybackStart } from '../../schedule'
import {
  forEachStepBetween,
  getStepHits,
  type Hit,
  type Sequence,
} from './sequence'
import { BeatSynth, getRing, getVelocity, type Instrument } from './synth'
import type { Tempo } from './Transport'

// Notes go to the audio clock this far ahead of the playhead, so a late
// frame cannot make them late too
const LOOKAHEAD_SECONDS = 0.12
// what is drawn shows up about a frame after it is drawn
const FRAME_SECONDS = 1 / 60
// a block that fired is kept this long, to draw how it blooms and settles
const FIRED_MEMORY_SECONDS = 1
// the sound level jumps with each note and dies away about this fast
const LEVEL_DECAY_SECONDS = 0.12

interface Options {
  sequence: Sequence
  instruments: Instrument[]
  tempo: Tempo
  playing: boolean
  /** Sound is on and the sequencer is playing in view */
  audible: boolean
  /** The poster index to play alone, or -1 for all */
  solo: number
}

export interface Player {
  /** Seconds of playback at the playhead. It only grows: past the day's end, the day starts over */
  clock: RefObject<number>
  /** When each block that fired lately did, by step, in seconds of the page's clock */
  firedAt: RefObject<Map<number, number>>
  /** When each row last fired, by track */
  lastFired: RefObject<number[]>
  /** How loud what is heard is now, 0–1: 0 while nothing sounds */
  level: RefObject<number>
  /** Moves playback on by a frame of `dt` seconds */
  advance: (dt: number, now: number) => void
  /** Call it from a click: browsers start sound only on one. False where there is no sound */
  enableSound: () => boolean
}

/**
 * Plays the sequence: moves the playhead, fires the blocks it passes and
 * schedules their notes on the audio clock, which keeps better time than
 * frames do.
 */
export function usePlayer({
  sequence,
  instruments,
  tempo,
  playing,
  audible,
  solo,
}: Options): Player {
  const clock = useRef(getPlaybackStart())
  const firedAt = useRef(new Map<number, number>())
  const lastFired = useRef<number[]>([])
  const level = useRef(0)
  const synth = useRef<BeatSynth | undefined>(undefined)
  const scheduledUntil = useRef<number | undefined>(undefined)

  useEffect(() => {
    const current = synth.current
    if (!current) return
    scheduledUntil.current = undefined
    if (audible) current.wake()
    else current.sleep()
  }, [audible])

  // biome-ignore lint/correctness/useExhaustiveDependencies: notes scheduled under the old tempo, solo or rows are out of time now
  useEffect(() => {
    synth.current?.cancelPending()
    scheduledUntil.current = undefined
  }, [tempo, solo, sequence])

  useEffect(
    () => () => {
      synth.current?.close()
      synth.current = undefined
    },
    [],
  )

  const scheduleSound = (speed: number) => {
    const current = synth.current
    if (!current) return
    const at = clock.current
    // the speakers lag the audio clock, so notes start that much early to
    // be heard as they are seen
    const early = Math.max(0, current.latency - FRAME_SECONDS)
    const from = Math.max(scheduledUntil.current ?? at, at)
    const to = at + (LOOKAHEAD_SECONDS + early) * speed
    forEachStepBetween(from, to, (step, time) => {
      for (const hit of getStepHits(sequence, step)) {
        const blobs = solo < 0 ? hit.blobs : getSoloBlobs(hit, solo)
        const instrument = instruments[hit.track]
        const track = sequence.tracks[hit.track]
        if (blobs === 0 || !instrument || !track) continue
        const when = current.now + (time - at) / speed - early
        if (when < current.now - 0.02) continue
        current.play(
          instrument,
          Math.max(when, current.now),
          getVelocity(blobs),
          getRing(
            instrument,
            track.poster.cadence.interval,
            tempo.blocksPerSecond,
          ),
        )
      }
    })
    scheduledUntil.current = Math.max(from, to)
  }

  const advance = (dt: number, now: number) => {
    const from = clock.current
    const speed = tempo.blocksPerSecond * SLOT_SECONDS
    if (playing) clock.current = from + dt * speed
    let heard = 0
    forEachStepBetween(from, clock.current, (step) => {
      const hits = getStepHits(sequence, step)
      if (hits.length === 0) return
      firedAt.current.set(step, now)
      for (const hit of hits) {
        lastFired.current[hit.track] = now
        const blobs = solo < 0 ? hit.blobs : getSoloBlobs(hit, solo)
        if (blobs > 0) heard += getVelocity(blobs)
      }
    })
    level.current = audible
      ? Math.min(
          1,
          Math.max(level.current * Math.exp(-dt / LEVEL_DECAY_SECONDS), heard),
        )
      : 0
    for (const [step, at] of firedAt.current) {
      if (now - at > FIRED_MEMORY_SECONDS) firedAt.current.delete(step)
    }
    if (!audible) return
    try {
      scheduleSound(speed)
    } catch {
      // a browser refusing a note must not stop the drawing, which runs in
      // this same frame
    }
  }

  const enableSound = () => {
    synth.current ??= BeatSynth.create()
    if (!synth.current) return false
    synth.current.wake()
    scheduledUntil.current = undefined
    return true
  }

  return { clock, firedAt, lastFired, level, advance, enableSound }
}

function getSoloBlobs(hit: Hit, posterIndex: number): number {
  return hit.batches.reduce(
    (sum, batch) => sum + (batch.posterIndex === posterIndex ? batch.blobs : 0),
    0,
  )
}
