import type { ThemeTokens } from '~/hooks/useThemeTokens'
import { alpha } from './canvasColor'

/**
 * Deposits scroll from "now" into the past; every withdrawal could have come
 * from any deposit before it, so it fans out to all of them.
 */

/** Seconds a deposit takes to cross the visible history. */
const WINDOW_S = 6
const FAN_S = 2.4
const MY_FAN_S = 6

interface Deposit {
  id: number
  age: number
  /** 0..1 within the deposit lane. */
  lane: number
  mine: boolean
}

interface Withdrawal {
  age: number
  candidates: number[]
  /** The deposit it really came from, shown only for the reader's own. */
  source: number | undefined
}

export interface CrowdScene {
  nextId: number
  deposits: Deposit[]
  withdrawals: Withdrawal[]
  withdrawIn: number
}

export function createCrowdScene(rate: number): CrowdScene {
  const scene: CrowdScene = {
    nextId: 0,
    deposits: [],
    withdrawals: [],
    withdrawIn: 1,
  }
  for (let i = 0; i < WINDOW_S * 30; i++) stepCrowdScene(scene, 1 / 30, rate)
  return scene
}

/** `rate` is deposits per second. */
export function stepCrowdScene(scene: CrowdScene, dt: number, rate: number) {
  for (const d of scene.deposits) d.age += dt
  scene.deposits = scene.deposits.filter((d) => d.age < WINDOW_S)
  for (const w of scene.withdrawals) w.age += dt
  scene.withdrawals = scene.withdrawals.filter(
    (w) => w.age < (w.source === undefined ? FAN_S : MY_FAN_S),
  )

  // Drawn every frame from the current rate, so traffic changes show at once.
  if (Math.random() < rate * dt) addDeposit(scene, false)
  scene.withdrawIn -= dt
  if (scene.withdrawIn <= 0) {
    // Others wait while the reader's own withdrawal is on screen.
    const readerWithdrawing = scene.withdrawals.some(
      (w) => w.source !== undefined,
    )
    if (!readerWithdrawing && scene.deposits.length > 0) {
      scene.withdrawals.push({
        age: 0,
        candidates: scene.deposits.map((d) => d.id),
        source: undefined,
      })
    }
    scene.withdrawIn = 2.2 + Math.random() * 1.6
  }
}

export function addDeposit(scene: CrowdScene, mine: boolean) {
  const id = scene.nextId++
  scene.deposits.push({ id, age: 0, lane: Math.random(), mine })
  return id
}

/** The reader's withdrawal; returns how many deposits it hides among. */
export function withdrawMine(scene: CrowdScene, source: number) {
  const candidates = scene.deposits.map((d) => d.id)
  // Only the reader's own fan stays on screen, so labels never overlap.
  scene.withdrawals = [{ age: 0, candidates, source }]
  return candidates.length
}

export function hasDeposit(scene: CrowdScene, id: number) {
  return scene.deposits.some((d) => d.id === id)
}

/** How many deposits a withdrawal made now would hide among. */
export function crowdSize(scene: CrowdScene) {
  return scene.deposits.length
}

export function isShowingMine(scene: CrowdScene) {
  return scene.withdrawals.some((w) => w.source !== undefined)
}

export function drawCrowdScene(
  ctx: CanvasRenderingContext2D,
  scene: CrowdScene,
  {
    width,
    height,
    tokens,
  }: { width: number; height: number; tokens: ThemeTokens },
) {
  ctx.clearRect(0, 0, width, height)
  const left = 8
  const now = width - 28
  const withdrawY = 34
  const laneTop = 96
  const laneBottom = height - 34
  const x = (age: number) => now - (age / WINDOW_S) * (now - left)
  const depositPos = new Map(
    scene.deposits.map((d) => [
      d.id,
      { x: x(d.age), y: laneTop + d.lane * (laneBottom - laneTop) },
    ]),
  )

  // Lanes and the present
  ctx.fillStyle = alpha(tokens.divider, 0.25)
  ctx.beginPath()
  ctx.roundRect(
    left,
    laneTop - 12,
    now - left + 12,
    laneBottom - laneTop + 24,
    10,
  )
  ctx.fill()
  ctx.setLineDash([3, 4])
  ctx.strokeStyle = alpha(tokens.secondary, 0.6)
  ctx.beginPath()
  ctx.moveTo(now, 12)
  ctx.lineTo(now, height - 18)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.font = '600 10px Roboto, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = tokens.secondary
  ctx.textAlign = 'left'
  ctx.fillText('WITHDRAWALS', left, 12)
  ctx.fillText('DEPOSITS', left, laneTop - 22)
  ctx.fillText('← EARLIER', left, height - 8)
  ctx.textAlign = 'right'
  ctx.fillText('NOW', width - 2, height - 8)

  // Fans
  for (const w of scene.withdrawals) {
    const mine = w.source !== undefined
    const life = mine ? MY_FAN_S : FAN_S
    const fade = Math.min(1, (1 - w.age / life) * 2)
    const grow = Math.min(1, w.age / 0.35)
    const wx = x(w.age)
    const live = w.candidates.flatMap((id) => {
      const p = depositPos.get(id)
      return p ? [{ id, p }] : []
    })
    const single = w.candidates.length <= 1
    for (const { id, p } of live) {
      const own = id === w.source
      ctx.strokeStyle = own
        ? alpha(tokens.brand, fade)
        : single
          ? alpha('#ef4444', 0.8 * fade)
          : alpha(
              mine ? tokens.secondary : tokens.brand,
              (mine ? 0.3 : 0.28) * fade,
            )
      ctx.lineWidth = own || single ? 2 : 1
      ctx.beginPath()
      ctx.moveTo(wx, withdrawY)
      ctx.lineTo(wx + (p.x - wx) * grow, withdrawY + (p.y - withdrawY) * grow)
      ctx.stroke()
    }
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.arc(wx, withdrawY, 7, 0, Math.PI * 2)
    ctx.fillStyle = alpha(single ? '#ef4444' : tokens.brand, fade)
    ctx.fill()
    if (mine) {
      ctx.strokeStyle = alpha(tokens.brand, fade)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(wx, withdrawY, 11, 0, Math.PI * 2)
      ctx.stroke()
      ctx.lineWidth = 1
    }
    ctx.globalAlpha = fade
    ctx.font = '700 11px Roboto, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillStyle = single ? '#ef4444' : tokens.brand
    ctx.fillText(
      single ? 'linked' : `1 of ${w.candidates.length}`,
      wx - 12,
      withdrawY,
    )
    ctx.globalAlpha = 1
  }

  // Deposits
  for (const d of scene.deposits) {
    const p = depositPos.get(d.id)
    if (!p) continue
    const enter = Math.min(1, d.age / 0.3)
    const leave = Math.min(1, (WINDOW_S - d.age) / 1)
    ctx.globalAlpha = Math.min(enter, leave)
    ctx.beginPath()
    ctx.arc(p.x, p.y, d.mine ? 7 : 4.5 * (0.6 + 0.4 * enter), 0, Math.PI * 2)
    ctx.fillStyle = d.mine ? tokens.brand : alpha(tokens.secondary, 0.75)
    ctx.fill()
    if (d.mine) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2)
      ctx.strokeStyle = tokens.brand
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.lineWidth = 1
      ctx.font = '700 10px Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = tokens.brand
      ctx.fillText('YOU', p.x, p.y - 18)
    }
    ctx.globalAlpha = 1
  }
}
