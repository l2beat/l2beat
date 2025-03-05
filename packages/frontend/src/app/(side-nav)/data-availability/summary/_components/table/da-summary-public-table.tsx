'use client'
import { ProjectId } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { TableLink } from '~/app/(side-nav)/scaling/summary/_components/table/table-link'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { TableCell, TableRow } from '~/components/table/table'
import { useTable } from '~/hooks/use-table'
import type {
  DaBridgeSummaryEntry,
  DaSummaryEntry,
} from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../_components/basic-da-table'
import { publicSystemsColumns } from './columns'
import { ProjectsUsedIn } from './projects-used-in'

export function DaSummaryPublicTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable({
    columns: publicSystemsColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const renderSpanFill = ({ row }: { row: Row<DaSummaryEntry> }) => {
    const remainingBridges = row.original.bridges.slice(1)

    if (remainingBridges.length === 0) {
      return null
    }

    return (
      <>
        {remainingBridges.map((bridge) => (
          <TableRow
            data-slug={`${row.original.slug}`}
            key={bridge.slug}
            className={getRowTypeClassNames({ isEthereum: false })}
          >
            <BridgeCells layer={row.original} bridge={bridge} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<DaSummaryEntry> }) => {
    if (row.original.bridges.length === 0) {
      return null
    }

    return (
      <BridgeCells layer={row.original} bridge={row.original.bridges[0]!} />
    )
  }

  return (
    <BasicDaTable
      table={table}
      renderSpanFill={renderSpanFill}
      renderInlineSpanFill={renderInlineSpanFill}
    />
  )
}

function BridgeCells({
  layer,
  bridge,
}: {
  layer: DaSummaryEntry
  bridge: DaBridgeSummaryEntry
}) {
  return (
    <>
      <TableCell className="text-sm font-medium first:pl-0">
        <TableLink href={bridge.href} className="ml-4">
          {bridge.name}
        </TableLink>
      </TableCell>
      <TableCell className="flex items-center justify-center pl-4">
        <GrissiniCell
          values={bridge.risks.values}
          hasNoBridge={bridge.risks.isNoBridge}
          href={
            layer.id === ProjectId.ETHEREUM
              ? undefined
              : `/data-availability/risk?tab=${layer.tab}&highlight=${layer.slug}`
          }
          disabledOnMobile
        />
      </TableCell>
      <TableCell
        className="pr-[30px] text-sm font-medium md:pr-[42px]"
        align="right"
      >
        {formatDollarValueNumber(bridge.tvs.latest)}
      </TableCell>
      <TableCell className="text-sm font-medium">
        <ProjectsUsedIn usedIn={bridge.usedIn} />
      </TableCell>
    </>
  )
}
