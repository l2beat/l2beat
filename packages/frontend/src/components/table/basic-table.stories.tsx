import { ProjectId } from '@l2beat/shared-pure'
import { type StoryObj } from '@storybook/react'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import { type CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { BasicTable } from './basic-table'
import { ProjectNameCell } from './cells/project-name-cell'
import { getCommonProjectColumns } from './utils/common-project-columns/common-project-columns'

interface StorybookEntry extends CommonProjectEntry {
  name: string
  data: {
    a: number
    b: number
  }
}

const columnHelper = createColumnHelper<StorybookEntry>()

const basicTableColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.group({
    id: 'data',
    header: 'Grouped header',
    columns: [
      columnHelper.accessor('data', {
        header: 'A',
        cell: (ctx) => ctx.row.original.data.a,
      }),
      columnHelper.accessor('data.b', {
        header: 'B',
        cell: (ctx) => ctx.row.original.data.b,
      }),
    ],
  }),
  columnHelper.display({
    id: 'display-cell',
    header: 'Header with tooltip',
    cell: () => 'Tooltip cell',
    meta: {
      tooltip: 'Tooltip content goes here',
    },
  }),
]

const basicTableData: StorybookEntry[] = [
  {
    id: ProjectId('arbitrum'),
    slug: 'arbitrum',
    name: 'Arbitrum One',
    href: undefined,
    statuses: undefined,
    data: {
      a: 1,
      b: 2,
    },
  },
  {
    id: ProjectId('optimism'),
    slug: 'optimism',
    name: 'Optimism',
    href: undefined,
    statuses: undefined,
    data: {
      a: 3,
      b: 4,
    },
  },
  {
    id: ProjectId('base'),
    slug: 'base',
    name: 'Base',
    href: undefined,
    statuses: {
      redWarning: 'Some red warning',
    },
    data: {
      a: 5,
      b: 6,
    },
  },
  {
    id: ProjectId('zksync-era'),
    slug: 'zksync-era',
    name: 'zkSync Era',
    href: undefined,
    statuses: {
      underReview: 'config',
    },
    data: {
      a: 13,
      b: 11,
    },
  },
  {
    id: ProjectId('starknet'),
    slug: 'starknet',
    name: 'Starknet',
    href: undefined,
    statuses: {
      verificationWarning: true,
    },
    data: {
      a: 11,
      b: 13,
    },
  },
  {
    id: ProjectId('scroll'),
    slug: 'scroll',
    name: 'Scroll',
    href: undefined,
    statuses: undefined,
    data: {
      a: 22,
      b: 3,
    },
  },
  {
    id: ProjectId('linea'),
    slug: 'linea',
    name: 'Linea',
    href: undefined,
    statuses: {
      underReview: 'config',
    },
    data: {
      a: 10,
      b: 33,
    },
  },
  {
    id: ProjectId('metis'),
    slug: 'metis',
    name: 'Metis',
    href: undefined,
    statuses: undefined,
    data: {
      a: 19,
      b: 32,
    },
  },
]

const meta = {
  title: 'Components/Table/Basic',
  render: () => {
    const table = useTable({
      columns: basicTableColumns,
      data: basicTableData,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
    return <BasicTable table={table} />
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
