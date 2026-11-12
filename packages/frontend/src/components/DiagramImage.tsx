import { useMemo, useRef } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import { CameraWorld } from '~/components/pan-zoom/CameraWorld'
import { fitContainCamera, useCamera } from '~/components/pan-zoom/camera'
import { useDragToPan } from '~/components/pan-zoom/useDragToPan'
import {
  EXPAND_GLYPH,
  Glyph,
  ZoomControls,
} from '~/components/pan-zoom/ZoomControls'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'

/** Past this, a diagram's pixels only get bigger, not clearer. */
const MAX_SCALE = 2
/** The frame's border already sets the diagram apart, and phones have little room to spare. */
const FIT_PADDING = 16

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  return (
    <Dialog>
      <DialogTrigger
        className="group relative inline-block max-w-full cursor-zoom-in rounded-sm align-[unset] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        title="Open in full screen"
      >
        <DiagramPictures diagram={diagram} className="max-w-full" />
        <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md border border-divider bg-surface-primary text-secondary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-100">
          <Glyph d={EXPAND_GLYPH} />
        </span>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-3 bg-surface-primary p-4 max-md:pt-0"
        aria-describedby={undefined}
        fullScreen
      >
        <DialogClose />
        {/* A sticky bar at the very top, as iOS Safari only re-tints its
            status bar from a sticky or fixed bar at the top. */}
        <DialogTitle className="pr-8 max-md:sticky max-md:top-0 max-md:bg-surface-primary max-md:pt-4">
          {diagram.caption}
        </DialogTitle>
        <ZoomableDiagram diagram={diagram} />
      </DialogContent>
    </Dialog>
  )
}

function ZoomableDiagram({ diagram }: { diagram: DiagramParams }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const size = useResizeObserver({ ref: containerRef })
  // Mounted with the dialog, so the window is a close guess until measured.
  const viewportWidth = size.width ?? window.innerWidth
  const viewportHeight = size.height ?? window.innerHeight
  const viewport = { width: viewportWidth, height: viewportHeight }
  const { width, height } = diagram.src.light
  const content = useMemo(() => ({ width, height }), [width, height])

  const fitted = useMemo(
    () =>
      fitContainCamera(
        content,
        { width: viewportWidth, height: viewportHeight },
        FIT_PADDING,
      ),
    [content, viewportWidth, viewportHeight],
  )
  const scale = useMemo(
    () => ({ min: fitted.k, max: Math.max(MAX_SCALE, fitted.k) }),
    [fitted.k],
  )
  const { camera, worldRef, drawingRef, initialStyles } = useCamera(
    content,
    fitted,
    viewport,
    containerRef,
    { wheelPans: true, scale },
  )
  const pan = useDragToPan(camera, containerRef, true)

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1 touch-none select-none overflow-hidden rounded-lg border border-divider bg-background"
      {...pan.handlers}
    >
      <CameraWorld
        worldRef={worldRef}
        drawingRef={drawingRef}
        initialStyles={initialStyles}
      >
        {/* Events go to the frame: an image would start a native drag. */}
        <DiagramPictures
          diagram={diagram}
          className="pointer-events-none max-w-none"
          style={content}
        />
      </CameraWorld>
      <ZoomControls camera={camera} />
    </div>
  )
}

function DiagramPictures({
  diagram,
  className,
  style,
}: {
  diagram: DiagramParams
  className?: string
  style?: { width: number; height: number }
}) {
  return (
    <>
      <img
        className={cn(
          'inline align-[unset] dark:invert',
          diagram.src.dark && 'dark:hidden',
          className,
        )}
        alt={diagram.caption}
        style={style}
        {...diagram.src.light}
      />
      {diagram.src.dark && (
        <img
          className={cn('hidden align-[unset] dark:inline', className)}
          alt={diagram.caption}
          style={style}
          {...diagram.src.dark}
        />
      )}
    </>
  )
}
