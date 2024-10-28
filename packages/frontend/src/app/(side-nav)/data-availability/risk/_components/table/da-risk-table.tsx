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
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../_components/basic-da-table'
import { customColumns, publicColumns } from './columns'

export function DaRiskTable({
  items,
  excludeBridge = false,
}: { items: DaRiskEntry[]; excludeBridge?: boolean }) {
  const table = useTable({
    columns: excludeBridge ? customColumns : publicColumns,
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
            <BridgeCells excludeBridge={excludeBridge} bridge={bridge} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<DaRiskEntry> }) => {
    if (row.original.bridges.length === 0) {
      return null
    }

    return (
      <BridgeCells
        excludeBridge={excludeBridge}
        bridge={row.original.bridges[0]!}
      />
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
  bridge,
  excludeBridge = false,
}: {
  bridge: (DaRiskEntry | DaSummaryEntry)['bridges'][number]
  excludeBridge?: boolean
}) {
  return (
    <>
      {excludeBridge ? (
        <TableCell href={bridge.href} />
      ) : (
        <TableCell
          href={bridge.href}
          className="text-sm font-medium group-first:pl-0"
        >
          <div className="pl-4">{bridge.name}</div>
        </TableCell>
      )}
      <TableCell href={bridge.href} className="pl-6">
        <RiskCell risk={bridge.risks.committeeSecurity} />
      </TableCell>
      <TableCell href={bridge.href}>
        <RiskCell risk={bridge.risks.upgradeability} />
      </TableCell>
      <TableCell href={bridge.href}>
        <RiskCell risk={bridge.risks.relayerFailure} />
      </TableCell>
    </>
  )
}
