import { notUndefined } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import Link from 'next/link'
import { TableFilter } from '~/components/table/filters/table-filter'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { cn } from '~/utils/cn'
import { getDaLayerValue } from '../data-availability/_components/scaling-da-filters'
import { useScalingFilterValues } from './scaling-filter-context'
import { ScalingFilters } from './scaling-filters'

interface Props {
  items: ScalingActivityEntry[]
  className?: string
}
export function ScalingActivityFilters({ items, className }: Props) {
  const state = useScalingFilterValues()
  const daLayerOptions = uniq(
    items
      .map((item) =>
        item.dataAvailability.layer
          ? getDaLayerValue(item.dataAvailability.layer)
          : undefined,
      )
      .filter(notUndefined),
  )
    .sort()
    .map((value) => ({
      label: value,
      value,
    }))

  const daLayerFilter = (
    <TableFilter
      key="activity-da-layer"
      title="DA Layer"
      options={daLayerOptions}
      value={state.daLayer}
      onValueChange={(value) => state.set({ daLayer: value })}
    />
  )

  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-x-4 gap-y-2 [@media(min-width:1000px)]:flex-row [@media(min-width:1000px)]:justify-between',
        className,
      )}
    >
      <ScalingFilters items={items} additionalFilters={daLayerFilter} />
      <ExplorerButton />
    </div>
  )
}

function ExplorerButton() {
  return (
    <Link
      href="https://uops.l2beat.com/"
      target="_blank"
      className="flex w-fit items-center gap-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 text-sm font-semibold text-white"
    >
      <span>🔍</span>
      <span>UOPS Explorer</span>
    </Link>
  )
}
