import { cn } from '~/utils/cn'

export function DetailsLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return (
    <a
      onClick={(e) => e.stopPropagation()}
      href={`/zk-catalog/v1/${slug}`}
      className={cn(
        'mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-black px-6 font-bold text-base text-primary-invert md:mt-0 dark:bg-white',
        className,
      )}
    >
      <span className="max-md:hidden">Details</span>
      <span className="md:hidden">Details page</span>
    </a>
  )
}
