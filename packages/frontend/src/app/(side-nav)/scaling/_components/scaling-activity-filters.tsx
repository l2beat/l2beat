'use client'
import Link from 'next/link'
import { TableFilters } from '~/components/table/filters/table-filters'
import type { FilterableEntry } from '~/components/table/filters/types'
import { useTracking } from '~/hooks/use-custom-event'
import { cn } from '~/utils/cn'

interface Props {
  entries: FilterableEntry[]
  className?: string
}
export function ScalingActivityFilters({ entries, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 [@media(min-width:1000px)]:flex-row [@media(min-width:1000px)]:justify-between',
        className,
      )}
    >
      <TableFilters entries={entries} />
      <ExplorerButton />
    </div>
  )
}

function ExplorerButton() {
  const { track } = useTracking()
  return (
    <Link
      href="https://uops.l2beat.com/"
      target="_blank"
      className={cn(
        'flex w-fit items-center gap-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 text-sm font-semibold text-white max-md:ml-4',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
      onClick={() => {
        track('uopsExplorerSelected')
      }}
    >
      <span>🔍</span>
      <span>UOPS Explorer</span>
    </Link>
  )
}
