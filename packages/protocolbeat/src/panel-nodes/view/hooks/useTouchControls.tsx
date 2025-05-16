import { useRef, useState } from 'react'
import type { DesktopControls } from './useDesktopControls'

type TouchMode = 'none' | 'select' | 'pinch' // Changed from having separate pan/zoom modes

type Props = {
  viewRef: React.RefObject<HTMLElement | null>
  containerRef: React.RefObject<HTMLElement | null>
  // We need it since we remap touch events to mouse events
  desktopControls: DesktopControls
}

// Minimum safe distance from window edge (in pixels)
// Sometimes we're stuck with touch events that are too close to the edge
// Probably needs better handling in the future
const EDGE_SAFETY_MARGIN = 5

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
    lastCenterX: 0,
    lastCenterY: 0,
    isRecovering: false, // Flag to track if we're recovering from an edge event
  })

  // Check if touch point is close to window edge
  function isTouchNearEdge(touch: Touch): boolean {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    return (
      touch.clientX < EDGE_SAFETY_MARGIN ||
      touch.clientY < EDGE_SAFETY_MARGIN ||
      touch.clientX > windowWidth - EDGE_SAFETY_MARGIN ||
      touch.clientY > windowHeight - EDGE_SAFETY_MARGIN
    )
  }

  function handleTouchStart(event: TouchEvent) {
    if (!containerRef.current) return

    // Prevent browser default behaviors like pull-to-refresh
    event.preventDefault()

    // Clear the current mode
    setTouchMode('none')

    // Reset recovery flag
    touchStateRef.current.isRecovering = false

    // Force end any current interactions
    const endEvent = new MouseEvent('mouseup', { bubbles: true })
    desktopControls.onMouseUp(endEvent)

    // Exactly two fingers = multi-touch mode (combined pan and zoom)
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]

      if (touch1 && touch2) {
        // Check if either touch is too close to the edge
        if (isTouchNearEdge(touch1) || isTouchNearEdge(touch2)) {
          // Mark we're in recovery mode but don't start any gesture yet
          touchStateRef.current.isRecovering = true
          return
        }

        const distance = getTouchDistance(touch1, touch2)
        const center = getTouchCenter(touch1, touch2)

        touchStateRef.current = {
          initialDistance: distance,
          lastDistance: distance,
          lastModeSwitch: Date.now(),
          initialCenterX: center.x,
          initialCenterY: center.y,
          lastCenterX: center.x,
          lastCenterY: center.y,
          isRecovering: false,
        }

        // Use pinch mode for combined pan and zoom
        setTouchMode('pinch')
      }
      return
    }

    // Exactly one finger = selection mode
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      if (!touch) return

      // Check if touch is too close to the edge
      if (isTouchNearEdge(touch)) {
        // Mark we're in recovery mode but don't start selection
        touchStateRef.current.isRecovering = true
        return
      }

      setTouchMode('select')

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

    // Prevent browser default behaviors like pull-to-refresh
    event.preventDefault()

    // Skip processing if we're in recovery mode from an edge touch
    if (touchStateRef.current.isRecovering) {
      return
    }

    // Handle changes in the number of touches
    const expectedTouches =
      touchMode === 'select' ? 1 : touchMode === 'pinch' ? 2 : 0

    if (event.touches.length !== expectedTouches) {
      // Number of touches changed - reset and restart
      handleTouchEnd(event)
      handleTouchStart(event)
      return
    }

    // Handle two-finger gesture (combined pan and zoom)
    if (touchMode === 'pinch' && event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]

      if (!touch1 || !touch2) return

      // Check if either touch moved too close to the edge during the gesture
      if (isTouchNearEdge(touch1) || isTouchNearEdge(touch2)) {
        touchStateRef.current.isRecovering = true
        // End current gesture cleanly
        handleTouchEnd(event)
        return
      }

      const currentDistance = getTouchDistance(touch1, touch2)
      const center = getTouchCenter(touch1, touch2)

      // Handle zooming - calculate zoom delta from distance change
      const zoomDelta = touchStateRef.current.lastDistance - currentDistance

      // Increased threshold to prevent accidental zooms during panning
      // 3 is just a magic number to prevent accidental zooms based on trial and error
      if (Math.abs(zoomDelta) > 3) {
        // Create a wheel event for zooming
        const wheelEvent = new WheelEvent('wheel', {
          clientX: center.x,
          clientY: center.y,
          deltaY: zoomDelta,
          ctrlKey: true, // Simulate pinch zoom
          bubbles: true,
        })

        if (viewRef.current) {
          desktopControls.onWheel(wheelEvent)
        }
      }

      // Handle panning - calculate position change from center movement
      if (
        touchStateRef.current.lastCenterX !== center.x ||
        touchStateRef.current.lastCenterY !== center.y
      ) {
        // Simulate middle mouse button for panning
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: center.x,
          clientY: center.y,
          buttons: 4, // Middle mouse button mask
          bubbles: true,
        })

        // Need to simulate a mousedown first if this is the first pan movement
        if (
          touchStateRef.current.lastCenterX ===
            touchStateRef.current.initialCenterX &&
          touchStateRef.current.lastCenterY ===
            touchStateRef.current.initialCenterY
        ) {
          const mouseDownEvent = new MouseEvent('mousedown', {
            clientX: touchStateRef.current.initialCenterX,
            clientY: touchStateRef.current.initialCenterY,
            button: 1, // Middle mouse button for panning
            bubbles: true,
          })

          desktopControls.onMouseDown(mouseDownEvent)
        }

        desktopControls.onMouseMove(mouseEvent)
      }

      // Update last values
      touchStateRef.current.lastDistance = currentDistance
      touchStateRef.current.lastCenterX = center.x
      touchStateRef.current.lastCenterY = center.y

      return
    }

    // Handle selection/dragging with exactly one finger
    if (touchMode === 'select' && event.touches.length === 1) {
      const touch = event.touches[0]
      if (!touch) return

      // Check if touch moved too close to the edge during the gesture
      if (isTouchNearEdge(touch)) {
        touchStateRef.current.isRecovering = true
        // End current gesture cleanly
        handleTouchEnd(event)
        return
      }

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
    // Prevent browser default behaviors
    event.preventDefault()

    // Create a mouseup event to end current interaction
    const mouseEvent = new MouseEvent('mouseup', {
      bubbles: true,
    })

    desktopControls.onMouseUp(mouseEvent)

    // Reset mode if all fingers are lifted
    if (event.touches.length === 0) {
      setTouchMode('none')
      touchStateRef.current.isRecovering = false
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
