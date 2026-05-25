import { formatAddress } from '@l2beat/shared-pure'
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectSection } from '~/components/projects/sections/ProjectSection'
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropTokenDeploymentData } from '~/server/features/scaling/interop/getInteropTokenData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'

type DeploymentRow = InteropTokenDeploymentData &
  BasicTableRow & {
    chainName: string
    chainIconUrl: string | undefined
    chainExplorerUrl: string | undefined
  }

const columnHelper = createColumnHelper<DeploymentRow>()
const columns = [
  columnHelper.accessor('chainName', {
    header: 'Chain',
    cell: (ctx) => (
      <div className="flex items-center gap-2">
        {ctx.row.original.chainIconUrl && (
          <img
            src={ctx.row.original.chainIconUrl}
            alt={ctx.row.original.chainName}
            className="size-5 shrink-0"
          />
        )}
        <span className="font-bold text-label-value-15">
          {ctx.row.original.chainName}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('symbol', {
    header: 'Symbol',
    enableSorting: false,
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {ctx.row.original.symbol}
      </span>
    ),
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    enableSorting: false,
    cell: (ctx) => {
      const { address, chainExplorerUrl } = ctx.row.original
      const className = 'font-medium font-mono text-label-value-13'
      const content = chainExplorerUrl ? (
        <a
          href={`${chainExplorerUrl}/address/${address}`}
          target="_blank"
          rel="noreferrer noopener"
          className={`${className} text-link hover:underline`}
        >
          {formatAddress(address)}
        </a>
      ) : (
        <span className={className}>{formatAddress(address)}</span>
      )

      return (
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="z-[1000] max-w-none font-mono text-label-value-13">
              {address}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )
    },
  }),
  columnHelper.accessor('volume', {
    header: 'Last 24h\nVolume',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatCurrency(ctx.row.original.volume, 'usd')}
      </span>
    ),
    meta: { align: 'right', headClassName: 'text-right' },
  }),
  columnHelper.accessor('transferCount', {
    header: 'Last 24h\ntransfer count',
    cell: (ctx) => (
      <span className="font-medium text-label-value-15">
        {formatInteger(ctx.row.original.transferCount)}
      </span>
    ),
    meta: { align: 'right', headClassName: 'text-right' },
  }),
]

export function OnchainDeploymentsSection({
  sectionOrder,
  deployments,
  interopChains,
  isLoading,
}: {
  sectionOrder: string
  deployments: InteropTokenDeploymentData[] | undefined
  interopChains: InteropChainWithIcon[]
  isLoading: boolean
}) {
  const chainsById = useMemo(
    () => new Map(interopChains.map((chain) => [chain.id, chain])),
    [interopChains],
  )
  const rows = useMemo(
    () =>
      (deployments ?? []).map((deployment) => {
        const chain = chainsById.get(deployment.chain)
        return {
          ...deployment,
          chainName: chain?.name ?? deployment.chain,
          chainIconUrl: chain?.iconUrl,
          chainExplorerUrl: chain?.explorerUrl,
        }
      }),
    [deployments, chainsById],
  )

  const table = useTable<DeploymentRow>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ProjectSection
      id="contracts"
      title="Onchain deployments"
      sectionOrder={sectionOrder}
    >
      {isLoading ? (
        <Skeleton className="h-[220px] w-full" />
      ) : rows.length > 0 ? (
        <BasicTable table={table} tableWrapperClassName="pb-0" />
      ) : (
        <div className="rounded-lg bg-surface-secondary px-4 py-3 font-medium text-label-value-14 text-secondary">
          No tracked deployments for this token.
        </div>
      )}
    </ProjectSection>
  )
}
