'use client'
import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { TableCell, TableRow } from '~/components/table/table'
import { TableLink } from '~/components/table/table-link'
import { useTable } from '~/hooks/use-table'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
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
          <TableRow
            slug={row.original.slug}
            key={bridge.slug}
            className={getRowTypeClassNames({
              isEthereum: false,
            })}
          >
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
  bridge: DaRiskEntry['bridges'][number]
  excludeBridge?: boolean
}) {
  return (
    <>
      {excludeBridge ? (
        <TableCell />
      ) : (
        <TableCell className="text-sm font-medium first:pl-0">
          <TableLink href={`${bridge.href}#da-bridge`} className="ml-4 md:ml-1">
            {bridge.name}
          </TableLink>
        </TableCell>
      )}
      <TableCell className="pl-6">
        <TableValueCell
          emptyMode="n/a"
          value={bridge.risks.committeeSecurity}
        />
      </TableCell>
      <TableCell>
        <TableValueCell emptyMode="n/a" value={bridge.risks.upgradeability} />
      </TableCell>
      <TableCell>
        <TableValueCell emptyMode="n/a" value={bridge.risks.relayerFailure} />
      </TableCell>
    </>
  )
}
