import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useMultiViewStore } from '../../multi-view/store'
import { useSearchStore } from '../../search/store'
import { MouseSelection } from './MouseSelection'
import { NodesAndConnections } from './NodesAndConnections'
import { ScalableView } from './ScalableView'
import { useMouseControls } from './hooks/useMouseControls'
import { useTouchControls } from './hooks/useTouchControls'

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const mouseControls = useMouseControls({
    containerRef,
    viewRef,
  })

  const touchControls = useTouchControls({
    containerRef,
    viewRef,
    mouseControls,
  })

  const currentPanel = useMultiViewStore((state) => state.active)
  const searchOpened = useSearchStore((state) => state.opened)
  // Always capture if we're not in panel mode, or if we're in nodes panel
  const shouldCapture =
    (currentPanel === undefined || currentPanel === 'nodes') && !searchOpened

  useEffect(() => {
    // Set up all event listeners
    const target = containerRef.current
    target?.addEventListener('wheel', mouseControls.onWheel, { passive: false })
    target?.addEventListener('mousedown', mouseControls.onMouseDown)
    target?.addEventListener('touchstart', touchControls.onTouchStart, {
      passive: false,
    })
    target?.addEventListener('touchmove', touchControls.onTouchMove, {
      passive: false,
    })
    target?.addEventListener('touchend', touchControls.onTouchEnd, {
      passive: false,
    })

    window.addEventListener('mousemove', mouseControls.onMouseMove)
    window.addEventListener('mouseup', mouseControls.onMouseUp)
    window.addEventListener('touchmove', touchControls.onTouchMove, {
      passive: false,
    })
    window.addEventListener('touchend', touchControls.onTouchEnd, {
      passive: false,
    })
    window.addEventListener('keydown', mouseControls.onKeyDown)
    window.addEventListener('keyup', mouseControls.onKeyUp)

    return () => {
      target?.removeEventListener('wheel', mouseControls.onWheel)
      target?.removeEventListener('mousedown', mouseControls.onMouseDown)
      target?.removeEventListener('touchstart', touchControls.onTouchStart)
      target?.removeEventListener('touchmove', touchControls.onTouchMove)
      target?.removeEventListener('touchend', touchControls.onTouchEnd)

      window.removeEventListener('mousemove', mouseControls.onMouseMove)
      window.removeEventListener('mouseup', mouseControls.onMouseUp)
      window.removeEventListener('touchmove', touchControls.onTouchMove)
      window.removeEventListener('touchend', touchControls.onTouchEnd)
      window.removeEventListener('keydown', mouseControls.onKeyDown)
      window.removeEventListener('keyup', mouseControls.onKeyUp)
    }
  }, [mouseControls, touchControls, shouldCapture])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative h-full w-full overflow-hidden bg-coffee-800',
        'touch-none', // Prevent browser handling of touch events
        mouseControls.isResizing && 'cursor-col-resize',
      )}
    >
      <ScalableView ref={viewRef}>
        <NodesAndConnections />
      </ScalableView>
      <MouseSelection />
    </div>
  )
}
