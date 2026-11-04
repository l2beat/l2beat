import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/** world * k + (x, y) = screen */
export interface Camera {
  x: number
  y: number
  k: number
}

export interface Point {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

const MIN_SCALE = 0.2
const MAX_SCALE = 4
const FIT_PADDING = 32
/** Below this the node text stops being readable. */
const READABLE_SCALE = 0.55
/** The most one wheel event zooms by: a mouse wheel's notch. */
const WHEEL_ZOOM_STEP = 1.15
/** A wheel zoom draws the diagram anew once the wheel has rested this long. */
const WHEEL_SETTLE_MS = 150
/** World units between the background's dots. */
const DOT_GRID_STEP = 24
const MIN_DOT_SPACING = 16
/**
 * How far the dot grid reaches past the frame on each side: the widest dot
 * spacing, so moving the grid by less than one spacing keeps the frame covered.
 */
const DOT_GRID_OVERHANG = DOT_GRID_STEP * MAX_SCALE
/**
 * How far a pinch may stretch or shrink the last drawing of the diagram
 * before it is drawn anew: further would blur it, or, zoomed out, give the
 * browser more of it to draw than it can in a frame.
 */
const MAX_STRETCH = 2
/** Pixels per wheel line, for browsers that report line-based deltas. */
const WHEEL_LINE_HEIGHT = 16
/**
 * A fling slows down as an exponential decay with this time constant, and
 * travels its speed times this far.
 */
const FLING_TIME_CONSTANT_MS = 325
/** In pixels per millisecond: a slower release stops where it is. */
const MIN_FLING_SPEED = 0.3
const MAX_FLING_SPEED = 4
/**
 * Ease-out cubic starts at three times its average speed, so over three time
 * constants, by when a decay is all but over, it starts at the speed the
 * finger let go at.
 */
const FLING_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'
const FLING_DURATION_MS = 3 * FLING_TIME_CONSTANT_MS
/** Ease-out quart, for a glide to a node. */
const GLIDE_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)'
const GLIDE_DURATION_MS = 350

export interface CameraControls {
  /** Where the camera is, halting a glide there. */
  get: () => Camera
  /**
   * A `live` move, one frame of a gesture, stretches the last drawing of the
   * diagram to a new zoom rather than drawing it anew; `settle` draws it.
   */
  set: (camera: Camera, options?: { live?: boolean }) => void
  update: (update: (camera: Camera) => Camera) => void
  settle: () => void
  zoomBy: (factor: number, point?: Point) => void
  reset: () => void
  /** Glides on from a pan let go of at `velocity`, in pixels per millisecond. */
  fling: (velocity: Point) => void
  /** Glides to `camera`, at the zoom the camera already has. */
  glideTo: (camera: Camera) => void
}

/**
 * Fits on mount and on resize; ctrl/meta + wheel over `containerRef` zooms.
 * A bare wheel scrolls the page, or pans when `wheelPans` is set, for views
 * with no page left to scroll. A scroll of the container, as when a node out
 * of view takes focus, pans instead.
 *
 * The camera stays out of React and moves the diagram by writing transforms
 * to the elements behind the returned refs, as re-rendering the diagram on
 * every frame of a gesture drops frames. `world` and `grid` get compositing
 * layers of their own, so a pan only moves them: nothing is laid out or
 * painted again. `drawing`, inside `world`, carries the zoom the diagram was
 * last drawn at, and `world` stretches it to the rest. `initialStyles` puts
 * the elements where the camera starts, before it can write to them.
 */
