import { cn } from '~/utils/cn'

export function ExploreInteropButton({ className }: { className?: string }) {
  return (
    <a
      href="/interop/summary"
      className={cn(
        'flex w-full justify-center rounded-md border border-divider p-3 font-medium text-label-value-13 text-primary leading-4',
        'transition-colors hover:bg-surface-secondary md:mt-0 md:w-fit md:px-3 md:py-1.5',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      Explore Interop
    </a>
  )
}
