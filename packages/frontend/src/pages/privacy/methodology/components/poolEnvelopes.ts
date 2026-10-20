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

/** Where an envelope sits, hopping between slots. */
export function envelopePoint(tray: Tray, envelope: Envelope) {
  const at = slotPoint(tray, envelope.slot)
  if (!envelope.move) return at
  const from = slotPoint(tray, envelope.move.from)
  const k = easeInOut(envelope.move.t)
  return {
    x: from.x + (at.x - from.x) * k,
    y: from.y + (at.y - from.y) * k - Math.sin(Math.PI * k) * 14,
  }
}

export function envelopeWidth(tray: Tray) {
  return Math.min(32, (tray.width / COLS) * 0.7)
}

interface EnvelopeLook {
  /** 0 open, 1 sealed. */
  seal: number
  /** The owner's colour, for an adversary who can read the envelope. */
  tint?: string
  /** The stamp's colour. Every envelope carries one: its metadata. */
  stamp: string
  opacity: number
}

/**
 * Draws an envelope as a line icon, in one even stroke like the site's icons,
 * and returns where its seal is.
 */
export function drawEnvelope(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number },
  w: number,
  look: EnvelopeLook,
  tokens: ThemeTokens,
) {
  const h = w * 0.68
  const top = p.y - h / 2
  // The flap folds down over the envelope when sealed and up when open.
  const tipY = top + h * 0.55 * (2 * look.seal - 1)
  ctx.save()
  ctx.globalAlpha *= look.opacity
  ctx.lineWidth = 1.6
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = look.tint ?? tokens.secondary

  ctx.beginPath()
  ctx.roundRect(p.x - w / 2, top, w, h, 3)
  ctx.fillStyle = tokens.surface
  ctx.fill()
  if (look.tint) {
    ctx.fillStyle = alpha(look.tint, 0.2)
    ctx.fill()
  }
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(p.x - w / 2 + 1, top + 1)
  ctx.lineTo(p.x, tipY)
  ctx.lineTo(p.x + w / 2 - 1, top + 1)
  ctx.stroke()

  const stamp = stampPoint(p, w)
  const size = w * 0.19
  ctx.beginPath()
  ctx.roundRect(stamp.x - size / 2, stamp.y - size / 2, size, size, 1)
  ctx.fillStyle = look.stamp
  ctx.fill()
  ctx.restore()
  return { x: p.x, y: tipY }
}

/** The stamp sits in the lower right, clear of the flap's crease. */
export function stampPoint(p: { x: number; y: number }, w: number) {
  return { x: p.x + w * 0.29, y: p.y + w * 0.15 }
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
