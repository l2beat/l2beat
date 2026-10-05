import {
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  useRef,
  useState,
} from 'react'
import type { LabPoster } from '../../model'
import {
  getHoverKey,
  type HoverTarget,
  hitTest,
  type SequencerView,
} from './drawSequencer'
import { getBatchAt, type Sequence } from './sequence'

export interface Hover {
  target: HoverTarget
  /** Where the tooltip goes, in the variant's box */
  x: number
  y: number
}

interface Pointer {
  /** In the variant's box */
  x: number
  y: number
  /** On the canvas */
  canvasX: number
  canvasY: number
}

interface Options {
  rootRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  /** Where the notes are right now */
  getView: () => SequencerView
  sequence: Sequence
  posters: LabPoster[]
  onSelect: (posterId: string) => void
}

/**
 * What the pointer is over, on the canvas or in the gutter, and what a click
 * there picks. The target is also kept in a ref, for the drawing to ring the
 * note under the pointer in the same frame it is found.
 */
export function useSequencerHover({
  rootRef,
  canvasRef,
  getView,
  sequence,
  posters,
  onSelect,
}: Options) {
  const pointer = useRef<Pointer | undefined>(undefined)
  const target = useRef<HoverTarget | undefined>(undefined)
  const [hover, setHover] = useState<Hover>()

  /** The poster a click on the target picks: a note's sender, or a row's project */
  const getPick = (on: HoverTarget | undefined) => {
    if (!on) return undefined
    const batch = getBatchAt(sequence, on)
    if (batch) return posters[batch.posterIndex]?.id
    const track = sequence.tracks[on.track]
    return track && !track.isEveryoneElse ? track.id : undefined
  }

  const show = (next: HoverTarget | undefined, at: Pointer) => {
    target.current = next
    const canvas = canvasRef.current
    if (canvas) canvas.style.cursor = getPick(next) ? 'pointer' : ''
    setHover(next ? { target: next, x: at.x, y: at.y } : undefined)
  }

  const clear = () => {
    pointer.current = undefined
    target.current = undefined
    setHover(undefined)
  }

  /** Notes slide under a pointer at rest, so call it every frame they move */
  const followNotes = () => {
    const at = pointer.current
    if (!at) return
    const next = hitTest(getView(), at.canvasX, at.canvasY)
    if (getHoverKey(next) !== getHoverKey(target.current)) show(next, at)
  }

  const locate = (event: MouseEvent<HTMLCanvasElement>): Pointer => {
    const canvasBox = event.currentTarget.getBoundingClientRect()
    const rootBox = rootRef.current?.getBoundingClientRect() ?? canvasBox
    return {
      x: event.clientX - rootBox.left,
      y: event.clientY - rootBox.top,
      canvasX: event.clientX - canvasBox.left,
      canvasY: event.clientY - canvasBox.top,
    }
  }

  const canvasHandlers = {
    onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => {
      const at = locate(event)
      pointer.current = at
      show(hitTest(getView(), at.canvasX, at.canvasY), at)
    },
    onPointerLeave: clear,
    onClick: (event: MouseEvent<HTMLCanvasElement>) => {
      const at = locate(event)
      const pick = getPick(hitTest(getView(), at.canvasX, at.canvasY))
      if (pick) onSelect(pick)
    },
  }

  const onGutterHover = (track: number, event: PointerEvent | FocusEvent) => {
    const rootBox = rootRef.current?.getBoundingClientRect()
    if (!rootBox) return
    const next = { track }
    target.current = next
    if ('clientX' in event) {
      setHover({
        target: next,
        x: event.clientX - rootBox.left,
        y: event.clientY - rootBox.top,
      })
      return
    }
    // focused from the keyboard: the tooltip goes beside the row
    const row = event.currentTarget.getBoundingClientRect()
    setHover({
      target: next,
      x: row.right - rootBox.left,
      y: row.top - rootBox.top + row.height / 2,
    })
  }

  return { hover, target, followNotes, clear, canvasHandlers, onGutterHover }
}
