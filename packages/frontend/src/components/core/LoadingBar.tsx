import { cn } from '~/utils/cn'

/**
 * A bar sliding along the top edge of content that still shows old data
 * while new data loads. It starts out of view and waits 150 ms, so a fast
 * response never flashes it.
 */
export function LoadingBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden',
        className,
      )}
    >
      <div className="h-full w-2/5 animate-loading-bar rounded-full bg-brand" />
    </div>
  )
}
