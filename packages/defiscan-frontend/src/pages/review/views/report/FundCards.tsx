import { useState } from 'react'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { Badge } from '../../../../components/Badge'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import type {
  CompiledReview,
  CompiledFundHolder,
  CompiledAdmin,
} from '../../../../types'

interface FundCardsProps {
  review: CompiledReview
  forceExpanded?: boolean
}

const BAR_COLORS = [
  '#7C3AED',
  '#8B5CF6',
  '#A78BFA',
  '#C4B5FD',
]

const TOKEN_BAR_COLORS = [
  '#F59E0B',
  '#FBBF24',
  '#FCD34D',
  '#FDE68A',
]

function getAdminsForFund(
  review: CompiledReview,
  fundAddress: string,
): CompiledAdmin[] {
  const normalized = fundAddress.toLowerCase()
  return review.admins.filter(
    (admin) =>
      (admin.adminType === 'EOA' ||
        admin.adminType === 'EOAPermissioned' ||
        admin.adminType === 'Multisig' ||
        admin.adminType === 'Timelock' ||
        admin.isGovernance) &&
      admin.functions.some(
        (f) => f.contractAddress.toLowerCase() === normalized,
      ),
  )
}

export function FundCards({ review, forceExpanded }: FundCardsProps) {
  const { funds, totals } = review
  const [expandedFunds, setExpandedFunds] = useState<Set<string>>(new Set())
  const hasTokens = funds.some((f) => f.tokenInfo && f.tokenInfo.tokenValue > 0)
  const [includeTokens, setIncludeTokens] = useState(true)

  if (funds.length === 0) {
    return (
      <p className="text-text-secondary">
        No TVL data is currently available for this protocol.
      </p>
    )
  }

  const unifiedData = funds
    .map((f) => {
      const tvl =
        (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0)
      const tokenValue = f.tokenInfo?.tokenValue ?? 0
      return { fund: f, tvl, tokenValue }
    })
    .filter(
      (d) => d.tvl > 0 || (includeTokens && hasTokens && d.tokenValue > 0),
    )
    .sort((a, b) => {
      const showTokens = includeTokens && hasTokens
      const aTotal = a.tvl + (showTokens ? a.tokenValue : 0)
      const bTotal = b.tvl + (showTokens ? b.tokenValue : 0)
      return bTotal - aTotal
    })

  const showTokens = includeTokens && hasTokens
  const chartTotal = unifiedData.reduce(
    (sum, d) => sum + d.tvl + (showTokens ? d.tokenValue : 0),
    0,
  )
  // Token names for intro text
  const tokenNames = funds
    .filter((f) => f.tokenInfo)
    .map((f) => f.tokenInfo!.symbol)
    .filter((s, i, arr) => arr.indexOf(s) === i)

  const totalTvl = unifiedData.reduce((sum, d) => sum + d.tvl, 0)
  const totalTokenValue = unifiedData.reduce((sum, d) => sum + d.tokenValue, 0)

  function toggleFund(key: string) {
    setExpandedFunds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const chartTitle = showTokens
    ? 'TVS Distribution (Total Value Secured)'
    : 'TVL Distribution'

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        {showTokens ? (
          <>
            The protocol secures{' '}
            <span className="font-semibold text-text-primary">
              {formatUsdValue(chartTotal)}
            </span>{' '}
            in Total Value Secured across {funds.length} contract
            {funds.length !== 1 ? 's' : ''}, combining{' '}
            <span className="font-semibold text-capital">
              {formatUsdValue(totalTvl)}
            </span>{' '}
            in TVL and{' '}
            <span className="font-semibold text-token">
              {formatUsdValue(totalTokenValue)}
            </span>{' '}
            in protocol token market cap.
          </>
        ) : (
          <>
            The protocol holds{' '}
            <span className="font-semibold text-capital">
              {formatUsdValue(totalTvl)}
            </span>{' '}
            across {funds.length} contract{funds.length !== 1 ? 's' : ''}.
            {totals.totalTokenValueAtRisk > 0 && tokenNames.length > 0 && (
              <>
                {' '}
                Additionally, the protocol
                {tokenNames.length === 1 ? "'s native token" : ' issues'}{' '}
                {tokenNames.map((name, i) => (
                  <span key={name}>
                    {i > 0 && (i === tokenNames.length - 1 ? ' and ' : ', ')}
                    <span className="font-semibold text-token">{name}</span>
                  </span>
                ))}{' '}
                {tokenNames.length === 1 ? 'has' : 'have'} a combined market
                cap of{' '}
                <UsdValue value={totals.totalTokenValueAtRisk} variant="token" />
                .
              </>
            )}
          </>
        )}{' '}
        Here's where the money sits and what controls it.
      </p>

      {/* Unified Distribution Chart */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-text-primary">
            {chartTitle}
          </h3>
          {hasTokens && (
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none" data-print-hide>
              <input
                type="checkbox"
                checked={includeTokens}
                onChange={(e) => setIncludeTokens(e.target.checked)}
                className="rounded border-border text-purple-600 focus:ring-purple-500"
              />
              Include Protocol Tokens
            </label>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: BAR_COLORS[0] }}
            />
            TVL
          </span>
          {showTokens && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: TOKEN_BAR_COLORS[0] }}
              />
              Token Market Cap
            </span>
          )}
        </div>

        <div className="space-y-3">
          {unifiedData.map((entry, index) => {
            const entryTotal =
              entry.tvl + (showTokens ? entry.tokenValue : 0)
            const tvlPct =
              chartTotal > 0 ? (entry.tvl / chartTotal) * 100 : 0
            const tokenPct =
              showTokens && chartTotal > 0
                ? (entry.tokenValue / chartTotal) * 100
                : 0
            const expandKey = `fund-${entry.fund.address}`
            const isExpanded = forceExpanded || expandedFunds.has(expandKey)
            const admins = getAdminsForFund(review, entry.fund.address)

            // Use token symbol in name for token-only entries
            const displayName =
              entry.tvl === 0 && entry.fund.tokenInfo
                ? `${entry.fund.tokenInfo.symbol} (${entry.fund.name})`
                : entry.fund.name

            return (
              <div key={expandKey}>
                <button
                  type="button"
                  onClick={() => toggleFund(expandKey)}
                  className="w-full text-left cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-primary font-medium truncate mr-4 flex items-center gap-1.5">
                      <span
                        className="text-text-muted text-xs"
                        data-print-hide
                      >
                        {isExpanded ? '\u25BC' : '\u25B6'}
                      </span>
                      {displayName}
                    </span>
                    <span className="font-semibold shrink-0 text-capital">
                      {formatUsdValue(entryTotal)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-bg-muted overflow-hidden flex">
                    {tvlPct > 0 && (
                      <div
                        className="h-full transition-all first:rounded-l-full"
                        style={{
                          width: `${Math.max(tvlPct, 0.5)}%`,
                          backgroundColor:
                            BAR_COLORS[index % BAR_COLORS.length],
                        }}
                      />
                    )}
                    {tokenPct > 0 && (
                      <div
                        className="h-full transition-all last:rounded-r-full"
                        style={{
                          width: `${Math.max(tokenPct, 0.5)}%`,
                          backgroundColor:
                            TOKEN_BAR_COLORS[index % TOKEN_BAR_COLORS.length],
                        }}
                      />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <FundExpandedContent fund={entry.fund} admins={admins} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FundExpandedContent({
  fund,
  admins,
}: {
  fund: CompiledFundHolder
  admins: CompiledAdmin[]
}) {
  return (
    <div className="mt-2 ml-4 rounded-lg border border-border/60 bg-bg-muted/30 p-4 space-y-3">
      <div>
        <AddressDisplay address={fund.address} />
      </div>

      {fund.tokenInfo && (
        <div className="flex items-center gap-2">
          <Badge variant="purple">{fund.tokenInfo.symbol}</Badge>
          <span className="text-sm text-text-secondary">
            Market Cap:{' '}
            <UsdValue
              value={fund.tokenInfo.tokenValue}
              variant="token"
              className="text-sm"
            />
          </span>
        </div>
      )}

      {fund.description && (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {fund.description}
          </p>
        </div>
      )}

      {admins.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">
            Controlled by
          </p>
          <ul className="space-y-1">
            {admins.map((admin) => (
              <li
                key={admin.address}
                className="text-sm text-text-secondary flex items-center gap-1.5"
              >
                <span className="text-text-muted">&bull;</span>
                <a
                  href={`#admin-${admin.address}`}
                  className="font-medium text-text-primary hover:text-purple-600 hover:underline transition-colors"
                >
                  {admin.name}
                </a>
                <span className="text-text-muted text-xs">
                  ({admin.adminType})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
