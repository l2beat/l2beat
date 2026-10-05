import { mulberry32 } from '../../schedule'
import { HOUR_SECONDS, type PourPlan } from './pour'
import type { Vessel } from './vessel'

/**
 * Falling sand. A grain pours in at the top vertex, falls faster and faster
 * down the middle, and once it hits the pile it moves like sand in the
 * classic cellular automaton: straight down if it can, else down to the left
 * or right, in random order, else it rests. Grains live on the vessel's grid,
 * a cell each, in typed arrays, as there are thousands of them.
 */
export class Sand {
  /** Seconds into the pour */
  time = 0
  /** The grain in each cell of the vessel's grid, -1 for none */
  readonly cells: Int32Array
  /** The cell of each grain, -1 until it is poured */
  readonly grainCell: Int32Array
  private readonly state: Uint8Array
  private readonly speed: Float32Array
  private readonly fallen: Float32Array
  /** Grains that may move, about bottom first; stale ones drop out on sorting */
  private readonly active: Int32Array
  private activeCount = 0
  /** 1 while a grain has an entry in `active`, so it never gets two */
  private readonly listed: Uint8Array
  private nextGrain = 0
  private random: () => number
  private readonly gravity: number
  private readonly maxSpeed: number
  private readonly startSpeed: number
  private readonly slideRate: number

  constructor(
    private readonly vessel: Vessel,
    private readonly plan: PourPlan,
  ) {
    const count = plan.grainCount
    this.cells = new Int32Array(vessel.columns * vessel.rows)
    this.grainCell = new Int32Array(count)
    this.state = new Uint8Array(count)
    this.speed = new Float32Array(count)
    this.fallen = new Float32Array(count)
    this.active = new Int32Array(Math.max(16, count))
    this.listed = new Uint8Array(count)
    this.random = mulberry32(1559)
    // set in CSS px, so sand falls alike whatever the cell size
    this.gravity = 1500 / vessel.cell
    this.maxSpeed = 760 / vessel.cell
    this.startSpeed = 260 / vessel.cell
    this.slideRate = 520 / vessel.cell
    this.reset()
  }

  reset() {
    this.time = 0
    this.cells.fill(-1)
    this.grainCell.fill(-1)
    this.state.fill(WAITING)
    this.listed.fill(0)
    this.activeCount = 0
    this.nextGrain = 0
    this.random = mulberry32(1559)
  }

  /** Grains poured so far, whether they have landed or not */
  get poured(): number {
    return this.nextGrain
  }

  get isSettled(): boolean {
    if (this.nextGrain < this.plan.grainCount) return false
    for (let i = 0; i < this.activeCount; i++) {
      if (this.state[this.active[i] ?? 0] !== RESTING) return false
    }
    return true
  }

  /** Settled, or stuck for good, as a vessel too small for the day would be */
  get isFinished(): boolean {
    return this.isSettled || this.time > this.plan.hours * HOUR_SECONDS + 30
  }

  /** Every grain still in the air, with how many cells a second it falls */
  forEachFlying(visit: (grain: number, cell: number, speed: number) => void) {
    for (let i = 0; i < this.activeCount; i++) {
      const grain = this.active[i] ?? 0
      if (this.state[grain] !== FLYING) continue
      visit(grain, this.grainCell[grain] ?? 0, this.speed[grain] ?? 0)
    }
  }

  /** Moves the pour on by `dt` seconds */
  advance(dt: number) {
    this.time += dt
    this.pourDueGrains()
    this.fly(dt)
    const steps = Math.max(1, Math.round(dt * this.slideRate))
    for (let i = 0; i < steps; i++) this.slide()
  }

  /** Runs the whole pour at once, for when it is not to be watched */
  pourAll() {
    while (!this.isFinished) this.advance(1 / 60)
  }

  /** Runs the pour up to `time`, as after the vessel was resized */
  pourUntil(time: number) {
    while (this.time < time && !this.isFinished) this.advance(1 / 60)
  }

  private pourDueGrains() {
    const { plan } = this
    while (
      this.nextGrain < plan.grainCount &&
      (plan.time[this.nextGrain] ?? 0) <= this.time
    ) {
      const cell = this.findInletCell()
      // a crowded inlet holds the rest back a frame, as a narrow neck would
      if (cell < 0) return
      const grain = this.nextGrain++
      this.cells[cell] = grain
      this.grainCell[grain] = cell
      this.state[grain] = FLYING
      this.speed[grain] = this.startSpeed
      this.fallen[grain] = 0
      this.activate(grain)
    }
  }

