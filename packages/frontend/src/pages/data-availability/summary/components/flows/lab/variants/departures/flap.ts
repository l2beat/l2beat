export type FlapTone = 'plain' | 'amber'

interface FlapFace {
  char: string
  tone: FlapTone
}

/** The four faces of a tile, as the tile component lays them out */
export interface TileFaces {
  /** The whole character the tile turns to, behind everything */
  back: HTMLElement
  /** The old bottom half, there until the landing leaf covers it */
  under: HTMLElement
  /** The leaf falling with the old top half */
  falling: HTMLElement
  /** The leaf landing with the new bottom half */
  landing: HTMLElement
}

/** One leaf falls in this long. A far letter takes a few leaves */
const LEAF_MS = 80

// The leaves of a tile's drum, in the order it turns through them. Letters
// go round one way only. A clock counts up and a countdown down, so digits
// turn either way, which makes each tick a single leaf
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'

// The leaf hinges on the middle of the tile and falls towards the reader
const PERSPECTIVE = 'perspective(160px)'
const FALL: Keyframe[] = [
  { transform: `${PERSPECTIVE} rotateX(0deg)` },
  { transform: `${PERSPECTIVE} rotateX(-90deg)` },
]
const LAND: Keyframe[] = [
  { transform: `${PERSPECTIVE} rotateX(90deg)` },
  { transform: `${PERSPECTIVE} rotateX(0deg)` },
]

/**
 * Turns one tile of the board, leaf by leaf, until it shows its target. The
 * leaves are animated on the compositor and never through React, so a whole
 * board can clatter without a render. A new target while it turns is picked
 * up by the next leaf, as a real tile would.
 */
export class Flap {
  private shown: FlapFace
  private target: FlapFace
  private timer: ReturnType<typeof setTimeout> | undefined
  /** Made on the first leaf, then replayed for every leaf after it */
  private leaf: { fall: Animation; land: Animation } | undefined
  private isTurning = false
  // tiles of one word land a little apart, as on a real board
  private readonly maxLeaves: number

  constructor(
    private readonly faces: TileFaces,
    seed: number,
  ) {
    this.maxLeaves = 2 + (seed % 3)
    // a tile kept through a resize goes on from what it shows
    this.shown = readFace(faces.back)
    this.target = this.shown
  }

  differsFrom(face: FlapFace): boolean {
    return face.char !== this.target.char || face.tone !== this.target.tone
  }

  /** Turns to `face` after `delay` ms, or at once without a delay */
  turnTo(face: FlapFace, delay: number | undefined) {
    this.target = face
    if (delay === undefined) {
      this.stop()
      this.show(face)
      return
    }
    if (this.timer !== undefined || this.isTurning) return
    if (face.char === this.shown.char) {
      this.show(face)
      return
    }
    this.timer = setTimeout(() => {
      this.timer = undefined
      this.isTurning = true
      this.setLeavesVisible(true)
      this.turnLeaf()
    }, delay)
  }

  stop() {
    clearTimeout(this.timer)
    this.timer = undefined
    this.leaf?.fall.cancel()
    this.leaf?.land.cancel()
    this.isTurning = false
    this.setLeavesVisible(false)
  }

  private turnLeaf() {
    const from = this.shown
    if (from.char === this.target.char) {
      this.stop()
      this.show(this.target)
      return
    }
    const to: FlapFace = {
      char: nextChar(from.char, this.target.char, this.maxLeaves),
      tone: this.target.tone,
    }
    const { back, under, falling, landing } = this.faces
    paint(back, to)
    paint(under, from)
    paint(falling, from)
    paint(landing, to)

    const leaf = this.playLeaf()
    leaf.land.onfinish = () => {
      this.shown = to
      this.turnLeaf()
    }
  }

  private playLeaf() {
    if (this.leaf) {
      this.leaf.fall.play()
      this.leaf.land.play()
      return this.leaf
    }
    const half = LEAF_MS / 2
    this.leaf = {
      fall: this.faces.falling.animate(FALL, {
        duration: half,
        // gravity: it gathers speed on the way down
        easing: 'cubic-bezier(0.5, 0, 1, 1)',
        fill: 'forwards',
      }),
      land: this.faces.landing.animate(LAND, {
        duration: half,
        delay: half,
        easing: 'cubic-bezier(0, 0, 0.3, 1)',
        fill: 'backwards',
      }),
    }
    return this.leaf
  }

  private show(face: FlapFace) {
    this.shown = face
    paint(this.faces.back, face)
  }

  private setLeavesVisible(visible: boolean) {
    const visibility = visible ? 'visible' : 'hidden'
    for (const face of [
      this.faces.under,
      this.faces.falling,
      this.faces.landing,
    ]) {
      if (face.style.visibility !== visibility)
        face.style.visibility = visibility
    }
  }
}

/**
 * The character a tile shows next on its way from `from` to `to`. A tile
 * lands through the few leaves just before its target, which is what the eye
 * catches, and skips the rest of the drum. Blanks and signs have no
 * neighbours worth showing, so they drop straight in.
 */
function nextChar(from: string, to: string, maxLeaves: number): string {
  const drum = LETTERS.includes(to)
    ? LETTERS
    : DIGITS.includes(to)
      ? DIGITS
      : ''
  if (from === to || drum === '') return to
  const size = drum.length
  const end = drum.indexOf(to)
  const start = drum.indexOf(from)
  // from a blank or the other drum, the tile picks the drum up a few leaves early
  if (start < 0) return drum.at(end - maxLeaves + 1) ?? to

  const forward = (end - start + size) % size
  const backward = (start - end + size) % size
  const direction = drum === DIGITS && backward < forward ? -1 : 1
  const distance = direction === 1 ? forward : backward
  const index =
    distance <= maxLeaves
      ? start + direction
      : end - direction * (maxLeaves - 1)
  return drum.at(index % size) ?? to
}

function readFace(face: HTMLElement): FlapFace {
  return {
    char: face.dataset.char ?? ' ',
    tone: face.dataset.tone === 'amber' ? 'amber' : 'plain',
  }
}

// every write restyles the face, and most leaves change only some of them
function paint(face: HTMLElement, { char, tone }: FlapFace) {
  if (face.dataset.char !== char) face.dataset.char = char
  if (face.dataset.tone !== tone) face.dataset.tone = tone
}
