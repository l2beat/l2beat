import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { BasicTable } from '~/components/table/BasicTable'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { InfoIcon } from '~/icons/Info'
import { UnderReviewIcon } from '~/icons/UnderReview'
import {
  getLiquidStakingStatColumns,
  TVL_COLUMN_ID,
} from '~/pages/defi/liquid-staking/components/liquidStakingColumns'
import {
  ETH_STAKED_TOOLTIP,
  formatEthStaked,
} from '~/pages/defi/liquid-staking/liquidStakingMetrics'
import type { LiquidStakingStatsEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import type { LiquidStakingOverview } from '~/server/features/defi/liquid-staking/getLiquidStakingOverview'
import { formatTimestamp } from '~/utils/dates'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface LiquidStakingSectionProps
  extends ProjectSectionProps,
    LiquidStakingOverview {}

const columnHelper = createColumnHelper<LiquidStakingStatsEntry>()

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor((entry) => entry.shortName ?? entry.name, {
    id: 'name',
    header: 'Name',
    enableSorting: false,
    // ProjectNameCell would bring the listing tables' code to every project page.
    cell: (ctx) => (
      <TableLink
        href={ctx.row.original.href}
        className="gap-1.5 font-bold text-base"
      >
        {ctx.getValue()}
        {ctx.row.original.isUnderReview && (
          <UnderReviewIcon className="size-4" />
        )}
      </TableLink>
    ),
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.accessor((entry) => entry.tokens.join(', '), {
    id: 'tokens',
    header: 'Tokens',
    enableSorting: false,
    cell: (ctx) => <span className="text-sm">{ctx.getValue()}</span>,
  }),
  ...getLiquidStakingStatColumns(columnHelper),
]

const initialSorting: SortingState = [{ id: TVL_COLUMN_ID, desc: true }]

/** The liquid staking protocols with their latest numbers, linked to their pages. */
export function LiquidStakingSection({
  entries,
  ethStaked,
  ...sectionProps
}: LiquidStakingSectionProps) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable('EthereumLiquidStakingTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    onSortingChange: setSorting,
  })

  return (
    <ProjectSection {...sectionProps}>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        {ethStaked && (
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">
              {formatEthStaked(ethStaked.value)}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-secondary text-xs">
              staked on Ethereum
              <Tooltip>
                <TooltipTrigger aria-label="More info">
                  <InfoIcon className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                  {ETH_STAKED_TOOLTIP} Latest value from{' '}
                  {formatTimestamp(ethStaked.timestamp, { mode: 'date' })}.
                </TooltipContent>
              </Tooltip>
            </span>
          </div>
        )}
        <CustomLink href="/defi/liquid-staking" className="ml-auto text-sm">
          Compare risks
        </CustomLink>
      </div>
      <BasicTable table={table} />
    </ProjectSection>
  )
}
