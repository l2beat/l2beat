import { uniq } from 'lodash'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { TableFilter } from '~/components/table/filters/table-filter'
import type { FilterableScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import { cn } from '~/utils/cn'
import { useScalingFilterValues } from './scaling-filter-context'

interface Props {
  items: FilterableScalingEntry[]
  showHostChainFilter?: boolean
  showDALayerFilter?: boolean
  className?: string
}

export function ScalingFilters({
  items,
  showHostChainFilter,
  showDALayerFilter,
  className,
}: Props) {
  const filter = useScalingFilterValues()
  const filterables = items
    .map((x) => x.filterable)
    .filter((f) => f !== undefined)

  const types = uniq(filterables.map((f) => f.type)).sort()
  const stacks = uniq(filterables.map((f) => f.stack)).sort(
    putFirst('No stack'),
  )
  const stages = uniq(filterables.map((f) => f.stage)).sort(
    putFirst('Not applicable'),
  )
  const purposes = uniq(filterables.flatMap((f) => f.purposes)).sort()
  const raases = uniq(filterables.map((f) => f.raas)).sort(putFirst('No RaaS'))
  const hostChains = uniq(filterables.map((f) => f.hostChain)).sort(
    putFirst('Ethereum'),
  )
  const daLayers = uniq(filterables.map((f) => f.daLayer)).sort()

  return (
    <OverflowWrapper
      childrenClassName="-m-1 [&>*]:m-1 max-md:pl-4"
      className={cn('pr-4', className)}
    >
      <div className="flex flex-row space-x-1">
        <TableFilter
          title="Type"
          options={types}
          value={filter.type}
          onValueChange={(type) => filter.set({ type })}
        />
        <TableFilter
          title="Stack"
          options={stacks}
          value={filter.stack}
          onValueChange={(stack) => filter.set({ stack })}
        />
        <TableFilter
          title="Stage"
          options={stages}
          value={filter.stage}
          onValueChange={(stage) => filter.set({ stage })}
        />
        <TableFilter
          title="Purpose"
          options={purposes}
          value={filter.purpose}
          onValueChange={(purpose) => filter.set({ purpose })}
        />
        <TableFilter
          title="RaaS"
          options={raases}
          value={filter.raas}
          onValueChange={(raas) => filter.set({ raas })}
        />
        {showHostChainFilter && (
          <TableFilter
            title="Host chain"
            options={hostChains}
            value={filter.hostChain}
            onValueChange={(hostChain) => filter.set({ hostChain })}
          />
        )}
        {showDALayerFilter && (
          <TableFilter
            title="DA layer"
            options={daLayers}
            value={filter.daLayer}
            onValueChange={(daLayer) => filter.set({ daLayer })}
          />
        )}
      </div>
    </OverflowWrapper>
  )
}

export function putFirst(value: string) {
  return function compare(a: string, b: string) {
    if (a === value) return -1
    if (b === value) return 1
    return a.localeCompare(b)
  }
}
