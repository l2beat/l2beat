import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { type ScalingSummaryTableRow } from '../../../_utils/to-table-rows'
import { TotalCell } from '../total-cell'

const columnHelper = createColumnHelper<ScalingSummaryTableRow>()

export const summaryLayer3sColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => <TypeCell>{ctx.getValue()}</TypeCell>,
    meta: {
      tooltip: (
        <div>
          <div className="mb-1">
            Type of this project. Determines data availability and proof system
            used.
          </div>
          ZK Rollups = Validity Proofs + onchain data
          <br />
          Optimistic Rollups = Fraud Proofs + onchain data
          <br />
          Validiums = Validity Proofs + offchain data
          <br />
          Optimiums = Fraud Proofs + offchain data
        </div>
      ),
    },
  }),
  columnHelper.accessor('provider', {
    header: 'Technology',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === 'Arbitrum' ? 'Arbitrum Orbit' : value
    },
    meta: {
      tooltip: 'The technology stack used.',
    },
  }),
  columnHelper.accessor('hostChain', {
    header: 'Host chain',
    meta: {
      tooltip: 'The technology stack used.',
    },
  }),
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
    meta: {
      tooltip: 'Functionality supported by this project.',
    },
  }),
  columnHelper.accessor(
    (e) => ({ breakdown: e.latestTvl, change: e.tvlChange }),
    {
      id: 'total',
      header: 'Total',
      cell: (ctx) => {
        const value = ctx.getValue()
        if (!value.breakdown) {
          return <UpcomingBadge />
        }

        return (
          <TotalCell
            breakdown={value.breakdown}
            change={value.change ?? undefined}
          />
        )
      },
      sortUndefined: 'last',
      meta: {
        headClassName: 'justify-end',
        cellClassName: 'justify-end',
        tooltip:
          'Total value locked in escrow contracts on the base chain displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      },
    },
  ),
]
