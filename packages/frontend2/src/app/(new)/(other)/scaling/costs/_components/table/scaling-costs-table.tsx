/** eslint-disable @typescript-eslint/no-unsafe-assignment */
/** eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { ScalingFilters } from '~/app/(new)/(other)/_components/scaling-filters'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { type CostsTableData } from '~/server/features/costs/get-costs-table-data'
import {
  type CostsUnit,
  type ScalingCostsEntry,
} from '~/server/features/scaling/get-scaling-costs-entries'
import { api } from '~/trpc/react'
import { useCostsTimeRangeContext } from '../costs-time-range-context'
import { CostsTypeControls } from '../costs-type-controls'
import { useCostsUnitContext } from '../costs-unit-context'
import { type ScalingCostsTableEntry, scalingCostsColumns } from './columns'

interface Props {
  entries: ScalingCostsEntry[]
}

export function ScalingCostsTable(props: Props) {
  const { range, setRange, setDisabledOptions } = useCostsTimeRangeContext()
  const { unit } = useCostsUnitContext()
  const [type, setType] = useState<'total' | 'per-l2-tx'>('total')
  const includeFilters = useScalingFilter()

  const { data } = api.scaling.costs.tableData.useQuery({ range })

  const filteredEntries = useMemo(
    () => props.entries.filter((item) => includeFilters(item)),
    [props.entries, includeFilters],
  )

  const tableEntries = useMemo(() => {
    const tableEntries = props.entries.map((e) =>
      mapToTableEntry(e, data, unit),
    )
    return tableEntries ? calculateDataByType(tableEntries, type) : []
  }, [data, props.entries, type, unit])

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

  const onTypeChange = (type: 'total' | 'per-l2-tx') => {
    setType(type)
    if (type === 'per-l2-tx') {
      if (range === '1d' || range === '7d') {
        setRange('30d')
      }
      setDisabledOptions(['1d', '7d'])
      return
    }
    setDisabledOptions(undefined)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <ScalingFilters items={filteredEntries} />
        <CostsTypeControls value={type} onValueChange={onTypeChange} />
      </div>
      <BasicTable table={table} />
    </div>
  )
}

function mapToTableEntry(
  entry: ScalingCostsEntry,
  data: Record<string, CostsTableData> | undefined,
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
        reason: 'coming-soon',
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
      unit,
    },
  }
}

function calculateDataByType(
  entries: ScalingCostsTableEntry[],
  type: 'total' | 'per-l2-tx',
): ScalingCostsTableEntry[] {
  if (type === 'total') {
    return entries
  }

  return entries.map((e) => {
    if (e.data?.type === 'not-available') return e
    if (!e.data?.txCount)
      return {
        ...e,
        data: {
          type: 'not-available',
          reason: 'no-tx-count',
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