export function useRelationsCamera(
  content: Size,
  viewport: Size,
  focusX: number | undefined,
  containerRef: RefObject<HTMLElement | null>,
  wheelPans = false,
) {
  const { width: contentWidth, height: contentHeight } = content
  const { width: viewportWidth, height: viewportHeight } = viewport
  const fitted = useMemo(
    () =>
      fitCamera(
        { width: contentWidth, height: contentHeight },
        { width: viewportWidth, height: viewportHeight },
        focusX,
      ),
    [contentWidth, contentHeight, viewportWidth, viewportHeight, focusX],
  )
  const worldRef = useRef<HTMLDivElement>(null)
  const drawingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [initialStyles] = useState(() => getLayerStyles(fitted, fitted.k))
  const view = useRef<{
    camera: Camera
    /** The zoom `drawing` is drawn at. */
    drawnK: number
    /** What the layers were last given. */
    styles: LayerStyles
    /**
     * Set once the camera is moved by hand: such a camera belongs to the
     * content it was set on, and a new layout (e.g. after toggling hidden
     * nodes) falls back to the fit.
     */
    manualFor?: Size
    /** The animations of a glide under way; `camera` is where it ends. */
    glide?: Animation[]
  }>({ camera: fitted, drawnK: fitted.k, styles: initialStyles })
  // Read by the stable callbacks below.
  const latest = useRef({ content, fitted, viewportWidth, viewportHeight })
  latest.current = { content, fitted, viewportWidth, viewportHeight }

  const show = useCallback((camera: Camera, live = false) => {
    const state = view.current
    for (const animation of state.glide ?? []) animation.cancel()
    state.glide = undefined
    state.camera = camera
    const stretch = camera.k / state.drawnK
    if (!live || Math.max(stretch, 1 / stretch) > MAX_STRETCH) {
      state.drawnK = camera.k
    }
    const styles = getLayerStyles(camera, state.drawnK)
    for (const [element, style, previous] of [
      [worldRef.current, styles.world, state.styles.world],
      [drawingRef.current, styles.drawing, state.styles.drawing],
      [gridRef.current, styles.grid, state.styles.grid],
    ] as const) {
      // Only what changed: writing the same zoom or dot spacing again would
      // still have the browser draw the diagram or the grid again.
      for (const [property, value] of Object.entries(style)) {
        const key = property as keyof typeof style
        if (element && previous[key] !== value) element.style[key] = value
      }
    }
    state.styles = styles
  }, [])

  useLayoutEffect(() => {
    if (view.current.manualFor === content) return
    view.current.manualFor = undefined
    show(fitted)
  }, [content, fitted, show])

  const controls = useMemo<CameraControls>(() => {
    const get = () => {
      const state = view.current
      const world = worldRef.current
      if (state.glide && world) {
        const { e, f } = new DOMMatrixReadOnly(
          getComputedStyle(world).transform,
        )
        show({ ...state.camera, x: e, y: f })
      }
      return state.camera
    }
    const set: CameraControls['set'] = (camera, options) => {
      view.current.manualFor = latest.current.content
      show(camera, options?.live)
    }
    // Animated by the browser's compositor, which iOS runs at 120 Hz while it
    // holds the page's own frames to 60 Hz.
    const glide = (to: Camera, duration: number, easing: string) => {
      const from = get()
      const dx = to.x - from.x
      const dy = to.y - from.y
      const world = worldRef.current
      const grid = gridRef.current
      set(to)
      if (!world || !grid || (dx === 0 && dy === 0) || prefersReducedMotion()) {
        return
      }
      const state = view.current
      // From where it was, as the diagram is now drawn at the zoom it ends at.
      const fromStyles = getLayerStyles(from, state.drawnK)
      // The grid travels all the way, made longer by whole dot spacings on
      // the side it comes from so it covers the frame throughout.
      const spacing = dotGridSpacing(DOT_GRID_STEP, to.k)
      const reach = (travel: number) =>
        -DOT_GRID_OVERHANG - Math.ceil(Math.max(0, travel) / spacing) * spacing
      const inset = `${reach(dy)}px ${reach(-dx)}px ${reach(-dy)}px ${reach(dx)}px`
      grid.style.inset = inset
      state.styles = { ...state.styles, grid: { ...state.styles.grid, inset } }
      const shiftX = gridShift(from.x, spacing)
      const shiftY = gridShift(from.y, spacing)
      const timing = { duration, easing, fill: 'forwards' } as const
      const worldGlide = world.animate(
        [fromStyles.world, { transform: state.styles.world.transform }],
        timing,
      )
      const gridGlide = grid.animate(
        [
          { transform: `translate(${shiftX}px, ${shiftY}px)` },
          { transform: `translate(${shiftX + dx}px, ${shiftY + dy}px)` },
        ],
        timing,
      )
      const animations = [worldGlide, gridGlide]
      state.glide = animations
      worldGlide.onfinish = () => {
        if (view.current.glide === animations) show(to)
      }
    }
    return {
      get,
      set,
      update: (update) => set(update(get())),
      settle: () => show(get()),
      zoomBy: (factor, point) => {
        const { viewportWidth, viewportHeight } = latest.current
        set(
          zoomCamera(
            get(),
            factor,
            point ?? { x: viewportWidth / 2, y: viewportHeight / 2 },
          ),
        )
      },
      reset: () => {
        view.current.manualFor = undefined
        show(latest.current.fitted)
      },
      fling: (velocity) => {
        const speed = Math.hypot(velocity.x, velocity.y)
        if (speed < MIN_FLING_SPEED || prefersReducedMotion()) return
        const carry =
          (Math.min(speed, MAX_FLING_SPEED) / speed) * FLING_TIME_CONSTANT_MS
        const camera = get()
        glide(
          {
            ...camera,
            x: camera.x + velocity.x * carry,
            y: camera.y + velocity.y * carry,
          },
          FLING_DURATION_MS,
          FLING_EASING,
        )
      },
      glideTo: (camera) => glide(camera, GLIDE_DURATION_MS, GLIDE_EASING),
    }
  }, [show])

  // Native listener: React's wheel handler is passive, so it cannot stop the
  // browser from zooming the page on ctrl+wheel or scrolling it on a pan.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        if (!wheelPans) return
        event.preventDefault()
        const delta = wheelPanDelta(event, element)
        controls.update((camera) => ({
          ...camera,
          x: camera.x - delta.x,
          y: camera.y - delta.y,
        }))
        return
      }
      event.preventDefault()
      // A trackpad pinch sends a stream of these: stretch the drawing until
      // it ends.
      controls.set(
        zoomCamera(
          controls.get(),
          wheelZoomFactor(event),
          toLocalPoint(element, event),
        ),
        { live: true },
      )
      clearTimeout(settleTimer)
      settleTimer = setTimeout(controls.settle, WHEEL_SETTLE_MS)
    }
    // Focusing a node out of view scrolls the frame to it, overflow: hidden
    // as it is. Move the camera there instead, so it alone places the diagram.
    const onScroll = () => {
      const { scrollLeft, scrollTop } = element
      if (scrollLeft === 0 && scrollTop === 0) return
      element.scrollTo(0, 0)
      controls.update((camera) => ({
        ...camera,
        x: camera.x - scrollLeft,
        y: camera.y - scrollTop,
      }))
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('scroll', onScroll)
    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('scroll', onScroll)
      clearTimeout(settleTimer)
    }
  }, [containerRef, controls, wheelPans])

  return { camera: controls, worldRef, drawingRef, gridRef, initialStyles }
}

