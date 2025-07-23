import { ProjectId } from '@l2beat/shared-pure'
import type { Row } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { GrissiniCell } from '~/components/rosette/grissini/GrissiniCell'
import { TableCell, TableRow } from '~/components/table/Table'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type {
  DaBridgeSummaryEntry,
  DaSummaryEntry,
} from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { cn } from '~/utils/cn'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { getUnderReviewText } from '~/utils/project/underReview'
import { ProjectsUsedIn } from '../../../../../components/ProjectsUsedIn'
import {
  BasicDaTable,
  getRowTypeClassNames,
} from '../../../components/BasicDaTable'
import { publicSystemsColumns } from './columns'

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
    if (!row.original.bridges[0]) {
      return null
    }

    return <BridgeCells layer={row.original} bridge={row.original.bridges[0]} />
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
          'font-medium text-sm first:pl-0',
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
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
      <TableCell
        className={cn(
          'flex items-center justify-center pl-4',
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
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
          'pr-[30px] font-medium text-sm md:pr-[42px]',
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
        )}
        align="right"
      >
        {formatDollarValueNumber(bridge.tvs.latest)}
      </TableCell>
      <TableCell
        className={cn(
          'font-medium text-sm',
          isUnverified && UNVERIFIED_DA_CLASSNAME,
          bridge.statuses?.underReview && UNDER_REVIEW_DA_CLASSNAME,
        )}
      >
        <ProjectsUsedIn usedIn={bridge.usedIn} />
      </TableCell>
    </>
  )
}

export const UNVERIFIED_DA_CLASSNAME = 'bg-red-100/70 dark:bg-red-900/70'
export const UNDER_REVIEW_DA_CLASSNAME = 'bg-yellow-200/10'
