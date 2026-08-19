import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useEffect, useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { CostsTableData } from '~/server/features/layer2s/costs/getCostsTableData'
import type { L2CostsEntry } from '~/server/features/layer2s/costs/getL2CostsEntries'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import { useTRPC } from '~/trpc/React'
import type { CostsMetric } from '../CostsMetricContext'
import { useCostsMetricContext } from '../CostsMetricContext'
import { useCostsTimeRangeContext } from '../CostsTimeRangeContext'
import { useCostsUnitContext } from '../CostsUnitContext'
import type { L2CostsTableEntry } from './columns'
import { getL2CostsColumns } from './columns'

interface Props {
  entries: L2CostsEntry[]
}

export function L2CostsTable({ entries }: Props) {
  const trpc = useTRPC()
  const { range } = useCostsTimeRangeContext()
  const { unit } = useCostsUnitContext()
  const { metric } = useCostsMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const { data } = useQuery(trpc.costs.table.queryOptions({ range }))

  const tableEntries = useMemo(() => {
    const tableEntries = entries.map((e) => mapToTableEntry(e, data, unit))
    return tableEntries ? calculateDataByType(tableEntries, metric) : []
  }, [data, entries, metric, unit])

  const columns = useMemo(() => getL2CostsColumns(metric), [metric])

  const table = useTable({
    data: tableEntries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  useEffect(() => {
    if (table.getState().sorting[0]?.id === 'total-cost') {
      setSorting([
        {
          id: 'total-cost',
          desc: metric === 'total',
        },
      ])
    }
  }, [metric, setSorting, table])

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}

function mapToTableEntry(
  entry: L2CostsEntry,
  data: CostsTableData | undefined,
  unit: CostsUnit,
): L2CostsTableEntry {
  if (!data)
    return {
      ...entry,
      data: {
        type: 'not-available',
        reason: 'loading',
      },
    }

  const projectData = data[entry.id.toString()]
  if (!projectData) {
    return {
      ...entry,
      data: {
        type: 'not-available',
        reason: 'no-data',
      },
    }
  }

  return {
    ...entry,
    data: {
      type: 'available',
      isSynced: !entry.statuses?.syncWarning,
      total: projectData[unit].total,
      calldata: projectData[unit].calldata,
      blobs: projectData[unit].blobs,
      compute: projectData[unit].compute,
      overhead: projectData[unit].overhead,
      uopsCount: projectData.uopsCount,
    },
  }
}

function calculateDataByType(
  entries: L2CostsTableEntry[],
  metric: CostsMetric,
): L2CostsTableEntry[] {
  if (metric === 'total') {
    return entries.sort(
      (a, b) =>
        (b.data?.type === 'available'
          ? b.data.total
          : Number.NEGATIVE_INFINITY) -
        (a.data?.type === 'available'
          ? a.data.total
          : Number.NEGATIVE_INFINITY),
    )
  }

  return entries
    .map((e) => {
      if (e.data?.type === 'not-available') return e
      if (!e.data?.uopsCount)
        return {
          ...e,
          data: {
            type: 'not-available',
            reason: 'no-data',
          },
        } as L2CostsTableEntry
      return {
        ...e,
        data: {
          ...e.data,
          total: e.data.total / e.data.uopsCount,
          blobs: e.data.blobs !== null ? e.data.blobs / e.data.uopsCount : null,
          compute: e.data.compute / e.data.uopsCount,
          calldata: e.data.calldata / e.data.uopsCount,
          overhead: e.data.overhead / e.data.uopsCount,
        },
      } as L2CostsTableEntry
    })
    .sort(
      (a, b) =>
        (a.data.type === 'available'
          ? a.data.total
          : Number.POSITIVE_INFINITY) -
        (b.data.type === 'available' ? b.data.total : Number.POSITIVE_INFINITY),
    )
}
