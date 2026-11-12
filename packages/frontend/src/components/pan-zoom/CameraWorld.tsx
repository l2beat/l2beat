import type { CSSProperties, ReactNode, RefObject } from 'react'

/**
 * The layers `useCamera` moves by writing their transforms, so React never
 * re-renders the content for a pan or a pinch. Children are laid out in world
 * units from the top-left corner.
 */
export function CameraWorld({
  worldRef,
  drawingRef,
  initialStyles,
  children,
}: {
  worldRef: RefObject<HTMLDivElement | null>
  drawingRef: RefObject<HTMLDivElement | null>
  initialStyles: { world: CSSProperties; drawing: CSSProperties }
  children: ReactNode
}) {
  return (
    // The world paints a pixel of its own, too faint to see. With nothing to
    // paint, it would leave Chrome to put the content in a layer of its own,
    // scaled by `drawing`, which under will-change: transform Chrome keeps at
    // the resolution it first drew it at: zoomed in, it blurs.
    <div
      ref={worldRef}
      className="absolute top-0 left-0 size-px origin-top-left will-change-transform"
      style={{
        ...initialStyles.world,
        backgroundColor: 'rgb(0 0 0 / 0.004)',
      }}
    >
      <div
        ref={drawingRef}
        className="origin-top-left"
        style={initialStyles.drawing}
      >
        {children}
      </div>
    </div>
  )
}
