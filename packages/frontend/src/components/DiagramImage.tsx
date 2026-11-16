import { useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import {
  type Camera,
  fitContainCamera,
  type Size,
} from '~/components/pan-zoom/camera'
import { CameraWorld, PanZoomFrame } from '~/components/pan-zoom/PanZoomFrame'
import { usePanZoom } from '~/components/pan-zoom/usePanZoom'
import {
  EXPAND_GLYPH,
  Glyph,
  ZoomControls,
} from '~/components/pan-zoom/ZoomControls'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'

/** Past this, a diagram's pixels only get bigger, not clearer. */
const MAX_SCALE = 2
/** The frame's border already sets the diagram apart, and phones have little room to spare. */
const FIT_PADDING = 16

/** Zoomed out, it never gets smaller than it fits. */
function diagramScale(fitted: Camera) {
  return { min: fitted.k, max: MAX_SCALE }
}

/**
 * Wide diagrams keep a readable 720px on phones and scroll inside their own
 * box; shrunk to the screen their labels fell to 3–7px. The box runs to the
 * screen edge and a hint says it scrolls, so the crop reads as continuation.
 */
const PHONE_READABLE_WIDTH = 720

export function DiagramImage({ diagram }: { diagram: DiagramParams }) {
  const scrollsOnPhones = diagram.src.light.width > PHONE_READABLE_WIDTH
  return (
    <Dialog>
      {/* Above the image, so the caption stays directly under it. */}
      {scrollsOnPhones && (
        <p className="mb-2 text-left text-label-value-13 text-secondary md:hidden">
          Scroll sideways to see the whole diagram, or tap to open it.
        </p>
      )}
      <div
        className={cn(
          scrollsOnPhones &&
            'max-md:-mx-4 max-md:overflow-x-auto max-md:px-4 max-md:text-left',
        )}
      >
        <DialogTrigger
          className={cn(
            'group relative inline-block max-w-full cursor-zoom-in rounded-sm align-[unset] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            scrollsOnPhones && 'max-md:max-w-none',
          )}
          title="Open in full screen"
        >
          <DiagramPictures
            diagram={diagram}
            className={cn(
              'max-w-full',
              scrollsOnPhones && 'max-md:w-[720px] max-md:max-w-none',
            )}
          />
          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md border border-divider bg-surface-primary text-secondary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-100">
            <Glyph d={EXPAND_GLYPH} />
          </span>
        </DialogTrigger>
      </div>
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
  const { width, height } = diagram.src.light
  const content = useMemo(() => ({ width, height }), [width, height])
  const fitTo = useCallback(
    (viewport: Size) => fitContainCamera(content, viewport, FIT_PADDING),
    [content],
  )
  const panZoom = usePanZoom({
    content,
    fitTo,
    scale: diagramScale,
    fillsView: true,
    // Mounted with the dialog, so the window is a close guess until measured.
    initialViewport: { width: window.innerWidth, height: window.innerHeight },
  })

  return (
    <PanZoomFrame panZoom={panZoom} className="min-h-0 flex-1">
      <CameraWorld panZoom={panZoom}>
        {/* Events go to the frame: an image would start a native drag. */}
        <DiagramPictures
          diagram={diagram}
          className="pointer-events-none max-w-none"
          style={content}
        />
      </CameraWorld>
      <ZoomControls camera={panZoom.camera} />
    </PanZoomFrame>
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
          // Inverting swaps red and green; rotating the hue puts them back.
          'inline align-[unset] dark:hue-rotate-180 dark:invert',
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
