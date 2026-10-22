import type { MergeView } from '@codemirror/merge'
import { EditorView } from '@codemirror/view'
import { assert } from '@l2beat/shared-pure'
import colors from '../../../colors.json'
import type { LineRangeMapping } from './utils/diffFilter'

const MARK_HEIGHT_MIN = 2
const BOX_HEIGHT_MIN = 8
const SNAP_DISTANCE_MAX = 4
const SCROLL_SETTLE_MS = 150

interface Band {
  top: number
  bottom: number
}

interface StripLayout {
  removed: Band[]
  added: Band[]
  contentHeight: number
  viewportHeight: number
  width: number
  height: number
  pixelRatio: number
}

// Like Monaco's diff overview ruler: removed lines in the left lane, added
// lines in the right one, and a box over the part in view. Marks redraw only
// when the layout changes; scrolling moves just the box.
export class ChangeStrip {
  readonly dom = document.createElement('div')
  // Scrolling refines the estimated heights of the lines it brings into view,
  // which moves marks by a fraction of a pixel, so those wait for it to stop.
  readonly extension = EditorView.updateListener.of((update) => {
    if (!update.geometryChanged) {
      return
    }
    if (update.viewportChanged && update.transactions.length === 0) {
      clearTimeout(this.settleTimeout)
      this.settleTimeout = setTimeout(() => this.schedule(), SCROLL_SETTLE_MS)
    } else {
      this.schedule()
    }
  })
  private readonly canvas = document.createElement('canvas')
  private readonly box = document.createElement('div')
  private readonly resizeObserver = new ResizeObserver(() => this.schedule())
  private mergeView: MergeView | undefined
  private changes: LineRangeMapping[] = []
  private layout: StripLayout | undefined
  private settleTimeout: ReturnType<typeof setTimeout> | undefined

  constructor() {
    this.dom.className = 'relative order-last w-4 shrink-0 bg-coffee-800'
    this.canvas.className = 'pointer-events-none absolute inset-0 size-full'
    this.box.className =
      'pointer-events-none absolute inset-x-0 top-0 bg-coffee-200/40'
    this.dom.append(this.canvas, this.box)
    this.dom.addEventListener('pointerdown', (event) => {
      this.dom.setPointerCapture(event.pointerId)
      this.scrollTo(event, true)
    })
    this.dom.addEventListener('pointermove', (event) => {
      if (this.dom.hasPointerCapture(event.pointerId)) {
        this.scrollTo(event, false)
      }
    })
    this.resizeObserver.observe(this.dom)
  }

  attach(mergeView: MergeView, changes: LineRangeMapping[]) {
    this.mergeView = mergeView
    this.changes = changes
    this.layout = undefined
    mergeView.dom.addEventListener('scroll', () => this.moveBox(), {
      passive: true,
    })
  }

  // Keyed, so any number of calls in a frame cost one measure.
  schedule() {
    const mergeView = this.mergeView
    mergeView?.b.requestMeasure({
      key: this,
      read: () => this.read(mergeView),
      write: (layout) => this.draw(layout),
    })
  }

  dispose() {
    clearTimeout(this.settleTimeout)
    this.resizeObserver.disconnect()
    this.dom.remove()
    this.mergeView = undefined
  }

  private read(mergeView: MergeView): StripLayout {
    const scroller = mergeView.dom
    const contentTop = scroller.getBoundingClientRect().top - scroller.scrollTop
    return {
      removed: bands(mergeView.a, contentTop, this.changes, 'original'),
      added: bands(mergeView.b, contentTop, this.changes, 'modified'),
      contentHeight: scroller.scrollHeight,
      viewportHeight: scroller.clientHeight,
      width: this.dom.clientWidth,
      height: this.dom.clientHeight,
      pixelRatio: window.devicePixelRatio,
    }
  }

