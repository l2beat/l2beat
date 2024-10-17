'use client'
import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { ScalingFilters } from '~/app/(side-nav)/scaling/_components/scaling-filters'
import { RollupsTable } from '~/components/table/rollups-table'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { useTable } from '~/hooks/use-table'
import { COSTS_UPCOMING_PROJECTS } from '~/server/features/scaling/costs/consts'
import { type CostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/react'
import {
  type CostsMetric,
  useCostsMetricContext,
} from '../costs-metric-context'
import { useCostsTimeRangeContext } from '../costs-time-range-context'
import { CostsMetricControls } from '../costs-type-controls'
import { useCostsUnitContext } from '../costs-unit-context'
import { type ScalingCostsTableEntry, scalingCostsColumns } from './columns'

interface Props {
  entries: ScalingCostsEntry[]
}

export function ScalingCostsRollupsTable(props: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit } = useCostsUnitContext()
  const { metric, setMetric } = useCostsMetricContext()
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
    getSortedRowModel: getStageSortedRowModel(),
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

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    if (metric === 'per-l2-tx' && (range === '1d' || range === '7d')) {
      setRange('30d')
    }
  }

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
        <ScalingFilters items={filteredEntries} />
        <CostsMetricControls value={metric} onValueChange={onMetricChange} />
      </div>
      <RollupsTable table={table} />
    </div>
  )
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
        reason: COSTS_UPCOMING_PROJECTS.includes(entry.id)
          ? 'coming-soon'
          : 'no-data',
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