  /**
   * A free cell of the neck. The lowest go first: grains move oldest first,
   * so the one poured earlier has to be the one below
   */
  private findInletCell(): number {
    const { vessel } = this
    for (let row = vessel.inletRow + 2; row >= vessel.inletRow; row--) {
      const offset = Math.floor(this.random() * 3) - 1
      for (let i = 0; i < 3; i++) {
        const column = vessel.centerColumn + ((offset + i + 4) % 3) - 1
        const cell = row * vessel.columns + column
        if (vessel.mask[cell] === 1 && this.cells[cell] === -1) return cell
      }
    }
    return -1
  }

  /** Grains in the air fall by their speed, which gravity keeps raising */
  private fly(dt: number) {
    const { vessel, cells } = this
    const columns = vessel.columns
    this.sortActive()
    for (let i = 0; i < this.activeCount; i++) {
      const grain = this.active[i] ?? 0
      if (this.state[grain] !== FLYING) continue
      const speed = Math.min(
        (this.speed[grain] ?? 0) + this.gravity * dt,
        this.maxSpeed,
      )
      this.speed[grain] = speed
      let fallen = (this.fallen[grain] ?? 0) + speed * dt
      let cell = this.grainCell[grain] ?? 0
      while (fallen >= 1) {
        const below = cell + columns
        const occupant = cells[below] ?? -1
        if (vessel.mask[below] === 1 && occupant === -1) {
          this.move(grain, cell, below)
          cell = below
          fallen -= 1
        } else {
          // behind a grain still in the air it waits; on the pile it lands
          if (occupant === -1 || this.state[occupant] !== FLYING) {
            this.state[grain] = SLIDING
            fallen = 0
          } else {
            fallen = Math.min(fallen, 1)
          }
          break
        }
      }
      this.fallen[grain] = fallen
    }
  }

  /** One step of the automaton for every grain on the move on the pile */
  private slide() {
    const { vessel, cells } = this
    const columns = vessel.columns
    this.sortActive()
    const count = this.activeCount
    for (let i = 0; i < count; i++) {
      const grain = this.active[i] ?? 0
      if (this.state[grain] !== SLIDING) continue
      const cell = this.grainCell[grain] ?? 0
      const below = cell + columns
      if (vessel.mask[below] === 1 && cells[below] === -1) {
        this.move(grain, cell, below)
        continue
      }
      const first = this.random() < 0.5 ? -1 : 1
      const side = this.canTake(below + first)
        ? below + first
        : this.canTake(below - first)
          ? below - first
          : -1
      if (side >= 0) {
        this.move(grain, cell, side)
        continue
      }
      this.state[grain] = RESTING
    }
  }

  private canTake(cell: number): boolean {
    return this.vessel.mask[cell] === 1 && this.cells[cell] === -1
  }

  private move(grain: number, from: number, to: number) {
    this.cells[from] = -1
    this.cells[to] = grain
    this.grainCell[grain] = to
    this.wakeAbove(from)
  }

  /** A grain that moves away can leave the ones it held up hanging */
  private wakeAbove(cell: number) {
    const above = cell - this.vessel.columns
    if (above < 1) return
    for (let side = -1; side <= 1; side++) {
      const grain = this.cells[above + side] ?? -1
      if (grain >= 0 && this.state[grain] === RESTING) {
        this.state[grain] = SLIDING
        this.activate(grain)
      }
    }
  }

  private activate(grain: number) {
    if (this.listed[grain] === 1) return
    this.listed[grain] = 1
    this.active[this.activeCount++] = grain
  }

  /**
   * Drops grains at rest from the list and puts the rest in pouring order,
   * which is about bottom first, so a grain moves before the one above it
   */
  private sortActive() {
    let kept = 0
    for (let i = 0; i < this.activeCount; i++) {
      const grain = this.active[i] ?? 0
      if (this.state[grain] === RESTING) this.listed[grain] = 0
      else this.active[kept++] = grain
    }
    this.activeCount = kept
    this.active.subarray(0, kept).sort()
  }
}

const WAITING = 0
const FLYING = 1
const SLIDING = 2
const RESTING = 3
