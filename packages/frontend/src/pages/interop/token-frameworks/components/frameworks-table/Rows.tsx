import type { ReactNode } from 'react'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type {
  FrameworkChainPathItem,
  TopTokenItem,
} from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { ChainIcon } from '../../../components/ChainIcon'
import {
  type InteropTransferDefaults,
  InteropTransferTrigger,
} from '../../../components/InteropTransferTrigger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export function TokenRow({
  token,
  framework,
  href,
  transfer,
}: {
  token: TopTokenItem
  framework: InteropTokenFramework
  href: string | undefined
  transfer: InteropTransferDefaults
}) {
  const identity = (
    <>
      <img
        src={token.iconUrl}
        alt={token.symbol}
        className="size-4 shrink-0 rounded-sm"
      />
      <span className="truncate font-medium text-label-value-13">
        {token.symbol}
      </span>
    </>
  )
  return (
    <div className="flex h-7 shrink-0 items-center justify-between gap-2">
      {href ? (
        <a
          href={href}
          className="flex min-w-0 items-center gap-1.5 hover:underline"
        >
          {identity}
        </a>
      ) : (
        <div className="flex min-w-0 items-center gap-1.5">{identity}</div>
      )}
      <RowStats
        volume={token.volume}
        transferCount={token.transferCount}
        txsTrigger={
          token.isUnknown ? undefined : (
            <InteropTransferTrigger
              protocol={{
                id: framework.projectId,
                name: framework.name,
                slug: framework.slug,
                iconUrl: framework.iconUrl,
              }}
              tokenId={token.id}
              selection={transfer.selection}
              snapshotTimestamp={transfer.snapshotTimestamp}
              className="cursor-pointer font-medium text-secondary hover:underline"
            >
              {formatInteger(token.transferCount)} txs
            </InteropTransferTrigger>
          )
        }
      />
    </div>
  )
}

export function ChainPathRow({
  path,
  framework,
  transfer,
}: {
  path: FrameworkChainPathItem
  framework: InteropTokenFramework
  transfer: InteropTransferDefaults
}) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1">
        <ChainIcon iconUrl={path.src.iconUrl} alt={path.src.id} />
        <ArrowRightIcon className="size-3 fill-brand" />
        <ChainIcon iconUrl={path.dst.iconUrl} alt={path.dst.id} />
      </div>
      <RowStats
        volume={path.volume}
        transferCount={path.transferCount}
        txsTrigger={
          <InteropTransferTrigger
            protocol={{
              id: framework.projectId,
              name: framework.name,
              slug: framework.slug,
              iconUrl: framework.iconUrl,
            }}
            selection={{ from: [path.src.id], to: [path.dst.id] }}
            snapshotTimestamp={transfer.snapshotTimestamp}
            className="cursor-pointer font-medium text-secondary hover:underline"
          >
            {formatInteger(path.transferCount)} txs
          </InteropTransferTrigger>
        }
      />
    </div>
  )
}

export function RowStats({
  volume,
  transferCount,
  txsTrigger,
}: {
  volume: number
  transferCount: number
  txsTrigger?: ReactNode
}) {
  return (
    <div className="flex items-baseline gap-1.5 whitespace-nowrap text-paragraph-14">
      {txsTrigger ?? (
        <span className="font-medium text-secondary">
          {formatInteger(transferCount)} txs
        </span>
      )}
      <span className="font-bold">
        {formatCurrency(volume, 'usd', { decimals: 1 })}
      </span>
    </div>
  )
}
