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
        'font-bold text-primary text-xs leading-none md:text-white',
        'flex w-full justify-center rounded-md border border-brand bg-transparent p-3 md:mt-0 md:w-fit md:border-0 md:bg-brand md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      View TVS breakdown
    </a>
  )
}
