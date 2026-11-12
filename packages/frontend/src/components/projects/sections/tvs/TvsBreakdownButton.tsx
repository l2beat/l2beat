import { cn } from '~/utils/cn'

export function TvsBreakdownButton({
  tvsBreakdownUrl,
  className,
}: {
  tvsBreakdownUrl: string
  className?: string
}) {
  return (
    <a
      href={tvsBreakdownUrl}
      className={cn(
        'flex w-full justify-center rounded-md border border-divider p-3 font-medium text-label-value-13 text-primary leading-4',
        'transition-colors hover:bg-surface-secondary md:mt-0 md:w-fit md:px-3 md:py-1.5',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      View TVS breakdown
    </a>
  )
}