  private draw(layout: StripLayout) {
    this.canvas.width = Math.round(layout.width * layout.pixelRatio)
    this.canvas.height = Math.round(layout.height * layout.pixelRatio)
    if (layout.contentHeight === 0 || layout.height === 0) {
      this.layout = undefined
      return
    }
    this.layout = layout
    const context = this.canvas.getContext('2d')
    assert(context !== null, 'No 2d context')
    context.scale(layout.pixelRatio, layout.pixelRatio)
    const laneWidth = layout.width / 2
    const lanes = [
      [layout.removed, 0, colors.aux.red],
      [layout.added, laneWidth, colors.aux.green],
    ] as const
    for (const [bands, left, color] of lanes) {
      context.fillStyle = color
      for (const band of bands) {
        const mark = toStripRange(
          band,
          layout.contentHeight,
          layout.height,
          MARK_HEIGHT_MIN,
        )
        context.fillRect(left, mark.top, laneWidth, mark.height)
      }
    }
    this.moveBox()
  }

  private moveBox() {
    const layout = this.layout
    if (this.mergeView === undefined || layout === undefined) {
      return
    }
    const top = this.mergeView.dom.scrollTop
    const box = toStripRange(
      { top, bottom: top + layout.viewportHeight },
      layout.contentHeight,
      layout.height,
      BOX_HEIGHT_MIN,
    )
    this.box.style.transform = `translateY(${box.top}px)`
    this.box.style.height = `${box.height}px`
  }

  private scrollTo(event: PointerEvent, snapToChanges: boolean) {
    const layout = this.layout
    if (this.mergeView === undefined || layout === undefined) {
      return
    }
    const rect = this.dom.getBoundingClientRect()
    const lane =
      event.clientX - rect.left < rect.width / 2 ? layout.removed : layout.added
    const contentY = contentYAt(
      snapToChanges ? lane : [],
      event.clientY - rect.top,
      layout.contentHeight,
      layout.height,
    )
    this.mergeView.dom.scrollTop = scrollTopToCenter(
      contentY,
      layout.contentHeight,
      layout.viewportHeight,
    )
  }
}

// Heights come from the layout, which already holds the alignment spacers
// and the collapsed regions, so line numbers would put marks off.
function bands(
  view: EditorView,
  contentTop: number,
  changes: LineRangeMapping[],
  side: 'original' | 'modified',
): Band[] {
  const offset = view.documentTop - contentTop
  const doc = view.state.doc
  const result: Band[] = []
  for (const change of changes) {
    const range = change[side]
    if (range.endLineNumberExclusive === range.startLineNumber) {
      continue
    }
    const first = doc.line(range.startLineNumber)
    const last = doc.line(range.endLineNumberExclusive - 1)
    result.push({
      top: offset + view.lineBlockAt(first.from).top,
      bottom: offset + view.lineBlockAt(last.from).bottom,
    })
  }
  return result
}

export function toStripRange(
  band: Band,
  contentHeight: number,
  stripHeight: number,
  heightMin: number,
): { top: number; height: number } {
  assert(contentHeight > 0, 'Empty content')
  assert(band.top <= band.bottom, 'Band upside down')
  const scale = stripHeight / contentHeight
  const height = Math.min(
    Math.max((band.bottom - band.top) * scale, heightMin),
    stripHeight,
  )
  return { top: Math.min(band.top * scale, stripHeight - height), height }
}

// A strip pixel stands for hundreds of content pixels, so a press on or
// next to a mark lands on its change instead of near it.
export function contentYAt(
  bands: Band[],
  y: number,
  contentHeight: number,
  stripHeight: number,
): number {
  const contentY = (y / stripHeight) * contentHeight
  let nearest: Band | undefined
  let distanceMin = SNAP_DISTANCE_MAX
  for (const band of bands) {
    const mark = toStripRange(band, contentHeight, stripHeight, MARK_HEIGHT_MIN)
    const distance = Math.max(mark.top - y, y - mark.top - mark.height, 0)
    if (distance < distanceMin) {
      nearest = band
      distanceMin = distance
    }
  }
  if (nearest === undefined) {
    return contentY
  }
  return Math.min(Math.max(contentY, nearest.top), nearest.bottom)
}

export function scrollTopToCenter(
  contentY: number,
  contentHeight: number,
  viewportHeight: number,
): number {
  const scrollTop = contentY - viewportHeight / 2
  return Math.min(
    Math.max(scrollTop, 0),
    Math.max(contentHeight - viewportHeight, 0),
  )
}
