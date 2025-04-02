import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useMultiViewStore } from '../../multi-view/store'
import { useSearchStore } from '../../search/store'
import { useStore } from '../store/store'
import { MouseSelection } from './MouseSelection'
import { NodesAndConnections } from './NodesAndConnections'
import { ScalableView } from './ScalableView'

// Track touch interaction mode
type TouchMode = 'none' | 'select' | 'pan' | 'zoom'

// Constants for touch gesture detection
const PINCH_DISTANCE_THRESHOLD = 35 // Minimum distance change to consider as pinch
const MODE_SWITCH_COOLDOWN_MS = 150 // Minimum time between mode switches to prevent jitter

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  // Track the current touch interaction mode
  const [touchMode, setTouchMode] = useState<TouchMode>('none')
  // Track initial distance between fingers for pinch detection
  const touchStateRef = useRef({
    initialDistance: 0,
    lastDistance: 0,
    lastModeSwitch: 0,
    initialCenterX: 0,
    initialCenterY: 0,
  })

  const currentPanel = useMultiViewStore((state) => state.active)
  const searchOpened = useSearchStore((state) => state.opened)
  // Always capture if we're not in panel mode, or if we're in nodes panel
  const shouldCapture =
    (currentPanel === undefined || currentPanel === 'nodes') && !searchOpened

  const onKeyDown = useStore((state) => state.onKeyDown)
  const onKeyUp = useStore((state) => state.onKeyUp)
  const onMouseDown = useStore((state) => state.onMouseDown)
  const onMouseMove = useStore((state) => state.onMouseMove)
  const onMouseUp = useStore((state) => state.onMouseUp)
  const onWheel = useStore((state) => state.onWheel)
  const isResizing = useStore((state) => state.resizingNode !== undefined)

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

    function handleKeyDown(event: KeyboardEvent) {
      if (!shouldCapture) return
      onKeyDown(event)
    }

    // Calculate distance between two touch points
    function getTouchDistance(t1: Touch, t2: Touch): number {
      const dx = t1.clientX - t2.clientX
      const dy = t1.clientY - t2.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    // Calculate center point between two touches
    function getTouchCenter(t1: Touch, t2: Touch): { x: number; y: number } {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      }
    }

    // Touch event handlers that map to mouse events
    function handleTouchStart(event: TouchEvent) {
      if (!containerRef.current) return

      // Clear the current mode
      setTouchMode('none')

      // Force end any current interactions
      const endEvent = new MouseEvent('mouseup', { bubbles: true })
      onMouseUp(endEvent)

      // Exactly two fingers = multi-touch mode (either pan or zoom)
      if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]

        if (touch1 && touch2) {
          // Record initial state for pinch detection
          const distance = getTouchDistance(touch1, touch2)
          const center = getTouchCenter(touch1, touch2)

          touchStateRef.current = {
            initialDistance: distance,
            lastDistance: distance,
            lastModeSwitch: Date.now(),
            initialCenterX: center.x,
            initialCenterY: center.y,
          }

          // Default to pan until we detect significant pinch
          setTouchMode('pan')

          // Create a middle-mouse button event for panning with the center point
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: center.x,
            clientY: center.y,
            button: 1, // Middle mouse button for panning
            bubbles: true,
          })

          onMouseDown(mouseEvent, containerRef.current)
        }
        return
      }

      // Exactly one finger = selection mode
      if (event.touches.length === 1) {
        setTouchMode('select')

        const touch = event.touches[0]
        if (!touch) return

        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          button: 0, // Left mouse button
          bubbles: true,
        })

        onMouseDown(mouseEvent, containerRef.current)
      }
    }

    function handleTouchMove(event: TouchEvent) {
      if (!containerRef.current) return

      // Handle changes in the number of touches
      if (
        event.touches.length !==
        (touchMode === 'select'
          ? 1
          : touchMode === 'pan' || touchMode === 'zoom'
            ? 2
            : 0)
      ) {
        // Number of touches changed - reset and restart
        handleTouchEnd(event)
        handleTouchStart(event)
        return
      }

      // Handle two-finger gesture (either pan or zoom)
      if (
        (touchMode === 'pan' || touchMode === 'zoom') &&
        event.touches.length === 2
      ) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        if (!touch1 || !touch2) return

        const currentDistance = getTouchDistance(touch1, touch2)
        const center = getTouchCenter(touch1, touch2)
        const distanceDelta = Math.abs(
          currentDistance - touchStateRef.current.initialDistance,
        )
        const currentTime = Date.now()

        // Determine if we should switch modes based on finger movement
        if (
          currentTime - touchStateRef.current.lastModeSwitch >
          MODE_SWITCH_COOLDOWN_MS
        ) {
          // If distance changed significantly, switch to zoom mode
          if (
            distanceDelta > PINCH_DISTANCE_THRESHOLD &&
            touchMode !== 'zoom'
          ) {
            setTouchMode('zoom')
            touchStateRef.current.lastModeSwitch = currentTime

            // Send mouseup to cancel any panning
            const cancelEvent = new MouseEvent('mouseup', { bubbles: true })
            onMouseUp(cancelEvent)
          }
          // If distance is relatively stable and we're moving from initial position, ensure we're in pan mode
          else if (
            distanceDelta < PINCH_DISTANCE_THRESHOLD &&
            touchMode !== 'pan'
          ) {
            setTouchMode('pan')
            touchStateRef.current.lastModeSwitch = currentTime

            // Reset pan from current position
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: center.x,
              clientY: center.y,
              button: 1, // Middle mouse button for panning
              bubbles: true,
            })

            onMouseDown(mouseEvent, containerRef.current)
          }
        }

        // Handle based on current mode
        if (touchMode === 'zoom') {
          // Calculate zoom delta
          const delta = touchStateRef.current.lastDistance - currentDistance

          // Create a wheel event for zooming
          const wheelEvent = new WheelEvent('wheel', {
            clientX: center.x,
            clientY: center.y,
            deltaY: delta,
            ctrlKey: true, // Simulate pinch zoom
            bubbles: true,
          })

          if (viewRef.current) {
            onWheel(wheelEvent, viewRef.current)
          }
        } else if (touchMode === 'pan') {
          // Continue with the panning using the center point
          const mouseEvent = new MouseEvent('mousemove', {
            clientX: center.x,
            clientY: center.y,
            buttons: 4, // Middle mouse button mask
            bubbles: true,
          })

          onMouseMove(mouseEvent, containerRef.current)
        }

        // Update last distance
        touchStateRef.current.lastDistance = currentDistance
        return
      }

      // Handle selection/dragging with exactly one finger
      if (touchMode === 'select' && event.touches.length === 1) {
        const touch = event.touches[0]
        if (!touch) return

        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          buttons: 1, // Left mouse button mask
          bubbles: true,
        })

        onMouseMove(mouseEvent, containerRef.current)
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      // Create a mouseup event to end current interaction
      const mouseEvent = new MouseEvent('mouseup', {
        bubbles: true,
      })

      onMouseUp(mouseEvent)

      // Reset mode if all fingers are lifted
      if (event.touches.length === 0) {
        setTouchMode('none')
      }
    }

    // Set up all event listeners
    const target = containerRef.current
    target?.addEventListener('wheel', handleWheel, { passive: false })
    target?.addEventListener('mousedown', handleMouseDown)
    target?.addEventListener('touchstart', handleTouchStart, { passive: false })
    target?.addEventListener('touchmove', handleTouchMove, { passive: false })
    target?.addEventListener('touchend', handleTouchEnd, { passive: false })

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      target?.removeEventListener('wheel', handleWheel)
      target?.removeEventListener('mousedown', handleMouseDown)
      target?.removeEventListener('touchstart', handleTouchStart)
      target?.removeEventListener('touchmove', handleTouchMove)
      target?.removeEventListener('touchend', handleTouchEnd)

      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    shouldCapture,
    touchMode, // Add touchMode to dependencies
  ])

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative h-full w-full overflow-hidden bg-coffee-800',
        isResizing && 'cursor-col-resize',
      )}
      // Add touch-action CSS to prevent browser handling
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 flex flex-col gap-2 bg-coffee-800 text-white">
        <div>{touchMode}</div>
        <div>{isResizing ? 'resizing' : 'not resizing'}</div>
      </div>
      <ScalableView ref={viewRef}>
        <NodesAndConnections />
      </ScalableView>
      <MouseSelection />
    </div>
  )
}
