import { useEffect, useRef } from 'react'
import { shallow } from 'zustand/shallow'

import { useStore } from '../store/store'

export function useViewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const actions = useStore(
    (state) => ({
      onKeyDown: state.onKeyDown,
      onKeyUp: state.onKeyUp,
      onMouseDown: state.onMouseDown,
      onMouseMove: state.onMouseMove,
      onMouseUp: state.onMouseUp,
      onWheel: state.onWheel,
    }),
    shallow,
  )

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (!viewRef.current) return
      actions.onWheel(event, viewRef.current)
    }

    function handleMouseDown(event: MouseEvent) {
      if (!containerRef.current) return
      actions.onMouseDown(event, containerRef.current)
    }

    function handleMouseMove(event: MouseEvent) {
      if (!containerRef.current) return
      actions.onMouseMove(event, containerRef.current)
    }

    function handleMouseUp(event: MouseEvent) {
      actions.onMouseUp(event)
    }

    function handleKeyDown(event: KeyboardEvent) {
      actions.onKeyDown(event)
    }

    function handleKeyUp(event: KeyboardEvent) {
      actions.onKeyUp(event)
    }

    const target = containerRef.current
    target?.addEventListener('wheel', handleWheel, { passive: false })
    target?.addEventListener('mousedown', handleMouseDown, { passive: false })
    window.addEventListener('mousemove', handleMouseMove, { passive: false })
    window.addEventListener('mouseup', handleMouseUp, { passive: false })
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp, { passive: false })
    return () => {
      target?.removeEventListener('wheel', handleWheel)
      target?.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [actions])

  return { containerRef, viewRef }
}
