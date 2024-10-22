'use client'
import {
  type Row,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { TableCell, TableRow } from '~/components/table/table'
import { useTable } from '~/hooks/use-table'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { BasicDaTable, getRowTypeClassNames } from './basic-da-table'
import { columns } from './columns'

export function DaTable({ items }: { items: DaRiskEntry[] }) {
  const table = useTable({
    columns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const renderSpanFill = ({ row }: { row: Row<DaRiskEntry> }) => {
    const remainingBridges = row.original.bridges.slice(1)

    if (remainingBridges.length === 0) {
      return null
    }

    return (
      <>
        {remainingBridges.map((bridge) => (
          <TableRow key={bridge.href} className={getRowTypeClassNames()}>
            <TableCell />
            <BridgeCells bridge={bridge} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<DaRiskEntry> }) => {
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
}: { bridge: (DaRiskEntry | DaSummaryEntry)['bridges'][number] }) {
  return (
    <>
      <TableCell className="text-sm font-bold">{bridge.name}</TableCell>
      <TableCell className="pl-6">
        <RiskCell risk={bridge.risks.committeeSecurity} />
      </TableCell>
      <TableCell>
        <RiskCell risk={bridge.risks.upgradeability} />
      </TableCell>
      <TableCell className="pr-6">
        <RiskCell risk={bridge.risks.relayerFailure} />
      </TableCell>
    </>
  )
}
