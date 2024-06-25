import { createColumnHelper } from '@tanstack/react-table'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { TotalCell } from '../total-cell'
import { type ScalingSummaryLayer3sEntry } from '~/server/features/scaling/types'

const columnHelper = createColumnHelper<ScalingSummaryLayer3sEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell index={ctx.row.index} />,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-w-[18px] min-h-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: { cellClassName: '!pr-0' },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} type="layer2" />,
  }),
  columnHelper.accessor('type.category', {
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
  columnHelper.accessor('type.provider', {
    header: 'Technology',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value === 'Arbitrum' ? 'Arbitrum Orbit' : value
    },
    enableSorting: false,
    meta: {
      tooltip: 'The technology stack used.',
    },
  }),
  columnHelper.accessor('hostChainName', {
    header: 'Host chain',
    enableSorting: false,

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
  columnHelper.accessor('tvlData', {
    id: 'total',
    header: 'Total',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) {
        return <UpcomingBadge />
      }

      return <TotalCell data={value} />
    },
    sortUndefined: 'last',
    meta: {
      headClassName: 'justify-end',
      cellClassName: 'justify-end',
      tooltip:
        'Total value locked in escrow contracts on the base chain displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
    },
  }),
]
