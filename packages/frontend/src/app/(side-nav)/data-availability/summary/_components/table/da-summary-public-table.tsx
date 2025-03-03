'use client'
import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { DesktopTableCellLink } from '~/app/(side-nav)/scaling/summary/_components/table/desktop-table-cell-link'
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
            key={bridge.slug}
            className={getRowTypeClassNames({ isEthereum: false })}
          >
            <BridgeCells bridge={bridge} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<DaSummaryEntry> }) => {
    if (row.original.bridges.length === 0) {
      return null
    }

    return <BridgeCells bridge={row.original.bridges[0]!} />
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
  bridge,
}: {
  bridge: DaBridgeSummaryEntry
}) {
  return (
    <>
      <TableCell className="text-sm font-medium group-first:pl-0">
        <DesktopTableCellLink href={bridge.href} className="ml-4">
          {bridge.name}
        </DesktopTableCellLink>
      </TableCell>
      <TableCell className="flex items-center justify-center pl-4">
        <GrissiniCell
          values={bridge.risks.values}
          hasNoBridge={bridge.risks.isNoBridge}
        />
      </TableCell>
      <TableCell className="justify-end pr-[30px]  text-sm font-medium md:pr-[42px]">
        {formatDollarValueNumber(bridge.tvs.latest)}
      </TableCell>
      <TableCell className="text-sm font-medium">
        <ProjectsUsedIn usedIn={bridge.usedIn} />
      </TableCell>
    </>
  )
}
