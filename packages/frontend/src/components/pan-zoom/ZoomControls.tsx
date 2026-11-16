import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import type { CameraControls } from './camera'

const ZOOM_STEP = 1.25

/** Zoom in, zoom out and reset, followed by any extra `children` buttons. */
export function ZoomControls({
  camera,
  className,
  children,
}: {
  camera: CameraControls
  className?: string
  children?: ReactNode
}) {
  return (
    // Drags don't start on the controls, so a touch that wanders off a button
    // neither pans the view nor leaves a click to filter out.
    <div
      className={cn('absolute right-3 bottom-3 flex flex-col gap-1', className)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ControlButton label="Zoom in" onClick={() => camera.zoomBy(ZOOM_STEP)}>
        <Glyph d="M5 12h14M12 5v14" />
      </ControlButton>
      <ControlButton
        label="Zoom out"
        onClick={() => camera.zoomBy(1 / ZOOM_STEP)}
      >
        <Glyph d="M5 12h14" />
      </ControlButton>
      <ControlButton label="Reset view" onClick={camera.reset}>
        <Glyph d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
      </ControlButton>
      {children}
    </div>
  )
}

export function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className="flex size-7 items-center justify-center rounded-md border border-divider bg-surface-primary text-secondary hover:bg-surface-tertiary hover:text-primary"
    >
      {children}
    </button>
  )
}

export const EXPAND_GLYPH = 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'

export function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-3.5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  )
}
