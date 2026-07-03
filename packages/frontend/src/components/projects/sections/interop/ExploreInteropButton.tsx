import { cn } from '~/utils/cn'

export function ExploreInteropButton({ className }: { className?: string }) {
  return (
    <a
      href="/interop/summary"
      className={cn(
        'font-bold text-primary text-xs leading-none md:text-white',
        'flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-linear-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
        className,
      )}
    >
      Explore Interop
    </a>
  )
}
