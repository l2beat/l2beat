import type { PrivacyAdversaryId } from '@l2beat/config'
import type { ThemeTokens } from '~/hooks/useThemeTokens'
import { toRgba } from '~/utils/color'
import {
  drawEnvelope,
  EMPTY_S,
  type Envelope,
  envelopePoint,
  envelopeWidth,
  moveEnvelope,
  pickSlot,
  SEAL_S,
  SHUFFLE_EVERY_S,
  shuffleEnvelopes,
  stampPoint,
} from './poolEnvelopes'

/**
 * A made-up pool that never stops: senders deposit, coins wait inside, and
 * leave to fresh addresses. The pool's design decides what each adversary
 * can see; the drawing shows it through one adversary's eyes.
 */

export type Lens = PrivacyAdversaryId

/** The protocol choices the reader can change, one per adversary. */
export interface PoolDesign {
  /** A withdrawal can be linked to the deposit it spends, in public. */
  linksDeposit: boolean
  /** 0 (quiet) to 1 (busy). */
  traffic: number
  /** The client sends requests from the user's own IP to a public RPC. */
  publicRpc: boolean
  /** The operator holds keys that decrypt the pool. */
  viewingKeys: boolean
  /** Notes are protected by elliptic curves, which quantum attacks break. */
  ellipticCurves: boolean
}

/** A withdrawal with this many coins waiting, itself included, is caught. */
const CAUGHT_AT = 2

/**
 * Owner colours, from the site's chart palette; kept clear of the green,
 * yellow and red of the ratings and of the brand purple.
 */
export const OWNER_COLORS = [
  '#2a5bd8',
  '#36a3a3',
  '#9576d1',
  '#ef43b3',
  '#f98a24',
]
const HOME_IPS = [
  '84.21.7.13',
  '91.66.3.140',
  '5.180.22.9',
  '77.12.201.4',
  '212.8.45.77',
]

const OWNERS = OWNER_COLORS.length
/** The radius of a sender's or recipient's dot. */
const PERSON_R = 10
const TRAVEL_S = 1.4
const FADE_S = 0.8
/** How long a logged connection stays in the network observer's view. */
const LOG_S = 9
/** How long an archived note resists the future adversary. */
const CRACK_S = 0.9
/** How long a broken lock takes to spring open and fade. */
const UNLOCK_S = 0.6
/** How long the chain analyst's magnifier takes to reach a stamp. */
const MAGNIFIER_MOVE_S = 0.4
/** How long it stays on a stamp to read it. */
const MAGNIFIER_READ_S = 0.9

interface Note {
  id: number
  owner: number
  /** The fresh address it leaves to, never on the owner's own row. */
  recipient: number
  phase: 'in' | 'pool' | 'out' | 'done'
  /** Seconds in the current phase. */
  t: number
  stay: number
  /** Shown from the deposit until just after the withdrawal leaves it. */
  envelope: Envelope
  /** Seconds since the note reached the pool, kept after it leaves. */
  sincePool: number
  /** The chain analyst has read its stamp. */
  read: boolean
  inIp: string
  outIp: string
}

/** A connection the network observer logs: to the RPC or from the relayer. */
interface Request {
  side: 'in' | 'out'
  ip: string
  age: number
}

interface Trace {
  kind: 'fan' | 'caught' | 'link' | 'unknown'
  owner: number
  recipient: number
  candidates: number[]
  age: number
  life: number
}

export interface PoolScene {
  time: number
  spawnIn: number
  nextId: number
  shuffleIn: number
  /** The chain analyst's magnifier, moving between notes' stamps. */
  magnifier: { from?: number; to?: number; since: number }
  notes: Note[]
  traces: Trace[]
  requests: Request[]
  withdrawals: number
  /** Withdrawals that timing gave away. */
  caught: number
}

export function createPoolScene(design: PoolDesign): PoolScene {
  const scene: PoolScene = {
    time: 0,
    spawnIn: 0,
    nextId: 0,
    shuffleIn: SHUFFLE_EVERY_S,
    magnifier: { since: 0 },
    notes: [],
    traces: [],
    requests: [],
    withdrawals: 0,
    caught: 0,
  }
  for (let i = 0; i < 6 * 30; i++) stepPoolScene(scene, 1 / 30, design)
  return scene
}

