import type { ThemeTokens } from '~/hooks/useThemeTokens'
import { alpha } from './canvasColor'

/**
 * The pool keeps each deposit in a sealed envelope, the way a note's
 * commitment hides what it holds, and every envelope looks the same. Now and
 * then the sealed ones swap places, so where one sits says nothing either.
 */

const COLS = 4
const ROWS = 6
const ALL_SLOTS = Array.from({ length: COLS * ROWS }, (_, i) => i)
/** Seconds an envelope takes to close behind its coin, or to open again. */
export const SEAL_S = 0.3
/** Seconds an emptied envelope takes to fade. */
export const EMPTY_S = 0.6
export const SHUFFLE_EVERY_S = 2.4
const MOVE_S = 0.7

export interface Envelope {
  slot: number
  move?: { from: number; t: number }
}

export interface Tray {
  x: number
  y: number
  width: number
  height: number
}

/** A free slot, or any slot when the tray is full. */
export function pickSlot(taken: number[]) {
  const free = ALL_SLOTS.filter((slot) => !taken.includes(slot))
  const from = free.length > 0 ? free : ALL_SLOTS
  return from[Math.floor(Math.random() * from.length)] ?? 0
}

/** Sends `movers` to new slots among their own and any no one holds. */
export function shuffleEnvelopes(movers: Envelope[], holders: Envelope[]) {
  const held = holders.map((e) => e.slot)
  const open = ALL_SLOTS.filter((slot) => !held.includes(slot)).sort(
    () => Math.random() - 0.5,
  )
  movers.forEach((envelope, i) => {
    const slot = open[i]
    if (slot === undefined) return
    envelope.move = { from: envelope.slot, t: 0 }
    envelope.slot = slot
  })
}

export function moveEnvelope(envelope: Envelope, dt: number) {
  if (!envelope.move) return
  envelope.move.t += dt / MOVE_S
  if (envelope.move.t >= 1) envelope.move = undefined
}

/** Where an envelope sits, hopping between slots; `bob` lifts it a little. */
export function envelopePoint(tray: Tray, envelope: Envelope, bob = 0) {
  const at = slotPoint(tray, envelope.slot)
  if (!envelope.move) return { x: at.x, y: at.y - bob }
  const from = slotPoint(tray, envelope.move.from)
  const k = easeInOut(envelope.move.t)
  return {
    x: from.x + (at.x - from.x) * k,
    y: from.y + (at.y - from.y) * k - Math.sin(Math.PI * k) * 14 - bob,
  }
}

export function envelopeWidth(tray: Tray) {
  return Math.min(38, (tray.width / COLS) * 0.78)
}

interface EnvelopeLook {
  /** 0 open, 1 sealed. */
  seal: number
  /** 0 to 1: a little swell as it seals. */
  pop: number
  /** The owner's colour, for an adversary who can read the envelope. */
  tint?: string
  /** A heart on the seal; off when something else marks it. */
  heart: boolean
  opacity: number
}

/** Draws an envelope and returns where its seal is. */
export function drawEnvelope(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number },
  width: number,
  look: EnvelopeLook,
  tokens: ThemeTokens,
) {
  const scale = 1 + 0.18 * look.pop
  const w = width * scale
  const h = w * 0.68
  const tipY = p.y - h / 2 + h * 0.62 * (2 * look.seal - 1)
  const paper = tokens.isDark ? tokens.surfaceSecondary : '#ffffff'
  const edge = alpha(tokens.secondary, 0.35)
  ctx.save()
  ctx.globalAlpha *= look.opacity
  ctx.lineJoin = 'round'
  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.ellipse(p.x, p.y + h / 2 + 2, w * 0.42, 2, 0, 0, Math.PI * 2)
  ctx.fillStyle = alpha(tokens.secondary, 0.12)
  ctx.fill()

  const paint = () => {
    ctx.fillStyle = paper
    ctx.fill()
    if (look.tint) {
      ctx.fillStyle = alpha(look.tint, 0.35)
      ctx.fill()
    }
    ctx.strokeStyle = edge
    ctx.stroke()
  }
  const flap = () => {
    ctx.beginPath()
    ctx.moveTo(p.x - w / 2, p.y - h / 2)
    ctx.lineTo(p.x + w / 2, p.y - h / 2)
    ctx.lineTo(p.x, tipY)
    ctx.closePath()
    paint()
  }
  // An open flap stands behind the envelope; a closed one folds over it.
  if (look.seal < 0.5) flap()
  ctx.beginPath()
  ctx.roundRect(p.x - w / 2, p.y - h / 2, w, h, 3.5)
  paint()
  ctx.beginPath()
  ctx.moveTo(p.x - w / 2, p.y + h / 2)
  ctx.lineTo(p.x, p.y + h * 0.05)
  ctx.lineTo(p.x + w / 2, p.y + h / 2)
  ctx.strokeStyle = alpha(tokens.secondary, 0.2)
  ctx.stroke()
  if (look.seal >= 0.5) flap()

  const mark = Math.max(0, (look.seal - 0.6) / 0.4)
  if (look.heart && mark > 0) {
    ctx.fillStyle = tokens.brand
    heart(ctx, p.x, tipY, w * 0.13 * mark)
  }
  ctx.restore()
  return { x: p.x, y: tipY }
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + r)
  ctx.bezierCurveTo(
    x - r * 1.6,
    y - r * 0.2,
    x - r * 0.6,
    y - r * 1.4,
    x,
    y - r * 0.5,
  )
  ctx.bezierCurveTo(
    x + r * 0.6,
    y - r * 1.4,
    x + r * 1.6,
    y - r * 0.2,
    x,
    y + r,
  )
  ctx.fill()
}

function slotPoint(tray: Tray, slot: number) {
  const col = slot % COLS
  const row = Math.floor(slot / COLS)
  return {
    x: tray.x + ((col + 0.5) * tray.width) / COLS,
    y: tray.y + ((row + 0.5) * tray.height) / ROWS,
  }
}

function easeInOut(k: number) {
  return k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
}
