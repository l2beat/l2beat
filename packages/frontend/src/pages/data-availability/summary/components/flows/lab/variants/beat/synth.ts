import { SLOT_SECONDS } from '../../model'
import { mulberry32 } from '../../schedule'
import type { Track } from './sequence'

/** How a row sounds */
export interface Instrument {
  kind: 'bass' | 'mallet' | 'hat'
  /** In Hz. A hat has no pitch, so it is left at 0 */
  frequency: number
  /** From -1, left, to 1, right */
  pan: number
  /** How loud a full note is, 0–1. High notes sound louder, so they get less */
  level: number
}

// C major pentatonic: no two of its notes clash, so whatever rows play at
// once make a chord rather than a noise
const PENTATONIC = [0, 2, 4, 7, 9]
const LOWEST_NOTE = 48 // C3, as a MIDI note

/**
 * The largest poster plays the bass and the next one its fifth, then each
 * smaller one a step higher up the scale, so pitch follows rank. Everyone else
 * ticks along on a hi-hat. Rows spread left and right, the bass in the middle.
 */
export function getInstruments(tracks: Track[]): Instrument[] {
  return tracks.map((track, rank): Instrument => {
    if (track.isEveryoneElse) {
      return { kind: 'hat', frequency: 0, pan: 0.2, level: 0.42 }
    }
    const degree = rank === 0 ? 0 : rank === 1 ? 3 : rank + 3
    const side = rank % 2 === 1 ? -1 : 1
    return {
      kind: rank === 0 ? 'bass' : 'mallet',
      frequency: midiToHertz(noteOfDegree(degree)),
      pan: rank === 0 ? 0 : side * Math.min(0.55, 0.12 + rank * 0.04),
      level: rank === 0 ? 0.95 : 0.78 - rank * 0.02,
    }
  })
}

/** Loudness of a note. Twice the blobs is not twice as loud to the ear */
export function getVelocity(blobs: number): number {
  return Math.min(1, Math.sqrt(blobs / 6))
}

/**
 * How long a note rings, in seconds. About until the row's next note, so a
 * fast row stays crisp and a rare one lingers like a bell.
 */
export function getRing(
  instrument: Instrument,
  interval: number,
  blocksPerSecond: number,
): number {
  if (instrument.kind === 'hat') return 0.05
  const untilNext = interval / SLOT_SECONDS / blocksPerSecond
  const longest = instrument.kind === 'bass' ? 0.7 : 1.4
  return Math.min(Math.max(untilNext * 0.85, 0.15), longest)
}

const MASTER_LEVEL = 0.25
const ATTACK = 0.004
const SILENT = 0.0001

interface Voice {
  start: number
  end: number
  output: GainNode
  sources: AudioScheduledSourceNode[]
}

/**
 * The sequencer's sound, synthesized, so there is nothing to download. Every
 * voice ends in a compressor, so however many rows hit at once it never clips.
 */
export class BeatSynth {
  private readonly master: GainNode
  private readonly bus: GainNode
  private readonly noise: AudioBuffer
  private readonly panners = new Map<number, StereoPannerNode>()
  private readonly voices = new Set<Voice>()
  private sleepTimer: ReturnType<typeof setTimeout> | undefined

