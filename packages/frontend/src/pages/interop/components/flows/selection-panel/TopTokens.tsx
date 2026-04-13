import type { FlowToken } from '~/server/features/scaling/interop/getInteropFlows'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function TopTokens({ tokens }: { tokens: FlowToken[] }) {
  if (tokens.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12">TOP TOKENS</div>
      <div className="space-y-1">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center justify-between gap-2 text-[13px]"
          >
            <span className="flex items-center gap-1 font-medium text-secondary leading-none">
              <img src={token.iconUrl} alt={token.symbol} className="size-4" />
              <span>{token.symbol}</span>
            </span>
            <span className="font-semibold leading-[1.15]">
              {formatCurrency(token.volume, 'usd')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
