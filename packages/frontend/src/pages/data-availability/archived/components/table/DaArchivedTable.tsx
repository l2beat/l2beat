import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TableCell, TableRow } from '~/components/table/Table'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { DaArchivedEntry } from '~/server/features/data-availability/archived/getDaArchivedEntries'
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../components/BasicDaTable'
import { customColumns, publicColumns } from './columns'

export function DaArchivedTable({
  items,
  excludeBridge = false,
}: {
  items: DaArchivedEntry[]
  excludeBridge?: boolean
}) {
  const table = useTable({
    columns: excludeBridge ? customColumns : publicColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  const renderSpanFill = ({ row }: { row: Row<DaArchivedEntry> }) => {
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

  const renderInlineSpanFill = ({ row }: { row: Row<DaArchivedEntry> }) => {
    if (!row.original.bridges[0]) {
      return null
    }

    return (
      <BridgeCells
        excludeBridge={excludeBridge}
        bridge={row.original.bridges[0]}
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
  bridge: DaArchivedEntry['bridges'][number]
  excludeBridge?: boolean
}) {
  return (
    <>
      {excludeBridge ? (
        <TableCell />
      ) : (
        <TableCell className="font-medium text-sm first:pl-0">
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
