import { useRef, useState } from 'react'
import type { DesktopControls } from './useDesktopControls'

type TouchMode = 'none' | 'select' | 'pan' | 'zoom'

const PINCH_DISTANCE_THRESHOLD = 35 // Minimum distance change to consider as pinch
const MODE_SWITCH_COOLDOWN_MS = 150 // Minimum time between mode switches to prevent jitter

type Props = {
  viewRef: React.RefObject<HTMLElement | null>
  containerRef: React.RefObject<HTMLElement | null>
  // We need it since we remap touch events to mouse events
  desktopControls: DesktopControls
}

// We could use store, but at the end of the day
// we still treat mouse events as primary ones.
// Touch controls are just wrappers around mouse events.
export function useTouchControls({
  viewRef,
  containerRef,
  desktopControls,
}: Props) {
  const [touchMode, setTouchMode] = useState<TouchMode>('none')

  // Tracking the distance between fingers for pinch detection
  const touchStateRef = useRef({
    initialDistance: 0,
    lastDistance: 0,
    lastModeSwitch: 0,
    initialCenterX: 0,
    initialCenterY: 0,
  })

  function handleTouchStart(event: TouchEvent) {
    if (!containerRef.current) return

    // Clear the current mode
    setTouchMode('none')

    // Force end any current interactions
    const endEvent = new MouseEvent('mouseup', { bubbles: true })
    desktopControls.onMouseUp(endEvent)

    // Exactly two fingers = multi-touch mode (either pan or zoom)
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]

      if (touch1 && touch2) {
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

        desktopControls.onMouseDown(mouseEvent)
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

      desktopControls.onMouseDown(mouseEvent)
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (!containerRef.current) return

    // Handle changes in the number of touches
    const expectedTouches =
      touchMode === 'select'
        ? 1
        : touchMode === 'pan' || touchMode === 'zoom'
          ? 2
          : 0

    if (event.touches.length !== expectedTouches) {
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
        if (distanceDelta > PINCH_DISTANCE_THRESHOLD && touchMode !== 'zoom') {
          setTouchMode('zoom')
          touchStateRef.current.lastModeSwitch = currentTime

          // Send mouseup to cancel any panning
          const cancelEvent = new MouseEvent('mouseup', { bubbles: true })
          desktopControls.onMouseUp(cancelEvent)
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

          desktopControls.onMouseDown(mouseEvent)
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
          desktopControls.onWheel(wheelEvent)
        }
      }

      if (touchMode === 'pan') {
        // Continue with the panning using the center point
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: center.x,
          clientY: center.y,
          buttons: 4, // Middle mouse button mask
          bubbles: true,
        })

        desktopControls.onMouseMove(mouseEvent)
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

      desktopControls.onMouseMove(mouseEvent)
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    // Create a mouseup event to end current interaction
    const mouseEvent = new MouseEvent('mouseup', {
      bubbles: true,
    })

    desktopControls.onMouseUp(mouseEvent)

    // Reset mode if all fingers are lifted
    if (event.touches.length === 0) {
      setTouchMode('none')
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}

function getTouchDistance(t1: Touch, t2: Touch): number {
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getTouchCenter(t1: Touch, t2: Touch): { x: number; y: number } {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  }
}
