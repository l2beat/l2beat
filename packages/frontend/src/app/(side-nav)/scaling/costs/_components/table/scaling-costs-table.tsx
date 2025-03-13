'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useEffect, useMemo } from 'react'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import type { CostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/react'
import type { CostsMetric } from '../costs-metric-context'
import { useCostsMetricContext } from '../costs-metric-context'
import { useCostsTimeRangeContext } from '../costs-time-range-context'
import { useCostsUnitContext } from '../costs-unit-context'
import type { ScalingCostsTableEntry } from './columns'
import { getScalingCostsColumns } from './columns'

interface Props {
  entries: ScalingCostsEntry[]
  rollups?: boolean
}

export function ScalingCostsTable({ entries, rollups }: Props) {
  const { range } = useCostsTimeRangeContext()
  const { unit } = useCostsUnitContext()
  const { metric } = useCostsMetricContext()
  const { sorting, setSorting } = useTableSorting()

  const { data } = api.costs.table.useQuery({ range })

  const tableEntries = useMemo(() => {
    const tableEntries = entries.map((e) => mapToTableEntry(e, data, unit))
    return tableEntries ? calculateDataByType(tableEntries, metric) : []
  }, [data, entries, metric, unit])

  const table = useTable({
    data: tableEntries,
    columns: getScalingCostsColumns(metric),
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

  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}

function mapToTableEntry(
  entry: ScalingCostsEntry,
  data: CostsTableData | undefined,
  unit: CostsUnit,
): ScalingCostsTableEntry {
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
      ...projectData,
      type: 'available',
      isSynced: projectData.isSynced,
      total: projectData[unit].total,
      calldata: projectData[unit].calldata,
      blobs: projectData[unit].blobs,
      compute: projectData[unit].compute,
      overhead: projectData[unit].overhead,
    },
  }
}

function calculateDataByType(
  entries: ScalingCostsTableEntry[],
  metric: CostsMetric,
): ScalingCostsTableEntry[] {
  if (metric === 'total') {
    return entries.sort(
      (a, b) =>
        (b.data?.type === 'available' ? b.data.total : -Infinity) -
        (a.data?.type === 'available' ? a.data.total : -Infinity),
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
        } as ScalingCostsTableEntry
      return {
        ...e,
        data: {
          ...e.data,
          total: e.data.total / e.data.uopsCount,
          blobs: e.data.blobs ? e.data.blobs / e.data.uopsCount : undefined,
          compute: e.data.compute / e.data.uopsCount,
          calldata: e.data.calldata / e.data.uopsCount,
          overhead: e.data.overhead / e.data.uopsCount,
        },
      } as ScalingCostsTableEntry
    })
    .sort(
      (a, b) =>
        (a.data.type === 'available' ? a.data.total : Infinity) -
        (b.data.type === 'available' ? b.data.total : Infinity),
    )
}
