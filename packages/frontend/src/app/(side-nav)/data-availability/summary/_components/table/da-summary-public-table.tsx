'use client'
import { Row, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { TableCell, TableRow } from '~/components/table/table'
import { useTable } from '~/hooks/use-table'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { RiskGrissini } from '../../../_components/risk-grissini'
import { customColumns } from './columns'
import { BasicDaTable, getRowTypeClassNames } from './da/basic-da-table'

export function DaSummaryPublicTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable({
    columns: customColumns,
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
            <TableCell href={bridge.href} />
            <BridgeCells bridge={bridge} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<DaSummaryEntry> }) => {
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
  excludeBridge = false,
}: {
  bridge: DaSummaryEntry['bridges'][number]
  excludeBridge?: boolean
}) {
  const bridgeRisks = [
    bridge.risks.committeeSecurity,
    bridge.risks.upgradeability,
    bridge.risks.relayerFailure,
  ]

  return (
    <>
      <TableCell href={bridge.href} className="text-sm font-bold">
        {bridge.name}
      </TableCell>
      <TableCell href={bridge.href} className="text-sm font-bold">
        {bridge.name}
      </TableCell>
      <TableCell href={bridge.href} className="text-sm font-bold">
        {bridge.name}
      </TableCell>
      <TableCell
        href={bridge.href}
        className="pl-6 flex items-center justify-center"
      >
        <RiskGrissini values={bridgeRisks} />
      </TableCell>
    </>
  )
}
