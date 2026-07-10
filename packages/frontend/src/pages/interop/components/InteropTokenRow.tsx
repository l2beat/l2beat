import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropScope } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { ChainIcon } from './ChainIcon'
import { InteropNoDataBadge } from './InteropNoDataBadge'
import { InteropTransferDetailsTrigger } from './InteropTransferDetailsTrigger'
import {
  type InteropTransferDefaults,
  InteropTransferTrigger,
} from './InteropTransferTrigger'

export interface InteropTokenRowData {
  tokenId: string
  iconUrl: string
  symbol: string
  href: string | undefined
  volume: number | null
  transferCount: number
  badge?: { color: string; iconUrl: string; label: string }
  topRoute?: {
    src: { id: string; iconUrl: string | undefined }
    dst: { id: string; iconUrl: string | undefined }
  }
  protocol?: { id: string; name: string; slug: string; iconUrl: string }
  transferScope?: InteropScope
}

export function InteropTokenRow({
  token,
  transfer,
}: {
  token: InteropTokenRowData
  transfer: InteropTransferDefaults
}) {
  const txsLabel = `${formatInteger(token.transferCount)} txs`
  const identity = (
    <>
      <img
        src={token.iconUrl}
        alt={token.symbol}
        className="size-6 shrink-0 rounded-full"
      />
      <span className="font-bold text-heading-16">{token.symbol}</span>
    </>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        {token.href ? (
          <a
            href={token.href}
            className="flex items-center gap-2 hover:underline"
          >
            {identity}
          </a>
        ) : (
          identity
        )}
        {token.badge && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex shrink-0 items-center gap-1 font-bold text-label-value-14"
                style={{ color: token.badge.color }}
              >
                <img
                  src={token.badge.iconUrl}
                  alt={token.badge.label}
                  className="size-4 rounded-sm"
                />
                <span className="@max-[450px]:hidden">{token.badge.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{token.badge.label}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
        {token.topRoute && (
          <div className="flex items-center gap-1 text-label-value-12 text-secondary">
            <span className="font-medium">Top path</span>
            <ChainIcon
              iconUrl={token.topRoute.src.iconUrl}
              alt={token.topRoute.src.id}
            />
            <ArrowRightIcon className="size-4 shrink-0 fill-brand" />
            <ChainIcon
              iconUrl={token.topRoute.dst.iconUrl}
              alt={token.topRoute.dst.id}
            />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        {token.volume === null ? (
          <InteropNoDataBadge />
        ) : (
          <span className="font-bold text-label-value-15 md:text-label-value-16">
            {formatCurrency(token.volume, 'usd', { decimals: 2 })}
          </span>
        )}
        {token.transferScope ? (
          <InteropTransferDetailsTrigger
            scope={token.transferScope}
            title={
              <>
                <span>Transfers for </span>
                <img
                  src={token.iconUrl}
                  alt={token.symbol}
                  className="relative bottom-0.5 mx-1 inline-block size-6 rounded-full"
                />
                <span>{token.symbol}</span>
              </>
            }
            tokenId={token.tokenId}
            selection={transfer.selection}
            snapshotTimestamp={transfer.snapshotTimestamp}
            className="cursor-pointer font-medium text-paragraph-14 text-secondary hover:underline md:text-paragraph-16"
          >
            {txsLabel}
          </InteropTransferDetailsTrigger>
        ) : token.protocol ? (
          <InteropTransferTrigger
            protocol={token.protocol}
            tokenId={token.tokenId}
            selection={transfer.selection}
            snapshotTimestamp={transfer.snapshotTimestamp}
            className="cursor-pointer font-medium text-paragraph-14 text-secondary hover:underline md:text-paragraph-16"
          >
            {txsLabel}
          </InteropTransferTrigger>
        ) : (
          <span className="font-medium text-paragraph-14 text-secondary md:text-paragraph-16">
            {txsLabel}
          </span>
        )}
      </div>
    </div>
  )
}
