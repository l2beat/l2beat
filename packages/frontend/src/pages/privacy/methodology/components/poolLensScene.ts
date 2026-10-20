import type { PrivacyAdversaryId } from '@l2beat/config'
import type { ThemeTokens } from '~/hooks/useThemeTokens'
import { alpha } from './canvasColor'
import {
  type DrumCoin,
  drawDrum,
  drawDrumGlare,
  dropCoin,
  drumPoint,
  tumble,
} from './poolDrum'

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

/** Owner colours; kept clear of the green, yellow and red of the ratings. */
export const OWNER_COLORS = [
  '#3b82f6',
  '#14b8a6',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
]
const CAUGHT_COLOR = '#ef4444'
/** The future adversary's quantum attack. */
const QUANTUM_CYAN = '#22d3ee'
const QUANTUM_VIOLET = '#a78bfa'
const QUANTUM_SPARKS = [QUANTUM_CYAN, QUANTUM_VIOLET, '#f0abfc']
const HOME_IPS = [
  '84.21.7.13',
  '91.66.3.140',
  '5.180.22.9',
  '77.12.201.4',
  '212.8.45.77',
]

const OWNERS = OWNER_COLORS.length
const TRAVEL_S = 1.4
const FADE_S = 0.8
/** How long a logged connection stays in the network observer's view. */
const LOG_S = 9
/** How long an archived note resists the future adversary. */
const CRACK_S = 0.9
/** How long a cracked note sparkles. */
const BURST_S = 0.8
/** How long a note takes to lose its colour in the drum. */
const MIX_S = 0.9
/** Old deposits that stay in the pool for good. */
const DORMANT = 6

