import { formatAddress, formatSeconds } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import { CustomLink } from '~/components/link/CustomLink'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { EM_DASH } from '~/consts/characters'
import { useTable } from '~/hooks/useTable'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropTokenDeploymentRow {
  chain: {
    name: string
    iconUrl: string | undefined
  }
  address: string
  explorerUrl: string | undefined
  symbol: string
  volume: number | null
  transferCount: number | null
  avgDuration: number | null
}

export interface InteropTokenDeploymentsSectionProps
  extends ProjectSectionProps {
  deployments: InteropTokenDeploymentRow[]
}

type DeploymentRow = InteropTokenDeploymentRow & BasicTableRow

const columnHelper = createColumnHelper<DeploymentRow>()
const columns = [
  columnHelper.accessor((row) => row.chain.name, {
    id: 'chain',
    header: 'Chain',
    cell: (ctx) => {
      const chain = ctx.row.original.chain
      return (
        <div className="flex items-center gap-2 whitespace-nowrap font-bold">
          {chain.iconUrl && (
            <img
              className="size-5 rounded-full bg-white shadow"
              src={chain.iconUrl}
              width={20}
              height={20}
              alt={`${chain.name} icon`}
            />
          )}
          <span className="capitalize">{chain.name}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    enableSorting: false,
    cell: (ctx) => {
      const { address, explorerUrl } = ctx.row.original
      const label = formatAddress(address)
      if (!explorerUrl) {
        return <span className="font-medium text-label-value-15">{label}</span>
      }
      return (
        <CustomLink href={explorerUrl} className="text-label-value-15">
          {label}
        </CustomLink>
      )
    },
  }),
  columnHelper.accessor('symbol', {
    header: 'Symbol',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {ctx.row.original.symbol}
      </span>
    ),
  }),
  columnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => {
      if (ctx.row.original.volume === null) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatCurrency(ctx.row.original.volume, 'usd')}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The total USD value of all transfers involving this deployment in the past 24 hours.',
    },
  }),
  columnHelper.accessor('transferCount', {
    header: 'Last 24h\ntransfer count',
    cell: (ctx) => {
      if (ctx.row.original.transferCount === null) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {ctx.row.original.transferCount}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The total number of transfers involving this deployment in the past 24 hours.',
    },
  }),
  columnHelper.accessor('avgDuration', {
    header: 'Last 24h avg.\ntransfer time',
    cell: (ctx) => {
      if (ctx.row.original.avgDuration === null) return EM_DASH
      return (
        <span className="font-medium text-label-value-15">
          {formatSeconds(ctx.row.original.avgDuration)}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The average time it takes for a transfer involving this deployment to be received on the destination chain, measured over the past 24 hours.',
    },
  }),
]

export function InteropTokenDeploymentsSection({
  deployments,
  ...sectionProps
}: InteropTokenDeploymentsSectionProps) {
  const table = useTable<DeploymentRow>({
    data: deployments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  return (
    <ProjectSection {...sectionProps}>
      <BasicTable table={table} tableWrapperClassName="pb-0" />
    </ProjectSection>
  )
}
