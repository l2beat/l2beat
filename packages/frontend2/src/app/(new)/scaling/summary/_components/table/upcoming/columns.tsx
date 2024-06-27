import { createColumnHelper } from '@tanstack/react-table'
import { TypeCell } from '~/app/_components/table/cells/type-cell'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import {
  type ScalingSummaryLayer3sEntry,
  type ScalingSummaryLayer2sEntry,
} from '~/server/features/scaling/types'

const columnHelper = createColumnHelper<
  ScalingSummaryLayer2sEntry | ScalingSummaryLayer3sEntry
>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell index={ctx.row.index} />,
    meta: {
      headClassName: 'w-0',
    },
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
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
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
  columnHelper.accessor('purposes', {
    header: 'Purpose',
    cell: (ctx) => ctx.getValue().join(', '),
    enableSorting: false,
    meta: {
      tooltip: 'Functionality supported by this project.',
    },
  }),
]
