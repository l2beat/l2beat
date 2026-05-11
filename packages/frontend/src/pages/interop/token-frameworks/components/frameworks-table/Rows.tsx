import { ArrowRightIcon } from '~/icons/ArrowRight'
import type {
  FrameworkChainPathItem,
  TopTokenItem,
} from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function TokenRow({ token }: { token: TopTokenItem }) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <img
          src={token.iconUrl}
          alt={token.symbol}
          className="size-4 shrink-0 rounded-sm"
        />
        <span className="truncate font-medium text-label-value-13">
          {token.symbol}
        </span>
      </div>
      <RowStats volume={token.volume} transferCount={token.transferCount} />
    </div>
  )
}

export function ChainPathRow({ path }: { path: FrameworkChainPathItem }) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1">
        <ChainIcon iconUrl={path.src.iconUrl} alt={path.src.id} />
        <ArrowRightIcon className="size-3 fill-brand" />
        <ChainIcon iconUrl={path.dst.iconUrl} alt={path.dst.id} />
      </div>
      <RowStats volume={path.volume} transferCount={path.transferCount} />
    </div>
  )
}

function ChainIcon({
  iconUrl,
  alt,
}: {
  iconUrl: string | undefined
  alt: string
}) {
  if (!iconUrl) {
    return <span className="size-4 rounded-sm bg-surface-secondary" />
  }
  return (
    <img src={iconUrl} alt={alt} className="size-4 rounded-sm object-contain" />
  )
}

export function RowStats({
  volume,
  transferCount,
}: {
  volume: number
  transferCount: number
}) {
  return (
    <div className="flex items-baseline gap-1.5 whitespace-nowrap text-paragraph-14">
      <span className="font-medium text-secondary">
        {formatInteger(transferCount)} txs
      </span>
      <span className="font-bold">
        {formatCurrency(volume, 'usd', { decimals: 1 })}
      </span>
    </div>
  )
}
