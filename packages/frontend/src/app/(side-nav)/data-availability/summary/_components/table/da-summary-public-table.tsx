'use client'
import { ProjectId } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { GrissiniCell } from '~/components/rosette/grissini/grissini-cell'
import { TableCell, TableRow } from '~/components/table/table'
import { TableLink } from '~/components/table/table-link'
import { useTable } from '~/hooks/use-table'
import { UnverifiedIcon } from '~/icons/unverified'
import type {
  DaBridgeSummaryEntry,
  DaSummaryEntry,
} from '~/server/features/data-availability/summary/get-da-summary-entries'
import { cn } from '~/utils/cn'
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
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
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
            slug={row.original.slug}
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
  const isUnverified = bridge.statuses?.verificationWarning === true
  return (
    <>
      <TableCell
        className={cn(
          'text-sm font-medium first:pl-0',
          isUnverified && 'bg-red-100/70 dark:bg-red-900/70',
        )}
      >
        <TableLink
          href={bridge.href}
          className="ml-4 flex items-center gap-1.5 md:ml-1"
        >
          {bridge.name}
          {isUnverified && (
            <Tooltip>
              <TooltipTrigger>
                <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
              </TooltipTrigger>
              <TooltipContent>
                This bridge contains unverified contracts.
              </TooltipContent>
            </Tooltip>
          )}
        </TableLink>
      </TableCell>
      <TableCell
        className={cn(
          'flex items-center justify-center pl-4',
          isUnverified && 'bg-red-100/70 dark:bg-red-900/70',
        )}
      >
        <GrissiniCell
          values={bridge.risks}
          href={
            layer.id === ProjectId.ETHEREUM
              ? undefined
              : `/data-availability/risk?tab=${layer.tab}&highlight=${layer.slug}`
          }
          disabledOnMobile
        />
      </TableCell>
      <TableCell
        className={cn(
          'pr-[30px] text-sm font-medium md:pr-[42px]',
          isUnverified && 'bg-red-100/70 dark:bg-red-900/70',
        )}
        align="right"
      >
        {formatDollarValueNumber(bridge.tvs.latest)}
      </TableCell>
      <TableCell
        className={cn(
          'text-sm font-medium',
          isUnverified && 'bg-red-100/70 dark:bg-red-900/70',
        )}
      >
        <ProjectsUsedIn usedIn={bridge.usedIn} />
      </TableCell>
    </>
  )
}
