import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TableCell, TableRow } from '~/components/table/Table'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import {
  UNDER_REVIEW_DA_CLASSNAME,
  UNVERIFIED_DA_CLASSNAME,
} from '~/pages/data-availability/summary/components/table/DaSummaryPublicTable'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { cn } from '~/utils/cn'
import { getUnderReviewText } from '~/utils/project/underReview'
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../components/BasicDaTable'
import { customColumns, publicColumns } from './columns'

export function DaRiskTable({
  items,
  excludeBridge = false,
}: {
  items: DaRiskEntry[]
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
  bridge: DaRiskEntry['bridges'][number]
  excludeBridge?: boolean
}) {
  const isUnverified = bridge.statuses?.verificationWarning === true

  return (
    <>
      {excludeBridge ? (
        <TableCell />
      ) : (
        <TableCell
          className={cn(
            'font-medium text-sm first:pl-0',
            isUnverified && UNVERIFIED_DA_CLASSNAME,
            bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
          )}
        >
          <TableLink
            href={`${bridge.href}#da-bridge`}
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
            {bridge.statuses?.underReview && (
              <Tooltip>
                <TooltipTrigger>
                  <UnderReviewIcon className="size-3.5 md:size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  {getUnderReviewText(bridge.statuses?.underReview)}
                </TooltipContent>
              </Tooltip>
            )}
          </TableLink>
        </TableCell>
      )}
      <TableCell
        className={cn(
          'pl-6',
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
        )}
      >
        <TableValueCell
          emptyMode="n/a"
          value={bridge.risks.committeeSecurity}
        />
      </TableCell>
      <TableCell
        className={cn(
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
        )}
      >
        <TableValueCell emptyMode="n/a" value={bridge.risks.upgradeability} />
      </TableCell>
      <TableCell
        className={cn(
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
        )}
      >
        <TableValueCell emptyMode="n/a" value={bridge.risks.relayerFailure} />
      </TableCell>
    </>
  )
}