export function stepPoolScene(
  scene: PoolScene,
  dt: number,
  design: PoolDesign,
) {
  scene.time += dt
  scene.spawnIn = Math.min(scene.spawnIn - dt, spawnInterval(design.traffic))
  if (scene.spawnIn <= 0) {
    scene.spawnIn = spawnInterval(design.traffic) * (0.7 + Math.random() * 0.6)
    const note = newNote(scene, design)
    scene.notes.push(note)
    scene.requests.push({ side: 'in', ip: note.inIp, age: 0 })
  }

  for (const note of scene.notes) {
    note.t += dt
    if (note.phase !== 'in') note.sincePool += dt
    if (note.phase === 'in' && note.t >= TRAVEL_S) {
      note.phase = 'pool'
      note.t = 0
    } else if (note.phase === 'pool' && note.t >= note.stay) {
      const waiting = scene.notes.filter((n) => n.phase === 'pool')
      const caught = waiting.length <= CAUGHT_AT
      scene.traces.push({
        kind: caught ? 'caught' : 'fan',
        owner: note.owner,
        recipient: note.recipient,
        candidates: waiting.map((n) => n.owner),
        age: 0,
        life: caught ? 2.6 : 1.8,
      })
      scene.withdrawals++
      if (caught) scene.caught++
      note.outIp = requestIp(note.owner, design)
      scene.requests.push({ side: 'out', ip: note.outIp, age: 0 })
      note.phase = 'out'
      note.t = 0
    } else if (note.phase === 'out' && note.t >= TRAVEL_S) {
      const { owner, recipient } = note
      scene.traces.push(
        { kind: 'link', owner, recipient, candidates: [], age: 0, life: 2 },
        {
          kind: 'unknown',
          owner,
          recipient,
          candidates: [],
          age: 0,
          life: 1.4,
        },
      )
      note.phase = 'done'
      note.t = 0
    }
  }
  scene.notes = scene.notes.filter((n) => n.phase !== 'done' || n.t < FADE_S)
  for (const note of scene.notes) moveEnvelope(note.envelope, dt)
  scene.shuffleIn -= dt
  if (scene.shuffleIn <= 0) {
    scene.shuffleIn = SHUFFLE_EVERY_S
    const movers = scene.notes.filter(canShuffle)
    shuffleEnvelopes(
      movers.map((n) => n.envelope),
      scene.notes
        .filter((n) => hasEnvelope(n) && !movers.includes(n))
        .map((n) => n.envelope),
    )
  }
  moveMagnifier(scene)

  for (const request of scene.requests) request.age += dt
  scene.requests = scene.requests.filter((r) => r.age < LOG_S)

  for (const trace of scene.traces) trace.age += dt
  scene.traces = scene.traces.filter((t) => t.age < t.life)
}

function newNote(scene: PoolScene, design: PoolDesign): Note {
  const owner = Math.floor(Math.random() * OWNERS)
  return {
    id: scene.nextId++,
    owner,
    recipient: (owner + 1 + Math.floor(Math.random() * (OWNERS - 1))) % OWNERS,
    phase: 'in',
    t: 0,
    stay: 2.5 + Math.random() * 5,
    envelope: {
      slot: pickSlot(
        scene.notes.filter(hasEnvelope).map((n) => n.envelope.slot),
      ),
    },
    sincePool: 0,
    read: false,
    inIp: requestIp(owner, design),
    outIp: '',
  }
}

function hasEnvelope(note: Note) {
  return (
    note.phase === 'in' ||
    note.phase === 'pool' ||
    (note.phase === 'out' && note.t < EMPTY_S)
  )
}

/** Sealed, and not about to open: it can swap places. */
function canShuffle(note: Note) {
  return (
    note.phase === 'pool' &&
    !note.envelope.move &&
    note.t > SEAL_S &&
    note.t < note.stay - 1
  )
}

/** 0 open, 1 sealed: it closes behind its coin and opens to let it out. */
function sealed(note: Note) {
  if (note.phase !== 'pool') return 0
  return Math.max(
    0,
    Math.min(1, note.t / SEAL_S, (note.stay - note.t) / SEAL_S),
  )
}

/**
 * Reads the stamp it sits on, then moves to another sealed envelope, unread
 * ones first. It also moves on when its envelope opens.
 */
