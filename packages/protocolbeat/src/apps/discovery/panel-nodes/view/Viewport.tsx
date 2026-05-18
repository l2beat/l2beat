import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import { useMultiViewStore } from '../../multi-view/store'
import { useSearchStore } from '../../search/store'
import { useStore } from '../store/store'
import { useDesktopControls } from './hooks/useDesktopControls'
import { useTouchControls } from './hooks/useTouchControls'
import { MouseSelection } from './MouseSelection'
import { NodesAndConnections } from './NodesAndConnections'
import { ScalableView } from './ScalableView'

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const registerViewportContainer = useStore(
    (state) => state.registerViewportContainer,
  )

  const desktopControls = useDesktopControls({
    containerRef,
    viewRef,
  })

  const touchControls = useTouchControls({
    containerRef,
    viewRef,
    desktopControls,
  })

  const currentPanel = useMultiViewStore((state) => state.active)
  const searchOpened = useSearchStore((state) => state.opened)
  // Always capture if we're not in panel mode, or if we're in nodes panel
  const shouldCapture =
    (currentPanel === undefined || currentPanel === 'nodes') && !searchOpened

  useEffect(() => {
    registerViewportContainer(containerRef.current)
    return () => {
      registerViewportContainer(null)
    }
  }, [registerViewportContainer])

  useEffect(() => {
    const target = containerRef.current
    target?.addEventListener('wheel', desktopControls.onWheel, {
      passive: false,
    })
    target?.addEventListener('mousedown', desktopControls.onMouseDown)
    target?.addEventListener('touchstart', touchControls.onTouchStart, {
      passive: false,
    })
    target?.addEventListener('touchmove', touchControls.onTouchMove, {
      passive: false,
    })
    target?.addEventListener('touchend', touchControls.onTouchEnd, {
      passive: false,
    })

    window.addEventListener('mousemove', desktopControls.onMouseMove)
    window.addEventListener('mouseup', desktopControls.onMouseUp)
    window.addEventListener('touchmove', touchControls.onTouchMove, {
      passive: false,
    })
    window.addEventListener('touchend', touchControls.onTouchEnd, {
      passive: false,
    })
    window.addEventListener('keydown', desktopControls.onKeyDown)
    window.addEventListener('keyup', desktopControls.onKeyUp)

    return () => {
      target?.removeEventListener('wheel', desktopControls.onWheel)
      target?.removeEventListener('mousedown', desktopControls.onMouseDown)
      target?.removeEventListener('touchstart', touchControls.onTouchStart)
      target?.removeEventListener('touchmove', touchControls.onTouchMove)
      target?.removeEventListener('touchend', touchControls.onTouchEnd)

      window.removeEventListener('mousemove', desktopControls.onMouseMove)
      window.removeEventListener('mouseup', desktopControls.onMouseUp)
      window.removeEventListener('touchmove', touchControls.onTouchMove)
      window.removeEventListener('touchend', touchControls.onTouchEnd)
      window.removeEventListener('keydown', desktopControls.onKeyDown)
      window.removeEventListener('keyup', desktopControls.onKeyUp)
    }
  }, [desktopControls, touchControls, shouldCapture])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative h-full w-full overflow-hidden bg-coffee-800',
        'touch-none', // Prevent browser handling of touch events
        desktopControls.isResizing && 'cursor-col-resize',
      )}
    >
      <ScalableView ref={viewRef}>
        <NodesAndConnections />
      </ScalableView>
      <MouseSelection />
    </div>
  )
}
