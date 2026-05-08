import { useMultiViewStore } from '../../../multi-view/store'
import { useSearchStore } from '../../../search/store'
import { useStore } from '../../store/store'

type Props = {
  viewRef: React.RefObject<HTMLElement | null>
  containerRef: React.RefObject<HTMLElement | null>
}

export type DesktopControls = {
  onWheel: (event: WheelEvent) => void
  onMouseDown: (event: MouseEvent) => void
  onMouseMove: (
    event: MouseEvent,
    opts?: { disableSelection?: boolean },
  ) => void
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseUp: (event: MouseEvent) => void
  isResizing: boolean
}

export function useDesktopControls({
  viewRef,
  containerRef,
}: Props): DesktopControls {
  const currentPanel = useMultiViewStore((state) => state.active)
  const searchOpened = useSearchStore((state) => state.opened)

  const onKeyDown = useStore((state) => state.onKeyDown)
  const onKeyUp = useStore((state) => state.onKeyUp)
  const onMouseDown = useStore((state) => state.onMouseDown)
  const onMouseMove = useStore((state) => state.onMouseMove)
  const onMouseUp = useStore((state) => state.onMouseUp)
  const onWheel = useStore((state) => state.onWheel)
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)
  const isResizing = useStore((state) => state.resizingNode !== undefined)

  // Always capture if we're not in panel mode, or if we're in nodes panel
  const shouldCapture =
    (currentPanel === undefined || currentPanel === 'nodes') && !searchOpened

  function handleWheel(event: WheelEvent) {
    if (!viewRef.current) return
    onWheel(event, viewRef.current)
  }

  function handleMouseDown(event: MouseEvent) {
    if (!containerRef.current) return
    onMouseDown(event, containerRef.current)
  }

  function handleMouseMove(
    event: MouseEvent,
    opts?: { disableSelection?: boolean },
  ) {
    if (!containerRef.current) return
    onMouseMove(event, containerRef.current, opts)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!shouldCapture) return

    if (isEditableTarget(event.target)) return

    if (isRedoKeyboardEvent(event)) {
      event.preventDefault()
      redo()
      return
    }

    if (isUndoKeyboardEvent(event)) {
      event.preventDefault()
      undo()
      return
    }

    onKeyDown(event)
  }

  return {
    onWheel: handleWheel,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onKeyDown: handleKeyDown,
    onKeyUp: onKeyUp,
    onMouseUp: onMouseUp,
    isResizing,
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

function isUndoKeyboardEvent(event: KeyboardEvent): boolean {
  return (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === 'z'
  )
}

function isRedoKeyboardEvent(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase()

  return (
    ((event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      event.shiftKey &&
      key === 'z') ||
    (event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey &&
      key === 'y')
  )
}
