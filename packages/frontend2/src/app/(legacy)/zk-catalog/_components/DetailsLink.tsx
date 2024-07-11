import Link from 'next/link'
import { cn } from '~/utils/cn'

export function DetailsLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return (
    <Link
      href={`/zk-catalog/${slug}`}
      className={cn(
        'mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-black px-6 font-bold text-base text-white md:mt-0 md:h-8 md:w-max dark:bg-white dark:text-black',
        className,
      )}
    >
      Details
    </Link>
  )
}
