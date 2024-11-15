'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '~/utils/cn'

export function DetailsLink({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const router = useRouter()

  return (
    <Link
      prefetch={false}
      href={`/zk-catalog/${slug}`}
      className={cn(
        'mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-black px-6 text-base font-bold text-primary-invert dark:bg-white md:mt-0 md:h-8 md:w-max',
        className,
      )}
      onMouseOver={() => router.prefetch(`/zk-catalog/${slug}`)}
    >
      <span className="max-md:hidden">Details</span>
      <span className="md:hidden">Details page</span>
    </Link>
  )
}
