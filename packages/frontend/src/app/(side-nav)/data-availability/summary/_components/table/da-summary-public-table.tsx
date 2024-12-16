'use client'
import {
  type Row,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { TableCell, TableRow } from '~/components/table/table'
import { useTable } from '~/hooks/use-table'
import {
  type DaBridgeSummaryEntry,
  type DaSummaryEntry,
} from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../_components/basic-da-table'
import { mapBridgeRisksToRosetteValues } from '../../../_utils/map-risks-to-rosette-values'
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
          <TableRow key={bridge.href} className={getRowTypeClassNames()}>
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
  excludeBridge?: boolean
}) {
  const bridgeRisks = mapBridgeRisksToRosetteValues(bridge.risks)

  return (
    <>
      <TableCell
        href={bridge.href}
        className="text-sm font-medium group-first:pl-0"
      >
        <div className="pl-4">{bridge.name}</div>
      </TableCell>
      <TableCell
        href={bridge.href}
        className="flex items-center justify-center pl-4"
      >
        <GrissiniCell
          values={bridgeRisks}
          hasNoBridge={bridge.risks.isNoBridge}
        />
      </TableCell>
      <TableCell
        className="justify-end pr-[30px]  text-sm font-medium md:pr-[42px]"
        href={bridge.href}
      >
        {formatCurrency(bridge.tvs, 'usd')}
      </TableCell>
      <TableCell className="text-sm font-medium">
        <ProjectsUsedIn usedIn={bridge.usedIn} />
      </TableCell>
    </>
  )
}
