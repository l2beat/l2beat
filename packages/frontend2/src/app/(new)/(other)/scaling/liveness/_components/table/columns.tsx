import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { type ScalingLivenessTableEntry } from './to-table-entry'
import { TypeCell } from '~/app/_components/table/cells/type-cell'

const columnHelper = createColumnHelper<ScalingLivenessTableEntry>()

export const columns = [
  // TODO: Make sure this is centered
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'flex items-center',
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
      cellClassName: '!pr-0 md:pl-1',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
  columnHelper.group({
    id: 'data',
    header: 'Average intervals',
    columns: [
      columnHelper.accessor('data.batchSubmissions.averageInSeconds', {
        header: 'Tx data\nsubmissions',
        cell: (ctx) => <div>{ctx.getValue()}</div>,
        sortUndefined: 'last',
      }),
      columnHelper.accessor('data.proofSubmissions.averageInSeconds', {
        header: 'Proof\nsubmissions',
        cell: (ctx) => <div>{ctx.getValue()}</div>,
        sortUndefined: 'last',
      }),
      columnHelper.accessor('data.stateUpdates.averageInSeconds', {
        header: 'State\nupdates',
        cell: (ctx) => <div>{ctx.getValue()}</div>,
        sortUndefined: 'last',
      }),
    ],
  }),
  columnHelper.accessor('category', {
    header: 'Type',
    cell: (ctx) => (
      <TypeCell provider={ctx.row.original.provider}>{ctx.getValue()}</TypeCell>
    ),
  }),
]
