import { type StoryObj } from '@storybook/react'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import { BasicTable } from './basic-table'
import { ProjectNameCell } from './cells/project-name-cell'
import { getCommonProjectColumns } from './utils/common-project-columns'

interface StorybookEntry {
  slug: string
  isVerified?: boolean
  redWarning?: string | undefined
  showProjectUnderReview?: boolean
  hasImplementationChanged?: boolean
  href?: string
  name: string
  data: {
    a: number
    b: number
    syncStatus?: never
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
    slug: 'arbitrum',
    name: 'Arbitrum One',
    data: {
      a: 1,
      b: 2,
    },
  },
  {
    slug: 'optimism',
    name: 'Optimism',
    data: {
      a: 3,
      b: 4,
    },
  },
  {
    slug: 'base',
    name: 'Base',
    redWarning: 'Some red warning',
    data: {
      a: 5,
      b: 6,
    },
  },
  {
    slug: 'zksync-era',
    name: 'zkSync Era',
    showProjectUnderReview: true,
    data: {
      a: 13,
      b: 11,
    },
  },
  {
    slug: 'starknet',
    name: 'Starknet',
    isVerified: false,
    data: {
      a: 11,
      b: 13,
    },
  },
  {
    slug: 'scroll',
    name: 'Scroll',
    data: {
      a: 22,
      b: 3,
    },
  },
  {
    slug: 'linea',
    name: 'Linea',
    hasImplementationChanged: true,
    data: {
      a: 10,
      b: 33,
    },
  },
  {
    slug: 'metis',
    name: 'Metis',
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
