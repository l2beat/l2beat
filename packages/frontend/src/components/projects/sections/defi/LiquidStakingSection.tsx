import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { CustomLink } from '~/components/link/CustomLink'
import { BasicTable } from '~/components/table/BasicTable'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { useTable } from '~/hooks/useTable'
import {
  getLiquidStakingNameColumn,
  getLiquidStakingStatColumns,
  TVL_COLUMN_ID,
} from '~/pages/defi/liquid-staking/components/liquidStakingColumns'
import {
  ETH_STAKED_TITLE,
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
  getLiquidStakingNameColumn(columnHelper),
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
      {ethStaked && (
        <ChartStats className="mb-4 md:grid-cols-1 lg:grid-cols-1">
          <ChartStatsItem
            label={ETH_STAKED_TITLE}
            tooltip={`${ETH_STAKED_TOOLTIP} Latest value from ${formatTimestamp(ethStaked.timestamp, { mode: 'date' })}.`}
          >
            {formatEthStaked(ethStaked.value)}
          </ChartStatsItem>
        </ChartStats>
      )}
      <BasicTable table={table} />
      <CustomLink href="/defi/liquid-staking" className="mt-4 inline-block">
        Compare risks
      </CustomLink>
    </ProjectSection>
  )
}
