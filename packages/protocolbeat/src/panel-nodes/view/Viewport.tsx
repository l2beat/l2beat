import { useEffect, useRef } from 'react'
import { useStore } from '../store/store'
import { MouseSelection } from './MouseSelection'
import { NodesAndConnections } from './NodesAndConnections'
import { ScalableView } from './ScalableView'

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const onKeyDown = useStore((state) => state.onKeyDown)
  const onKeyUp = useStore((state) => state.onKeyUp)
  const onMouseDown = useStore((state) => state.onMouseDown)
  const onMouseMove = useStore((state) => state.onMouseMove)
  const onMouseUp = useStore((state) => state.onMouseUp)
  const onWheel = useStore((state) => state.onWheel)

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (!viewRef.current) return
      onWheel(event, viewRef.current)
    }

    function handleMouseDown(event: MouseEvent) {
      if (!containerRef.current) return
      onMouseDown(event, containerRef.current)
    }

    function handleMouseMove(event: MouseEvent) {
      if (!containerRef.current) return
      onMouseMove(event, containerRef.current)
    }

    const target = containerRef.current
    target?.addEventListener('wheel', handleWheel)
    target?.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      target?.removeEventListener('wheel', handleWheel)
      target?.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onWheel])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-coffee"
    >
      <ScalableView ref={viewRef}>
        <NodesAndConnections />
      </ScalableView>
      <MouseSelection />
    </div>
  )
}