function moveMagnifier(scene: PoolScene) {
  const { to, since } = scene.magnifier
  const target = scene.notes.find((n) => n.id === to)
  const reading = target !== undefined && sealed(target) === 1
  const elapsed = scene.time - since
  if (reading && elapsed >= MAGNIFIER_MOVE_S) target.read = true
  if (reading && elapsed < MAGNIFIER_MOVE_S + MAGNIFIER_READ_S) return
  const choices = scene.notes.filter(
    (n) => n.phase === 'pool' && sealed(n) === 1 && n.id !== to,
  )
  const unread = choices.filter((n) => !n.read)
  const next = (unread.length > 0 ? unread : choices)[
    Math.floor(Math.random() * (unread.length || choices.length))
  ]
  if (!next) return
  scene.magnifier = {
    from: target && hasEnvelope(target) ? to : undefined,
    to: next.id,
    since: scene.time,
  }
}

/** Seconds between deposits: from one every 3 s to three a second. */
function spawnInterval(traffic: number) {
  return 3 - traffic * 2.65
}

function requestIp(owner: number, design: PoolDesign) {
  return design.publicRpc ? (HOME_IPS[owner] ?? '') : torExit()
}

/**
 * The share of withdrawals that timing gives away at this traffic, from a
 * long run of the same pool, so the verdict holds still while the live
 * scene shows the catches.
 */
export function estimateCaughtShare(traffic: number) {
  const design: PoolDesign = {
    linksDeposit: false,
    traffic,
    publicRpc: false,
    viewingKeys: false,
    ellipticCurves: false,
  }
  const scene = createPoolScene(design)
  scene.withdrawals = 0
  scene.caught = 0
  for (let i = 0; i < 800 * 10; i++) stepPoolScene(scene, 1 / 10, design)
  return scene.withdrawals === 0 ? 1 : scene.caught / scene.withdrawals
}

function countWaiting(scene: PoolScene) {
  return scene.notes.filter((n) => n.phase === 'pool').length
}

interface DrawOptions {
  width: number
  height: number
  lens: Lens
  tokens: ThemeTokens
  design: PoolDesign
}

