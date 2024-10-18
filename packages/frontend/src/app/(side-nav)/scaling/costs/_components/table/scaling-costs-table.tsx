'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import { type CostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/react'
import {
  type CostsMetric,
  useCostsMetricContext,
} from '../costs-metric-context'
import { useCostsTimeRangeContext } from '../costs-time-range-context'
import { useCostsUnitContext } from '../costs-unit-context'
import { type ScalingCostsTableEntry, scalingCostsColumns } from './columns'

interface Props {
  entries: ScalingCostsEntry[]
  rollups?: boolean
}

export function ScalingCostsTable(props: Props) {
  const { range, } = useCostsTimeRangeContext()
  const { unit } = useCostsUnitContext()
  const { metric, } = useCostsMetricContext()
  const includeFilters = useScalingFilter()

  const { data } = api.costs.table.useQuery({ range })

  const filteredEntries = useMemo(
    () => props.entries.filter((item) => includeFilters(item)),
    [props.entries, includeFilters],
  )

  const tableEntries = useMemo(() => {
    const tableEntries = filteredEntries.map((e) =>
      mapToTableEntry(e, data, unit),
    )
    return tableEntries ? calculateDataByType(tableEntries, metric) : []
  }, [data, filteredEntries, metric, unit])

  const table = useTable({
    data: tableEntries,
    columns: scalingCostsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: '#',
          desc: false,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })



  return props.rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
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
    return entries
  }

  return entries.map((e) => {
    if (e.data?.type === 'not-available') return e
    if (!e.data?.txCount)
      return {
        ...e,
        data: {
          type: 'not-available',
          reason: 'no-per-tx-metric',
        },
      }
    return {
      ...e,
      data: {
        ...e.data,
        total: e.data.total / e.data.txCount,
        blobs: e.data.blobs ? e.data.blobs / e.data.txCount : undefined,
        compute: e.data.compute / e.data.txCount,
        calldata: e.data.calldata / e.data.txCount,
        overhead: e.data.overhead / e.data.txCount,
      },
    }
  })
}
