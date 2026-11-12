/**
 * Damped springs baked into CSS `linear()` easings, so the chain's motion has
 * weight and a little overshoot while the compositor still runs it: Web
 * Animations and CSS transitions both take the string, no per-frame JS.
 */
export interface Spring {
  easing: string
  /** How long the spring takes to settle, in ms */
  duration: number
}

function bake(stiffness: number, damping: number, mass = 1): Spring {
  const dt = 1 / 240
  let x = 0
  let v = 0
  let t = 0
  const samples: number[] = [0]
  // settles when both position and speed are within a hair of rest
  while (
    t < 3 &&
    !(Math.abs(1 - x) < 0.0008 && Math.abs(v) < 0.01 && t > 0.1)
  ) {
    const force = -stiffness * (x - 1) - damping * v
    v += (force / mass) * dt
    x += v * dt
    t += dt
    samples.push(x)
  }
  samples[samples.length - 1] = 1
  // about 50 stops are indistinguishable from the full curve
  const step = Math.max(1, Math.floor(samples.length / 50))
  const stops: string[] = []
  for (let i = 0; i < samples.length; i += step) {
    stops.push((samples[i] ?? 1).toFixed(4))
  }
  if (stops.at(-1) !== '1.0000') stops.push('1')
  return {
    easing: `linear(${stops.join(', ')})`,
    duration: Math.round(t * 1000),
  }
}

/** The chain stepping forward one block: firm, a hint of overshoot */
export const SLIDE = bake(210, 24)
/** A tile landing in place: visible bounce, like a block set down */
export const LAND = bake(260, 16)
/** Markers following a scrub: quick to arrive, soft to stop */
export const FOLLOW = bake(420, 34)
/** The orphan drifting up to the side branch: slow and floaty */
export const FLOAT = bake(90, 13)
