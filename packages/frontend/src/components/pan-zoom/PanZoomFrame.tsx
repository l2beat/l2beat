import type { MouseEventHandler, ReactNode } from 'react'
import { cn } from '~/utils/cn'
import type { PanZoom } from './usePanZoom'

/** The frame `panZoom` measures and takes its gestures from. */
export function PanZoomFrame({
  panZoom,
  className,
  onClick,
  children,
}: {
  panZoom: PanZoom
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
}) {
  return (
    <div
      ref={panZoom.frameRef}
      className={cn(
        'relative select-none overflow-hidden rounded-lg border border-divider bg-background',
        panZoom.fillsView ? 'touch-none' : 'touch-pan-y',
        className,
      )}
      {...panZoom.handlers}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

/**
 * The layers the camera moves by writing their transforms, so React never
 * re-renders the content for a pan or a pinch. Children are laid out in world
 * units from the top-left corner.
 */
export function CameraWorld({
  panZoom,
  children,
}: {
  panZoom: PanZoom
  children: ReactNode
}) {
  return (
    // The world paints a pixel of its own, too faint to see. With nothing to
    // paint, it would leave Chrome to put the content in a layer of its own,
    // scaled by `drawing`, which under will-change: transform Chrome keeps at
    // the resolution it first drew it at: zoomed in, it blurs.
    <div
      ref={panZoom.worldRef}
      className="absolute top-0 left-0 size-px origin-top-left will-change-transform"
      style={{
        ...panZoom.initialStyles.world,
        backgroundColor: 'rgb(0 0 0 / 0.004)',
      }}
    >
      <div
        ref={panZoom.drawingRef}
        className="origin-top-left"
        style={panZoom.initialStyles.drawing}
      >
        {children}
      </div>
    </div>
  )
}