interface Note {
  id: number
  owner: number
  /** The fresh address it leaves to, never on the owner's own row. */
  recipient: number
  phase: 'in' | 'pool' | 'out' | 'done'
  /** Seconds in the current phase. */
  t: number
  stay: number
  /**
   * An old deposit that never leaves. Timing ignores it: people tend to
   * withdraw soon after they deposit, so an analyst discounts old deposits.
   */
  dormant: boolean
  /** Where it tumbles in the drum. */
  coin: DrumCoin
  /** Seconds since the note reached the pool, kept after it leaves. */
  sincePool: number
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
    notes: [],
    traces: [],
    requests: [],
    withdrawals: 0,
    caught: 0,
  }
  for (let i = 0; i < DORMANT; i++) {
    scene.notes.push({
      ...newNote(scene, design),
      phase: 'pool',
      t: MIX_S,
      stay: Number.POSITIVE_INFINITY,
      dormant: true,
      // Long since cracked, if the future adversary can crack it.
      sincePool: CRACK_S + BURST_S,
    })
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
      const waiting = scene.notes.filter(isWaiting)
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
  tumble(
    scene.notes.filter((n) => n.phase === 'pool').map((n) => n.coin),
    dt,
  )

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
    dormant: false,
    coin: dropCoin(),
    sincePool: 0,
    inIp: requestIp(owner, design),
    outIp: '',
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

/** A recent deposit still in the pool: one timing counts. */
function isWaiting(note: Note) {
  return note.phase === 'pool' && !note.dormant
}

function countWaiting(scene: PoolScene) {
  return scene.notes.filter(isWaiting).length
}

interface DrawOptions {
  width: number
  height: number
  lens: Lens
  /** Seconds since the lens changed, for the sweep between views. */
  lensAge: number
  tokens: ThemeTokens
  design: PoolDesign
}

export function drawPoolScene(
  ctx: CanvasRenderingContext2D,
  scene: PoolScene,
  { width, height, lens, lensAge, tokens, design }: DrawOptions,
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

  // Zones
  for (const band of [l.leftBand, l.rightBand]) {
    ctx.fillStyle = network
      ? alpha(tokens.brand, 0.1)
      : alpha(tokens.divider, tokens.isDark ? 0.5 : 0.3)
    ctx.beginPath()
    ctx.roundRect(band.x, l.top, band.width, l.bottom - l.top, 8)
    ctx.fill()
    if (network) {
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = alpha(tokens.brand, 0.6)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  if (network && l.leftBand.width > 120) {
    for (const side of ['in', 'out'] as const) {
      const band = side === 'in' ? l.leftBand : l.rightBand
      const entries = scene.requests.filter((r) => r.side === side).slice(-7)
      ctx.font = '500 10px ui-monospace, monospace'
      ctx.textAlign = 'left'
      entries.forEach((entry, i) => {
        const fromBottom = entries.length - 1 - i
        const enter = Math.min(entry.age / 0.3, 1)
        const y = l.bottom - 14 - (fromBottom + enter - 1) * 16
        ctx.fillStyle = alpha(tokens.brand, (1 - entry.age / LOG_S) * enter)
        ctx.fillText(
          `${entry.ip} → ${side === 'in' || design.publicRpc ? 'RPC' : 'relayer'}`,
          band.x + 10,
          y,
        )
      })
    }
  }

  ctx.beginPath()
  ctx.roundRect(l.pool.x, l.top, l.pool.width, l.bottom - l.top, 14)
  ctx.fillStyle = seesInside ? alpha(tokens.brand, 0.1) : tokens.surface
  ctx.fill()
  ctx.lineWidth = seesInside ? 2 : 1
  ctx.strokeStyle = seesInside ? tokens.brand : tokens.divider
  ctx.stroke()
  ctx.lineWidth = 1
  drawDrum(ctx, l.drum, scene.time, tokens)
  if (future) drawQuantumScan(ctx, l, scene.time)

  // Headings
  ctx.font = '600 10px Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = tokens.secondary
  ctx.textAlign = 'left'
  ctx.fillText('SENDERS', 2, 14)
  ctx.textAlign = 'right'
  ctx.fillText('RECIPIENTS', width - 2, 14)
  ctx.textAlign = 'center'
  ctx.fillText(
    insider ? "POOL · OPERATOR'S VIEW" : future ? 'POOL · YEAR 2040' : 'POOL',
    l.pool.x + l.pool.width / 2,
    14,
  )
  if (l.leftBand.width > 90) {
    ctx.fillStyle = network ? tokens.brand : tokens.secondary
    ctx.fillText('NETWORK', l.leftBand.x + l.leftBand.width / 2, 14)
    ctx.fillText('NETWORK', l.rightBand.x + l.rightBand.width / 2, 14)
  }

  // People: senders are public addresses, recipients fresh ones.
  for (let i = 0; i < OWNERS; i++) {
    const color = OWNER_COLORS[i] ?? tokens.secondary
    ctx.beginPath()
    ctx.arc(l.senderX, l.rowY(i), 10, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    const link = scene.traces.find(
      (t) => t.kind === 'link' && t.recipient === i,
    )
    const linkColor = link && links ? OWNER_COLORS[link.owner] : undefined
    ctx.beginPath()
    ctx.arc(l.recipientX, l.rowY(i), 10, 0, Math.PI * 2)
    ctx.fillStyle =
      link && linkColor
        ? alpha(linkColor, 0.25 + 0.75 * (1 - link.age / link.life))
        : tokens.surface
    ctx.fill()
    ctx.strokeStyle = linkColor ?? tokens.divider
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 1
  }

  // Traces
  for (const trace of scene.traces) {
    const fade = 1 - trace.age / trace.life
    const to = { x: l.recipientX, y: l.rowY(trace.recipient) }
    if (lens === 'chainAnalyst' && trace.kind === 'fan') {
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = alpha(tokens.secondary, 0.45 * fade)
      for (const owner of new Set(trace.candidates)) {
        line(ctx, { x: l.senderX + 12, y: l.rowY(owner) }, to)
      }
      ctx.setLineDash([])
      tag(ctx, `1 of ${trace.candidates.length}`, to.x - 18, to.y - 18, {
        color: tokens.secondary,
        background: tokens.surface,
        opacity: fade,
        align: 'right',
      })
    }
    // The future adversary inherits every catch the chain analyst makes.
    if ((lens === 'chainAnalyst' || future) && trace.kind === 'caught') {
      ctx.strokeStyle = alpha(CAUGHT_COLOR, fade)
      ctx.lineWidth = 2
      line(ctx, { x: l.senderX + 12, y: l.rowY(trace.owner) }, to)
      ctx.lineWidth = 1
      tag(ctx, 'timing match', to.x - 18, to.y - 18, {
        color: '#ffffff',
        background: CAUGHT_COLOR,
        opacity: fade,
        align: 'right',
      })
    }
    if (links && trace.kind === 'link') {
      const color = OWNER_COLORS[trace.owner] ?? tokens.secondary
      const from = { x: l.senderX + 12, y: l.rowY(trace.owner) }
      if (breaksNotes) {
        drawQuantumBeam(ctx, from, to, color, scene.time, fade)
      } else {
        ctx.strokeStyle = alpha(color, 0.8 * fade)
        ctx.lineWidth = 2
        line(ctx, from, to)
        ctx.lineWidth = 1
      }
      if (linkLabel) {
        tag(ctx, linkLabel, to.x - 18, to.y - 18, {
          color: '#ffffff',
          background: CAUGHT_COLOR,
          opacity: fade,
          align: 'right',
        })
      }
    }
    // The chain analyst and future adversary mark withdrawals with timing catches instead.
    if (
      !links &&
      trace.kind === 'unknown' &&
      lens !== 'chainAnalyst' &&
      !future
    ) {
      tag(ctx, '?', to.x, to.y - 20 - 6 * (1 - fade), {
        color: tokens.secondary,
        background: tokens.surface,
        opacity: fade,
        align: 'center',
      })
    }
  }

  // Coins
  for (const note of scene.notes) {
    const p = notePosition(note, l)
    const ownerColor = OWNER_COLORS[note.owner] ?? tokens.secondary
    const cracked = breaksNotes && note.sincePool > CRACK_S
    const left = note.phase === 'out' || note.phase === 'done'
    const revealed =
      note.phase === 'in' ||
      seesInside ||
      cracked ||
      ((publicLinks || ipLinks) && left)
    // The chain analyst discounts dormant deposits, so they fade in its view.
    const opacity =
      note.phase === 'done'
        ? 1 - note.t / FADE_S
        : note.dormant && lens === 'chainAnalyst'
          ? 0.35
          : 1
    // A hidden coin loses its colour as it tumbles, not all at once.
    const tint = revealed
      ? 1
      : note.phase === 'pool'
        ? Math.max(0, 1 - note.t / MIX_S)
        : 0

    if (note.phase === 'in' || note.phase === 'out') {
      for (let k = 1; k <= 5; k++) {
        const past = notePosition(
          { ...note, t: Math.max(0, note.t - k * 0.035) },
          l,
        )
        ctx.globalAlpha = (opacity * 0.12 * (6 - k)) / 5
        ctx.beginPath()
        ctx.arc(past.x, past.y, 6 - k * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = revealed ? ownerColor : tokens.secondary
        ctx.fill()
      }
    }
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = alpha(tokens.secondary, 0.6)
    ctx.fill()
    if (tint > 0) {
      ctx.globalAlpha = opacity * tint
      ctx.shadowColor = ownerColor
      ctx.shadowBlur = 10
      ctx.fillStyle = ownerColor
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = opacity
    }

    if (future && note.phase !== 'in') {
      if (!cracked) {
        drawLock(ctx, p.x, p.y, tokens.surface)
        if (!design.ellipticCurves) drawShieldGlint(ctx, p, l, scene.time)
      } else if (note.sincePool < CRACK_S + BURST_S) {
        drawQuantumBurst(ctx, p, (note.sincePool - CRACK_S) / BURST_S, note.id)
      }
    }

    if (network) {
      const inLeft = note.phase === 'in' && inside(p.x, l.leftBand)
      const inRight = note.phase === 'out' && inside(p.x, l.rightBand)
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
  drawDrumGlare(ctx, l.drum, tokens)

  if (lens === 'chainAnalyst') {
    const waiting = countWaiting(scene)
    tag(ctx, `${waiting} waiting`, l.pool.x + l.pool.width / 2, l.bottom - 12, {
      color: waiting <= 2 ? '#ffffff' : tokens.secondary,
      background: waiting <= 2 ? CAUGHT_COLOR : tokens.surface,
      opacity: 1,
      align: 'center',
    })
  }

  // A sweep across the scene when the view changes.
  if (lensAge < 0.6) {
    const x = (lensAge / 0.6) * (width + 120) - 60
    const gradient = ctx.createLinearGradient(x - 60, 0, x + 60, 0)
    gradient.addColorStop(0, alpha(tokens.brand, 0))
    gradient.addColorStop(0.5, alpha(tokens.brand, 0.22))
    gradient.addColorStop(1, alpha(tokens.brand, 0))
    ctx.fillStyle = gradient
    ctx.fillRect(x - 60, 0, 120, height)
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
  const drum = {
    x: pool.x + pool.width / 2,
    y: (top + bottom) / 2,
    r: Math.min(pool.width, bottom - top) / 2 - 10,
  }
  return {
    top,
    bottom,
    senderX,
    recipientX,
    pool,
    drum,
    leftBand,
    rightBand,
    rowY,
  }
}

type Layout = ReturnType<typeof getLayout>

function notePosition(note: Note, l: Layout) {
  const inDrum = drumPoint(l.drum, note.coin)
  if (note.phase === 'in' || note.phase === 'out') {
    const from =
      note.phase === 'in' ? { x: l.senderX, y: l.rowY(note.owner) } : inDrum
    const to =
      note.phase === 'in'
        ? inDrum
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
  return inDrum
}

/** The height of the future adversary's scan across the pool. */
function quantumScanY(l: Layout, time: number) {
  const k = (time % 3.2) / 3.2
  return l.top + k * (l.bottom - l.top)
}

function drawQuantumScan(
  ctx: CanvasRenderingContext2D,
  l: Layout,
  time: number,
) {
  const y = quantumScanY(l, time)
  ctx.save()
  const gradient = ctx.createLinearGradient(0, y - 18, 0, y + 2)
  gradient.addColorStop(0, alpha(QUANTUM_CYAN, 0))
  gradient.addColorStop(1, alpha(QUANTUM_CYAN, 0.22))
  ctx.fillStyle = gradient
  ctx.fillRect(l.pool.x + 1, y - 18, l.pool.width - 2, 20)
  ctx.shadowColor = QUANTUM_CYAN
  ctx.shadowBlur = 8
  ctx.strokeStyle = alpha(QUANTUM_CYAN, 0.7)
  line(ctx, { x: l.pool.x + 6, y }, { x: l.pool.x + l.pool.width - 6, y })
  ctx.restore()
}

/** A post-quantum note: the scan glances off its shield. */
function drawShieldGlint(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number },
  l: Layout,
  time: number,
) {
  const near = 1 - Math.abs(p.y - quantumScanY(l, time)) / 16
  if (near <= 0) return
  ctx.save()
  ctx.globalAlpha *= near
  ctx.shadowColor = QUANTUM_CYAN
  ctx.shadowBlur = 10
  ctx.strokeStyle = QUANTUM_CYAN
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i <= 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6
    const x = p.x + Math.cos(a) * 10
    const y = p.y + Math.sin(a) * 10
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.restore()
}

/** An elliptic-curve note breaking open, `k` from 0 to 1. */
function drawQuantumBurst(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number },
  k: number,
  seed: number,
) {
  ctx.save()
  ctx.globalAlpha *= 1 - k
  ctx.shadowColor = QUANTUM_VIOLET
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.arc(p.x, p.y, 6 + k * 14, 0, Math.PI * 2)
  ctx.strokeStyle = QUANTUM_CYAN
  ctx.lineWidth = 2 * (1 - k) + 0.5
  ctx.stroke()
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7 + seed
    const d = 4 + easeOut(k) * (14 + (i % 3) * 5)
    sparkle(
      ctx,
      p.x + Math.cos(a) * d,
      p.y + Math.sin(a) * d,
      3.2 * (1 - k) + 0.8,
      QUANTUM_SPARKS[i % QUANTUM_SPARKS.length] ?? QUANTUM_CYAN,
    )
  }
  ctx.restore()
}

/** The link a quantum attack recovers: a shimmering, sparkling beam. */
function drawQuantumBeam(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  time: number,
  fade: number,
) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const at = (s: number, wave: number) => ({
    x: from.x + dx * s - (dy / length) * wave,
    y: from.y + dy * s + (dx / length) * wave,
  })
  ctx.save()
  ctx.globalAlpha *= fade
  const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.5, QUANTUM_CYAN)
  gradient.addColorStop(1, color)
  ctx.strokeStyle = gradient
  ctx.shadowColor = QUANTUM_VIOLET
  ctx.shadowBlur = 10
  for (const [phase, width] of [
    [0, 2],
    [Math.PI, 1],
  ] as const) {
    ctx.lineWidth = width
    ctx.beginPath()
    for (let i = 0; i <= 48; i++) {
      const s = i / 48
      const wave =
        Math.sin(Math.PI * s) * 4 * Math.sin(s * 22 - time * 9 + phase)
      const point = at(s, wave)
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    }
    ctx.stroke()
  }
  for (let i = 0; i < 4; i++) {
    const s = (time * 0.7 + i / 4) % 1
    const point = at(s, 0)
    sparkle(ctx, point.x, point.y, 3.5, '#ffffff')
  }
  ctx.restore()
}

/** A four-pointed star. */
function sparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.quadraticCurveTo(x, y, x + size, y)
  ctx.quadraticCurveTo(x, y, x, y + size)
  ctx.quadraticCurveTo(x, y, x - size, y)
  ctx.quadraticCurveTo(x, y, x, y - size)
  ctx.fillStyle = color
  ctx.fill()
}

function drawLock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.fillRect(x - 2.5, y - 1, 5, 4)
  ctx.beginPath()
  ctx.arc(x, y - 1.5, 1.8, Math.PI, 0)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.lineWidth = 1
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
  const left =
    o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x
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

function inside(x: number, band: { x: number; width: number }) {
  return x >= band.x && x <= band.x + band.width
}

function easeOut(k: number) {
  return 1 - (1 - k) ** 3
}

function easeInOut(k: number) {
  return k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2
}

function torExit() {
  return `Tor ${185}.${220 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}
