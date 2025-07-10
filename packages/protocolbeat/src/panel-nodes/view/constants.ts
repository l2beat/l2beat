/**
 * Constants for viewport clipping and rendering optimization
 */

/**
 * Buffer margin for rendering nodes and connections outside the visible viewport.
 * This ensures smooth scrolling/panning by pre-rendering elements that are about
 * to come into view.
 */
export const VIEWPORT_RENDER_MARGIN = 400

/**
 * Padding around connection bounds when calculating the fallback bounding box.
 * This ensures connections have some visual breathing room at the edges.
 */
export const CONNECTION_BOUNDS_PADDING = 200

/**
 * Extended margin for viewport bounds calculation when viewportContainer is available.
 * This creates a larger canvas area around the visible viewport for smoother
 * interaction and prevents frequent canvas resizing.
 */
export const VIEWPORT_BOUNDS_MARGIN = 800

/**
 * Control point offset for bezier curve connections.
 * Determines how much the curve "bends" away from the connection points.
 */
export const CONNECTION_CONTROL_OFFSET = 50