type LayerStyles = ReturnType<typeof getLayerStyles>

/**
 * The styles that show `camera` with the diagram drawn at `drawnK`. The grid
 * moves by less than one dot spacing, which looks the same as moving it all
 * the way.
 */
function getLayerStyles(camera: Camera, drawnK: number) {
  const spacing = dotGridSpacing(DOT_GRID_STEP, camera.k)
  return {
    world: {
      transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.k / drawnK})`,
    },
    drawing: { transform: `scale(${drawnK})` },
    grid: {
      inset: `${-DOT_GRID_OVERHANG}px`,
      backgroundSize: `${spacing}px ${spacing}px`,
      transform: `translate(${gridShift(camera.x, spacing)}px, ${gridShift(camera.y, spacing)}px)`,
    },
  } satisfies Record<string, CSSProperties>
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The shift of a dot grid that starts `DOT_GRID_OVERHANG` before the frame,
 * in `(-spacing, 0]`, that puts its dots where a grid anchored at `offset`
 * would have them.
 */
export function gridShift(offset: number, spacing: number): number {
  const shift = (offset + DOT_GRID_OVERHANG) % spacing
  return shift > 0 ? shift - spacing : shift
}

/** Where the container's space, the one the camera maps the world into, starts in client space. */
export function frameOrigin(element: HTMLElement): Point {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + element.clientLeft,
    y: rect.top + element.clientTop,
  }
}

/** A pointer's position in the container's space. */
function toLocalPoint(
  element: HTMLElement,
  event: { clientX: number; clientY: number },
): Point {
  const origin = frameOrigin(element)
  return { x: event.clientX - origin.x, y: event.clientY - origin.y }
}

/**
 * The wheel's travel in pixels. Most browsers turn a shifted wheel sideways
 * themselves, Firefox only flags it.
 */
function wheelPanDelta(event: WheelEvent, element: HTMLElement): Point {
  const shifted = event.shiftKey && event.deltaX === 0
  const x = shifted ? event.deltaY : event.deltaX
  const y = shifted ? 0 : event.deltaY
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return { x: x * WHEEL_LINE_HEIGHT, y: y * WHEEL_LINE_HEIGHT }
  }
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return { x: x * element.clientWidth, y: y * element.clientHeight }
  }
  return { x, y }
}

/**
 * How far a ctrl+wheel event zooms. Chrome sends a trackpad pinch as a stream
 * of them, each with deltaY = -100 ln(scale), so following that keeps the
 * diagram under the fingers, however many events it merges into one. A mouse
 * wheel's notch, far larger, zooms one step.
 */
export function wheelZoomFactor(
  event: Pick<WheelEvent, 'deltaY' | 'deltaMode'>,
): number {
  // deltaMode 0 is pixels; a line or a page is a notch or more
  const deltaY =
    event.deltaMode === 0 ? event.deltaY : event.deltaY * WHEEL_LINE_HEIGHT
  return clamp(Math.exp(-deltaY / 100), 1 / WHEEL_ZOOM_STEP, WHEEL_ZOOM_STEP)
}

/** Fits the width and anchors the top: a tall graph is panned, not shrunk into a smudge. */
function fitCamera(content: Size, viewport: Size, focusX?: number): Camera {
  if (content.width <= 0 || content.height <= 0) return { x: 0, y: 0, k: 1 }
  const innerWidth = viewport.width - FIT_PADDING * 2
  const innerHeight = viewport.height - FIT_PADDING * 2
  const k = clamp(
    Math.min(innerWidth / content.width, 1),
    READABLE_SCALE,
    MAX_SCALE,
  )
  const width = content.width * k
  const height = content.height * k
  return {
    k,
    x:
      width <= innerWidth
        ? (viewport.width - width) / 2
        : focusX === undefined
          ? FIT_PADDING
          : viewport.width / 2 - focusX * k,
    y: height <= innerHeight ? (viewport.height - height) / 2 : FIT_PADDING,
  }
}

/**
 * The camera after pointers moved `from` → `to` (same pointers, same order):
 * their centroid pans and their spread zooms, keeping the world point under
 * the starting centroid under the current one.
 */
export function gestureCamera(
  camera: Camera,
  from: Point[],
  to: Point[],
): Camera {
  const start = centroid(from)
  const end = centroid(to)
  const startSpread = spread(from, start)
  const factor = startSpread > 0 ? spread(to, end) / startSpread : 1
  const k = clamp(camera.k * factor, MIN_SCALE, MAX_SCALE)
  return {
    k,
    x: end.x - ((start.x - camera.x) / camera.k) * k,
    y: end.y - ((start.y - camera.y) / camera.k) * k,
  }
}

export function centroid(points: Point[]): Point {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  }
}

/** Mean distance from the centroid; 0 for a single point. */
function spread(points: Point[], center: Point): number {
  return (
    points.reduce(
      (sum, point) => sum + Math.hypot(point.x - center.x, point.y - center.y),
      0,
    ) / points.length
  )
}

/** Keeps the scale and moves the world `point` to the middle of the viewport. */
export function centerCamera(
  camera: Camera,
  point: Point,
  viewport: Size,
): Camera {
  return {
    k: camera.k,
    x: viewport.width / 2 - point.x * camera.k,
    y: viewport.height / 2 - point.y * camera.k,
  }
}

/**
 * Keeps the scale and pans as little as possible to bring the world `box`
 * inside the screen `area`, `margin` clear of its edges. A box too big to
 * fit keeps its top-left corner in view.
 */
export function revealCamera(
  camera: Camera,
  box: Point & Size,
  area: Point & Size,
  margin: number,
): Camera {
  return {
    k: camera.k,
    x:
      camera.x +
      fitShift(
        box.x * camera.k + camera.x,
        box.width * camera.k,
        area.x + margin,
        area.x + area.width - margin,
      ),
    y:
      camera.y +
      fitShift(
        box.y * camera.k + camera.y,
        box.height * camera.k,
        area.y + margin,
        area.y + area.height - margin,
      ),
  }
}

/** The smallest shift that moves `[start, start + size]` inside `[min, max]`, favouring `min`. */
function fitShift(start: number, size: number, min: number, max: number) {
  return Math.max(Math.min(0, max - (start + size)), min - start)
}

/**
 * On-screen spacing of a background grid with `step` world units between
 * dots. Zoomed far out it skips every other dot, as often as needed, so the
 * dots never pack tighter than `MIN_DOT_SPACING`; the kept dots stay put.
 */
export function dotGridSpacing(step: number, k: number): number {
  let spacing = step * k
  while (spacing < MIN_DOT_SPACING) spacing *= 2
  return spacing
}

/** Scales around `point` so the world point under it stays put. */
function zoomCamera(camera: Camera, factor: number, point: Point): Camera {
  const k = clamp(camera.k * factor, MIN_SCALE, MAX_SCALE)
  const ratio = k / camera.k
  return {
    k,
    x: point.x - (point.x - camera.x) * ratio,
    y: point.y - (point.y - camera.y) * ratio,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