  /** Undefined where the browser cannot make sound */
  static create(): BeatSynth | undefined {
    const Context =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Context) return undefined
    try {
      return new BeatSynth(new Context({ latencyHint: 'interactive' }))
    } catch {
      return undefined
    }
  }

  private constructor(private readonly context: AudioContext) {
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = -14
    compressor.knee.value = 10
    compressor.ratio.value = 6
    compressor.attack.value = 0.003
    compressor.release.value = 0.2
    compressor.connect(context.destination)

    this.master = context.createGain()
    this.master.gain.value = 0
    this.master.connect(compressor)

    // a small room, so notes bloom a little rather than stop dead
    this.bus = context.createGain()
    this.bus.connect(this.master)
    const send = context.createGain()
    send.gain.value = 0.28
    this.bus.connect(send).connect(createRoom(context)).connect(this.master)

    this.noise = createNoise(context)
  }

  get now(): number {
    return this.context.currentTime
  }

  /** How long after its start time a note leaves the speakers */
  get latency(): number {
    return this.context.outputLatency || this.context.baseLatency || 0
  }

  /** Browsers let sound start only after a click, so the first wake must come from one */
  wake() {
    clearTimeout(this.sleepTimer)
    if (this.context.state !== 'running') {
      this.context.resume().catch(() => {})
    }
    const t = this.context.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(MASTER_LEVEL, t, 0.015)
  }

  /** Fades out within a frame or two, drops what was about to play, then lets the device rest */
  sleep() {
    const t = this.context.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(0, t, 0.012)
    for (const voice of this.voices) this.drop(voice, t + 0.08)
    clearTimeout(this.sleepTimer)
    this.sleepTimer = setTimeout(() => {
      if (this.context.state === 'running') {
        this.context.suspend().catch(() => {})
      }
    }, 250)
  }

  /** Drops the notes scheduled but not started, as when the tempo or the solo changes */
  cancelPending() {
    const t = this.context.currentTime
    for (const voice of this.voices) {
      if (voice.start > t) this.drop(voice, t)
    }
  }

  /** `ring` is how long the note takes to die away, in seconds */
  play(instrument: Instrument, when: number, velocity: number, ring: number) {
    this.forgetEnded()
    const output = this.context.createGain()
    output.connect(this.pannerFor(instrument.pan))
    const peak = Math.max(SILENT * 10, velocity * instrument.level)
    const sources =
      instrument.kind === 'hat'
        ? this.hat(when, peak, output)
        : instrument.kind === 'bass'
          ? this.bass(instrument.frequency, when, peak, ring, output)
          : this.mallet(instrument.frequency, when, peak, ring, output)
    const voice: Voice = {
      start: when,
      end: when + ring + 0.2,
      output,
      sources,
    }
    this.voices.add(voice)
    const last = sources.at(-1)
    if (last) last.onended = () => this.release(voice)
  }

  close() {
    clearTimeout(this.sleepTimer)
    this.voices.clear()
    this.context.close().catch(() => {})
  }

  // A sine, and its fourth harmonic dying away fast for the strike of a mallet
  private mallet(
    frequency: number,
    when: number,
    peak: number,
    ring: number,
    output: GainNode,
  ) {
    const strike = this.oscillator('sine', frequency * 4)
    strike
      .connect(this.envelope(when, peak * 0.2, Math.min(0.08, ring)))
      .connect(output)
    const body = this.oscillator('sine', frequency)
    body.connect(this.envelope(when, peak, ring)).connect(output)
    return this.startAll([strike, body], when, ring)
  }

  // A triangle for the body and a filtered saw closing fast for the pluck
  private bass(
    frequency: number,
    when: number,
    peak: number,
    ring: number,
    output: GainNode,
  ) {
    const envelope = this.envelope(when, peak, ring)
    envelope.connect(output)
    const body = this.oscillator('triangle', frequency)
    body.connect(envelope)
    const edge = this.oscillator('sawtooth', frequency)
    edge.detune.value = 6
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.Q.value = 2
    filter.frequency.setValueAtTime(frequency * 14, when)
    filter.frequency.exponentialRampToValueAtTime(frequency * 2, when + 0.18)
    const edgeLevel = this.context.createGain()
    edgeLevel.gain.value = 0.45
    edge.connect(filter).connect(edgeLevel).connect(envelope)
    return this.startAll([edge, body], when, ring)
  }

  // Noise with only its top left in, for a short closed hi-hat
  private hat(when: number, peak: number, output: GainNode) {
    const source = this.context.createBufferSource()
    source.buffer = this.noise
    const filter = this.context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 7000
    source
      .connect(filter)
      .connect(this.envelope(when, peak, 0.05))
      .connect(output)
    // a different stretch of noise each time, so no two ticks are the same
    source.start(when, Math.random() * (this.noise.duration - 0.2))
    source.stop(when + 0.1)
    return [source]
  }

  private oscillator(type: OscillatorType, frequency: number) {
    const oscillator = this.context.createOscillator()
    oscillator.type = type
    oscillator.frequency.value = frequency
    return oscillator
  }

  private envelope(when: number, peak: number, decay: number) {
    const gain = this.context.createGain()
    gain.gain.value = 0
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(peak, when + ATTACK)
    gain.gain.exponentialRampToValueAtTime(SILENT, when + ATTACK + decay)
    return gain
  }

  private startAll(sources: OscillatorNode[], when: number, ring: number) {
    for (const source of sources) {
      source.start(when)
      source.stop(when + ATTACK + ring + 0.02)
    }
    return sources
  }

  private pannerFor(pan: number): AudioNode {
    // older Safari has no stereo panner; there every row plays in the middle
    if (typeof this.context.createStereoPanner !== 'function') return this.bus
    let panner = this.panners.get(pan)
    if (!panner) {
      panner = this.context.createStereoPanner()
      panner.pan.value = pan
      panner.connect(this.bus)
      this.panners.set(pan, panner)
    }
    return panner
  }

  private drop(voice: Voice, at: number) {
    for (const source of voice.sources) {
      try {
        source.stop(Math.max(at, this.context.currentTime))
      } catch {
        // stopped already
      }
    }
    if (voice.start > at) this.release(voice)
  }

  private release(voice: Voice) {
    voice.output.disconnect()
    this.voices.delete(voice)
  }

  // in case a browser skips `ended` for a note that never started
  private forgetEnded() {
    const t = this.context.currentTime
    for (const voice of this.voices) {
      if (voice.end < t - 1) this.release(voice)
    }
  }
}

function noteOfDegree(degree: number): number {
  const octave = Math.floor(degree / PENTATONIC.length)
  const step = PENTATONIC[degree % PENTATONIC.length] ?? 0
  return LOWEST_NOTE + octave * 12 + step
}

function midiToHertz(note: number): number {
  return 440 * 2 ** ((note - 69) / 12)
}

function createNoise(context: AudioContext): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
  const samples = buffer.getChannelData(0)
  const random = mulberry32(7)
  for (let i = 0; i < samples.length; i++) samples[i] = random() * 2 - 1
  return buffer
}

/** A room made up rather than recorded: noise dying away, a little different in each ear */
function createRoom(context: AudioContext): ConvolverNode {
  const length = Math.round(context.sampleRate * 1.4)
  const buffer = context.createBuffer(2, length, context.sampleRate)
  const random = mulberry32(21)
  for (let channel = 0; channel < 2; channel++) {
    const samples = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      samples[i] = (random() * 2 - 1) * (1 - i / length) ** 4
    }
  }
  const room = context.createConvolver()
  room.buffer = buffer
  return room
}
