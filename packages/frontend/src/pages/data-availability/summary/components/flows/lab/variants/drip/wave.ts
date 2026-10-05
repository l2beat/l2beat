/**
 * The surface of Ethereum's pool: a row of columns tied to their rest level
 * and to each other by springs, so a drop landing in one sends ripples both
 * ways. Heights are in CSS px, positive down.
 */
export class Wave {
  readonly heights: Float32Array
  private readonly velocities: Float32Array
  private readonly spacing: number

  constructor(
    readonly width: number,
    readonly columns: number,
  ) {
    this.heights = new Float32Array(columns)
    this.velocities = new Float32Array(columns)
    this.spacing = width / (columns - 1)
  }

  /** Surface height at `x`, through the columns as the shader draws it */
  heightAt(x: number): number {
    return this.sample(x).height
  }

  slopeAt(x: number): number {
    return this.sample(x).slope
  }

  /** Pushes the surface down (or up, when negative) around `x` */
  push(x: number, velocity: number, spread: number) {
    const reach = Math.ceil((spread * 2.5) / this.spacing)
    const center = Math.round(x / this.spacing)
    for (let i = center - reach; i <= center + reach; i++) {
      if (i < 0 || i >= this.columns) continue
      const distance = i * this.spacing - x
      const falloff = Math.exp(-(distance * distance) / (2 * spread * spread))
      this.velocities[i] = (this.velocities[i] ?? 0) + velocity * falloff
    }
  }

  step(dt: number) {
    // explicit springs stay stable only in small steps
    const substeps = Math.max(1, Math.ceil(dt / MAX_SUBSTEP))
    const h = dt / substeps
    const damping = Math.exp(-DAMPING * h)
    const last = this.columns - 1
    for (let s = 0; s < substeps; s++) {
      for (let i = 0; i <= last; i++) {
        const here = this.heights[i] ?? 0
        const left = this.heights[Math.max(i - 1, 0)] ?? here
        const right = this.heights[Math.min(i + 1, last)] ?? here
        const pull = TENSION * (left + right - 2 * here) - RESTORE * here
        this.velocities[i] = ((this.velocities[i] ?? 0) + pull * h) * damping
      }
      for (let i = 0; i <= last; i++) {
        this.heights[i] = (this.heights[i] ?? 0) + (this.velocities[i] ?? 0) * h
      }
    }
  }

  calm() {
    this.heights.fill(0)
    this.velocities.fill(0)
  }

  /** The highest the surface rises above its rest level, in px */
  highestCrest(): number {
    let lowest = 0
    for (const height of this.heights) lowest = Math.min(lowest, height)
    return -lowest
  }

  /** The deepest the surface dips under its rest level, in px */
  deepestTrough(): number {
    let deepest = 0
    for (const height of this.heights) deepest = Math.max(deepest, height)
    return deepest
  }

  private sample(x: number) {
    const u = Math.min(Math.max(x / this.spacing, 0), this.columns - 1)
    const i = Math.floor(u)
    const t = u - i
    const p0 = this.column(i - 1)
    const p1 = this.column(i)
    const p2 = this.column(i + 1)
    const p3 = this.column(i + 2)
    // Catmull-Rom, the same curve the shader draws
    const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3
    const b = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3
    const c = 0.5 * (p2 - p0)
    return {
      height: ((a * t + b) * t + c) * t + p1,
      slope: ((3 * a * t + 2 * b) * t + c) / this.spacing,
    }
  }

  private column(i: number) {
    return this.heights[Math.min(Math.max(i, 0), this.columns - 1)] ?? 0
  }
}

/** How strongly a column follows its neighbours, which sets how fast ripples run */
const TENSION = 2600
/** How strongly a column returns to the rest level */
const RESTORE = 26
const DAMPING = 3.2
const MAX_SUBSTEP = 1 / 240
