import { useRef, useState } from 'react'
import { useStore } from '../../store/store'
import type { DesktopControls } from './useDesktopControls'

type TouchMode = 'none' | 'select' | 'pinch' | 'pan' | 'tap'

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

// Minimum distance to consider a pinch vs pan
const ZOOM_VS_PAN_THRESHOLD = 3

// Maximum movement to still consider a touch as a tap (in pixels)
const TAP_THRESHOLD = 10

// We could use store, but at the end of the day
// we still treat mouse events as primary ones.
// Touch controls are just wrappers around mouse events.
export function useTouchControls({
  viewRef,
  containerRef,
  desktopControls,
}: Props) {
  const [touchMode, setTouchMode] = useState<TouchMode>('none')
  // Check if any nodes are selected - this is lightweight and doesn't require node detection
  const hasSelectedNodes = useStore((state) => state.selected.length > 0)

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
    // Tap detection
    tapStartX: 0,
    tapStartY: 0,
    tapStartTime: 0,
    movedDuringTap: false,
  })

  // Check if touch point is close to window edge
  function isTouchNearEdge(touch: Touch): boolean {
    // Only check edge detection if the touch is within our container
    // This will allow touches outside our container (like on UI controls) to work normally
    if (!containerRef.current) return false

    const rect = containerRef.current.getBoundingClientRect()

    // Check if touch is within container bounds
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      // Touch is outside container, so not near our edges
      return false
    }

    // Check if touch is near the edge of our container
    return (
      touch.clientX < rect.left + EDGE_SAFETY_MARGIN ||
      touch.clientY < rect.top + EDGE_SAFETY_MARGIN ||
      touch.clientX > rect.right - EDGE_SAFETY_MARGIN ||
      touch.clientY > rect.bottom - EDGE_SAFETY_MARGIN
    )
  }

  function handleTouchStart(event: TouchEvent) {
    if (!containerRef.current) return

    // Only prevent default for touches within our container
    // This allows normal touch behavior on UI elements outside our container
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const allTouchesInContainer = Array.from(event.touches).every(
      (touch) =>
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom,
    )

    if (allTouchesInContainer) {
      event.preventDefault()
    } else {
      // Touch is outside our container, don't handle it
      return
    }

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
          ...touchStateRef.current,
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

    // Exactly one finger - Start in tap mode to detect quick taps for selection
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      if (!touch) return

      // Check if touch is too close to the edge
      if (isTouchNearEdge(touch)) {
        // Mark we're in recovery mode but don't start selection
        touchStateRef.current.isRecovering = true
        return
      }

      // Start in tap mode to allow node selection
      setTouchMode('tap')

      // Store initial tap position
      touchStateRef.current.tapStartX = touch.clientX
      touchStateRef.current.tapStartY = touch.clientY
      touchStateRef.current.tapStartTime = Date.now()
      touchStateRef.current.movedDuringTap = false

      // Don't start mouse events yet - we'll determine if this is a tap or drag
      // based on subsequent movement
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (!containerRef.current) return

    // Only prevent default for touches within our container
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const allTouchesInContainer = Array.from(event.touches).every(
      (touch) =>
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom,
    )

    if (allTouchesInContainer) {
      // Prevent browser default behaviors like pull-to-refresh
      event.preventDefault()
    } else {
      // Touch is outside our container, don't handle it
      return
    }

    // Skip processing if we're in recovery mode from an edge touch
    if (touchStateRef.current.isRecovering) {
      return
    }

    // Handle initial movement for tap mode
    if (touchMode === 'tap' && event.touches.length === 1) {
      const touch = event.touches[0]
      if (!touch) return

      // Calculate distance moved
      const dx = touch.clientX - touchStateRef.current.tapStartX
      const dy = touch.clientY - touchStateRef.current.tapStartY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If moved beyond threshold, switch to pan or select mode
      if (distance > TAP_THRESHOLD) {
        touchStateRef.current.movedDuringTap = true

        // Change to the appropriate mode based on selected nodes
        if (hasSelectedNodes) {
          setTouchMode('select')

          // Simulate left mousedown event for selected nodes movement
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: touchStateRef.current.tapStartX,
            clientY: touchStateRef.current.tapStartY,
            button: 0, // Left mouse button for selection/movement
            bubbles: true,
          })

          desktopControls.onMouseDown(mouseEvent)

          // Now handle the move event
          const moveEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            buttons: 1, // Left mouse button mask
            bubbles: true,
          })

          desktopControls.onMouseMove(moveEvent)
        } else {
          setTouchMode('pan')

          // Simulate middle mousedown event for panning
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: touchStateRef.current.tapStartX,
            clientY: touchStateRef.current.tapStartY,
            button: 1, // Middle mouse button for panning
            bubbles: true,
          })

          desktopControls.onMouseDown(mouseEvent)

          // Now handle the move event
          const moveEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            buttons: 4, // Middle mouse button mask
            bubbles: true,
          })

          desktopControls.onMouseMove(moveEvent)
        }
      }

      return
    }

    // Handle changes in the number of touches for established modes
    const expectedTouches =
      touchMode === 'select' || touchMode === 'pan'
        ? 1
        : touchMode === 'pinch'
          ? 2
          : 0

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
      // just a magic number to prevent accidental zooms based on trial and error
      if (Math.abs(zoomDelta) > ZOOM_VS_PAN_THRESHOLD) {
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

      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        buttons: 1, // Left mouse button mask
        bubbles: true,
      })

      desktopControls.onMouseMove(mouseEvent, { disableSelection: true })
    }

    // Handle panning with exactly one finger
    if (touchMode === 'pan' && event.touches.length === 1) {
      const touch = event.touches[0]
      if (!touch) return

      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        buttons: 4, // Middle mouse button mask
        bubbles: true,
      })

      desktopControls.onMouseMove(mouseEvent, { disableSelection: true })
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!containerRef.current) return

    // Only prevent default for touches that started within our container
    // If we're in a touch mode, we know the touch started in our container
    if (touchMode !== 'none') {
      event.preventDefault()
    } else {
      // Not handling touches outside our container
      return
    }

    // Handle tap (for selecting nodes) if the finger was lifted quickly without much movement
    if (touchMode === 'tap' && !touchStateRef.current.movedDuringTap) {
      // Simulate a normal click to select a node
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: touchStateRef.current.tapStartX,
        clientY: touchStateRef.current.tapStartY,
        button: 0, // Left mouse button
        bubbles: true,
      })

      const mouseUpEvent = new MouseEvent('mouseup', {
        clientX: touchStateRef.current.tapStartX,
        clientY: touchStateRef.current.tapStartY,
        button: 0, // Left mouse button
        bubbles: true,
      })

      // Simulate a click by firing both events
      desktopControls.onMouseDown(mouseDownEvent)
      desktopControls.onMouseUp(mouseUpEvent)
    } else {
      // For other modes, just end the current interaction
      const mouseEvent = new MouseEvent('mouseup', {
        bubbles: true,
      })

      desktopControls.onMouseUp(mouseEvent)
    }

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