export function drawPoolScene(
  ctx: CanvasRenderingContext2D,
  scene: PoolScene,
  { width, height, lens, tokens, design }: DrawOptions,
) {
  const l = getLayout(width, height)
  ctx.clearRect(0, 0, width, height)

  const insider = lens === 'privilegedInsider'
  const future = lens === 'futureAdversary'
  const network = lens === 'networkObserver'
  const readsChain =
    lens === 'publicObserver' || lens === 'chainAnalyst' || future
  // What links this adversary can make, given the pool's design.
  const seesInside = insider && design.viewingKeys
  const breaksNotes = future && design.ellipticCurves
  const publicLinks = readsChain && design.linksDeposit
  const ipLinks = network && design.publicRpc
  const links = seesInside || breaksNotes || publicLinks || ipLinks
  const linkLabel = publicLinks
    ? 'linked'
    : ipLinks
      ? 'same IP'
      : breaksNotes
        ? 'key broken'
        : undefined

  // The network between people and pool exists only for the network
  // observer; the other views leave it as open ground for the coins.
  if (network) {
    for (const band of [l.leftBand, l.rightBand]) {
      ctx.beginPath()
      ctx.roundRect(band.x, l.top, band.width, l.bottom - l.top, 8)
      ctx.fillStyle = toRgba(tokens.brand, 0.08)
      ctx.fill()
    }
  }

  if (network && l.leftBand.width > 120) {
    for (const side of ['in', 'out'] as const) {
      const band = side === 'in' ? l.leftBand : l.rightBand
      const entries = scene.requests.filter((r) => r.side === side).slice(-7)
      ctx.font = '500 11px Roboto, sans-serif'
      ctx.textAlign = 'left'
      entries.forEach((entry, i) => {
        const fromBottom = entries.length - 1 - i
        const enter = Math.min(entry.age / 0.3, 1)
        const y = l.bottom - 14 - (fromBottom + enter - 1) * 16
        ctx.fillStyle = toRgba(tokens.brand, (1 - entry.age / LOG_S) * enter)
        ctx.fillText(
          `${entry.ip} to ${side === 'in' || design.publicRpc ? 'RPC' : 'relayer'}`,
          band.x + 10,
          y,
        )
      })
    }
  }

  ctx.beginPath()
  ctx.roundRect(l.pool.x, l.top, l.pool.width, l.bottom - l.top, 14)
  ctx.fillStyle = seesInside ? toRgba(tokens.brand, 0.1) : tokens.surface
  ctx.fill()
  // Outlined only for the operator, who can open it.
  if (seesInside) {
    ctx.lineWidth = 2
    ctx.strokeStyle = tokens.brand
    ctx.stroke()
    ctx.lineWidth = 1
  }

  // Headings
  ctx.font = '500 11px Roboto, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = tokens.secondary
  ctx.textAlign = 'left'
  ctx.fillText('Senders', 2, 14)
  ctx.textAlign = 'right'
  ctx.fillText('Recipients', width - 2, 14)
  ctx.textAlign = 'center'
  // The chain analyst's heading counts the waiting coins, drawn last.
  if (lens !== 'chainAnalyst') {
    ctx.fillText(
      insider
        ? 'The pool, as its operator sees it'
        : future
          ? 'The pool, read in 2040'
          : 'The pool',
      l.pool.x + l.pool.width / 2,
      14,
    )
  }
  if (network && l.leftBand.width > 90) {
    ctx.fillStyle = tokens.brand
    ctx.fillText('Network', l.leftBand.x + l.leftBand.width / 2, 14)
    ctx.fillText('Network', l.rightBand.x + l.rightBand.width / 2, 14)
  }

  // People: senders are public addresses, recipients fresh ones.
  for (let i = 0; i < OWNERS; i++) {
    const color = OWNER_COLORS[i] ?? tokens.secondary
    ctx.beginPath()
    ctx.arc(l.senderX, l.rowY(i), PERSON_R, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    const link = scene.traces.find(
      (t) => t.kind === 'link' && t.recipient === i,
    )
    const linkColor = link && links ? OWNER_COLORS[link.owner] : undefined
    ctx.beginPath()
    ctx.arc(l.recipientX, l.rowY(i), PERSON_R, 0, Math.PI * 2)
    ctx.fillStyle =
      link && linkColor
        ? toRgba(linkColor, 0.25 + 0.75 * (1 - link.age / link.life))
        : tokens.surface
    ctx.fill()
    ctx.strokeStyle = linkColor ?? tokens.divider
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 1
  }

  // Traces. Each runs from dot edge to dot edge; only the newest tag on a
  // recipient is drawn, so tags never stack.
  const tags = new Map<number, Parameters<typeof tag>>()
  for (const trace of scene.traces) {
    const fade = 1 - trace.age / trace.life
    const to = { x: l.recipientX, y: l.rowY(trace.recipient) }
    const from = (owner: number) => ({ x: l.senderX, y: l.rowY(owner) })
    const corner = (text: string, color: string, background: string) =>
      tags.set(trace.recipient, [
        ctx,
        text,
        to.x - 18,
        to.y - 18,
        { color, background, opacity: fade, align: 'right' },
      ])
    if (lens === 'chainAnalyst' && trace.kind === 'fan') {
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = toRgba(tokens.secondary, 0.45 * fade)
      for (const owner of new Set(trace.candidates)) {
        link(ctx, from(owner), to)
      }
      ctx.setLineDash([])
      corner(
        `1 of ${trace.candidates.length}`,
        tokens.secondary,
        tokens.surface,
      )
    }
    // The future adversary inherits every catch the chain analyst makes.
    if ((lens === 'chainAnalyst' || future) && trace.kind === 'caught') {
      ctx.strokeStyle = toRgba(tokens.negative, fade)
      ctx.lineWidth = 2
      link(ctx, from(trace.owner), to)
      ctx.lineWidth = 1
      corner('timing match', '#ffffff', tokens.negative)
    }
    if (links && trace.kind === 'link') {
      const color = OWNER_COLORS[trace.owner] ?? tokens.secondary
      ctx.strokeStyle = toRgba(color, 0.8 * fade)
      ctx.lineWidth = 2
      link(ctx, from(trace.owner), to)
      ctx.lineWidth = 1
      if (linkLabel) corner(linkLabel, '#ffffff', tokens.negative)
    }
    // The chain analyst and future adversary mark withdrawals with timing catches instead.
    if (
      !links &&
      trace.kind === 'unknown' &&
      lens !== 'chainAnalyst' &&
      !future
    ) {
      tags.set(trace.recipient, [
        ctx,
        '?',
        to.x,
        to.y - 20 - 6 * (1 - fade),
        {
          color: tokens.secondary,
          background: tokens.surface,
          opacity: fade,
          align: 'center',
        },
      ])
    }
  }
  for (const args of tags.values()) tag(...args)

  // Envelopes, lowest last so they overlap like a stack
  const envelopes = scene.notes
    .filter(hasEnvelope)
    .map((note) => ({ note, p: envelopePoint(l.tray, note.envelope) }))
    .sort((a, b) => a.p.y - b.p.y)
  for (const { note, p } of envelopes) {
    const cracked = breaksNotes && note.sincePool > CRACK_S
    const seal = sealed(note)
    const sealPoint = drawEnvelope(
      ctx,
      p,
      envelopeWidth(l.tray),
      {
        seal,
        tint:
          note.phase === 'pool' && (seesInside || cracked)
            ? OWNER_COLORS[note.owner]
            : undefined,
        stamp:
          lens === 'chainAnalyst' && note.read
            ? tokens.brand
            : toRgba(tokens.secondary, 0.35),
        opacity: note.phase === 'out' ? 1 - note.t / EMPTY_S : 1,
      },
      tokens,
    )
    if (lens === 'chainAnalyst' && note.read && note.phase === 'pool') {
      tag(
        ctx,
        `${Math.round(note.sincePool)}s ago`,
        p.x,
        // Just under the envelope, which is 0.68 of its width tall.
        p.y + envelopeWidth(l.tray) * 0.34 + 10,
        {
          color: tokens.brand,
          background: toRgba(tokens.brand, 0.12),
          opacity: 1,
          align: 'center',
        },
      )
    }
    // The future adversary's view: each envelope is locked by its
    // cryptography, and an elliptic-curve lock springs open once broken.
    if (future && note.phase === 'pool' && seal > 0.6) {
      const opened = breaksNotes ? (note.sincePool - CRACK_S) / UNLOCK_S : 0
      if (opened < 1) drawLock(ctx, sealPoint, Math.max(0, opened), tokens)
    }
  }

  if (lens === 'chainAnalyst') drawMagnifier(ctx, scene, l, tokens)

  // Coins, outside their envelopes
  for (const note of scene.notes) {
    if (note.phase === 'pool') continue
    const p = notePosition(note, l)
    const ownerColor = OWNER_COLORS[note.owner] ?? tokens.secondary
    const cracked = breaksNotes && note.sincePool > CRACK_S
    const left = note.phase === 'out' || note.phase === 'done'
    const revealed =
      note.phase === 'in' ||
      seesInside ||
      cracked ||
      ((publicLinks || ipLinks) && left)
    const opacity = note.phase === 'done' ? 1 - note.t / FADE_S : 1

    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = revealed ? ownerColor : tokens.secondary
    ctx.fill()

    if (network) {
      const inLeft = note.phase === 'in' && p.x < l.pool.x
      const inRight = note.phase === 'out' && p.x > l.pool.x + l.pool.width
      if (inLeft || inRight) {
        tag(ctx, inLeft ? note.inIp : note.outIp, p.x, p.y - 14, {
          color: tokens.brand,
          background: tokens.surface,
          opacity,
          align: 'center',
        })
      }
    }
    ctx.globalAlpha = 1
  }

  if (lens === 'chainAnalyst') {
    const waiting = countWaiting(scene)
    // In the heading, clear of the stamps on the envelopes below.
    tag(
      ctx,
      `${waiting} waiting in the pool`,
      l.pool.x + l.pool.width / 2,
      14,
      {
        color: waiting <= 2 ? '#ffffff' : tokens.secondary,
        background: waiting <= 2 ? tokens.negative : tokens.surface,
        opacity: 1,
        align: 'center',
      },
    )
  }
}

function getLayout(width: number, height: number) {
  const top = 28
  const bottom = height - 8
  const senderX = 22
  const recipientX = width - 22
  const poolWidth = Math.max(96, width * 0.3)
  const pool = { x: (width - poolWidth) / 2, width: poolWidth }
  const leftBand = { x: senderX + 18, width: pool.x - 12 - (senderX + 18) }
  const rightStart = pool.x + pool.width + 12
  const rightBand = { x: rightStart, width: recipientX - 18 - rightStart }
  const rowY = (i: number) => top + ((i + 0.5) * (bottom - top)) / OWNERS
  // Room above for open flaps, and below for the chain analyst's readings.
  const tray = {
    x: pool.x + 6,
    y: top + 16,
    width: pool.width - 12,
    height: bottom - top - 40,
  }
  return {
    top,
    bottom,
    senderX,
    recipientX,
    pool,
    tray,
    leftBand,
    rightBand,
    rowY,
  }
}

type Layout = ReturnType<typeof getLayout>

function notePosition(note: Note, l: Layout) {
  const inPool = envelopePoint(l.tray, note.envelope)
  if (note.phase === 'in' || note.phase === 'out') {
    const from =
      note.phase === 'in' ? { x: l.senderX, y: l.rowY(note.owner) } : inPool
    const to =
      note.phase === 'in'
        ? inPool
        : { x: l.recipientX, y: l.rowY(note.recipient) }
    const k = easeInOut(Math.min(note.t / TRAVEL_S, 1))
    return {
      x: from.x + (to.x - from.x) * k,
      y: from.y + (to.y - from.y) * k - Math.sin(Math.PI * k) * 14,
    }
  }
  if (note.phase === 'done') {
    return { x: l.recipientX, y: l.rowY(note.recipient) }
  }
  return inPool
}

/** The chain analyst's magnifier, gliding from one stamp to the next. */
function drawMagnifier(
  ctx: CanvasRenderingContext2D,
  scene: PoolScene,
  l: Layout,
  tokens: ThemeTokens,
) {
  const { from, to, since } = scene.magnifier
  const stampOf = (id: number | undefined) => {
    const note = scene.notes.find((n) => n.id === id && hasEnvelope(n))
    if (!note) return undefined
    return stampPoint(
      envelopePoint(l.tray, note.envelope),
      envelopeWidth(l.tray),
    )
  }
  const end = stampOf(to)
  if (!end) return
  const start = stampOf(from) ?? end
  const k = easeInOut(Math.min(1, (scene.time - since) / MAGNIFIER_MOVE_S))
  const x = start.x + (end.x - start.x) * k
  const y = start.y + (end.y - start.y) * k
  ctx.save()
  ctx.strokeStyle = tokens.brand
  ctx.fillStyle = toRgba(tokens.brand, 0.08)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(x, y, 11, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  line(ctx, { x: x + 8, y: y + 8 }, { x: x + 14, y: y + 14 })
  ctx.restore()
}

/**
 * A padlock on an envelope's seal; `open` from 0 (shut) to 1 (sprung open
 * and gone).
 */
function drawLock(
  ctx: CanvasRenderingContext2D,
  at: { x: number; y: number },
  open: number,
  tokens: ThemeTokens,
) {
  const { x, y } = at
  const lift = easeInOut(Math.min(1, open * 2)) * 3
  ctx.save()
  ctx.globalAlpha *= 1 - Math.max(0, open * 2 - 1)
  ctx.beginPath()
  ctx.arc(x, y, 5.5, 0, Math.PI * 2)
  ctx.fillStyle = tokens.secondary
  ctx.fill()
  ctx.fillStyle = tokens.surface
  ctx.fillRect(x - 2.5, y - 1, 5, 4)
  ctx.beginPath()
  ctx.arc(x, y - 1.5 - lift, 1.8, Math.PI, 0)
  ctx.strokeStyle = tokens.surface
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()
}

function tag(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: {
    color: string
    background: string
    opacity: number
    align: 'left' | 'center' | 'right'
  },
) {
  ctx.save()
  ctx.globalAlpha *= o.opacity
  ctx.font = '600 10px Roboto, sans-serif'
  const w = ctx.measureText(text).width + 10
  const aligned =
    o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x
  // Kept inside the canvas, which is narrow on phones.
  const left = Math.max(2, Math.min(ctx.canvas.clientWidth - w - 2, aligned))
  ctx.beginPath()
  ctx.roundRect(left, y - 8, w, 16, 8)
  ctx.fillStyle = o.background
  ctx.fill()
  ctx.fillStyle = o.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, left + w / 2, y + 0.5)
  ctx.restore()
}

/** A line between two people, stopping short of both dots. */
function link(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const gap = PERSON_R + 3
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  line(
    ctx,
    { x: from.x + (dx / length) * gap, y: from.y + (dy / length) * gap },
    { x: to.x - (dx / length) * gap, y: to.y - (dy / length) * gap },
  )
}

function line(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

function easeInOut(k: number) {
  return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
}

function torExit() {
  return `Tor ${185}.${220 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}
