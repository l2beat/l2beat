import { useState } from 'react'
import { clsx } from 'clsx'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { Badge } from '../../../../components/Badge'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import type { CompiledReview, CompiledFundHolder } from '../../../../types'

interface FundCardsProps {
  review: CompiledReview
}

const BAR_COLORS = [
  '#7C3AED',
  '#8B5CF6',
  '#A78BFA',
  '#C4B5FD',
  '#3B82F6',
  '#10B981',
]


export function FundCards({ review }: FundCardsProps) {
  const { funds, totals } = review
  const [expandedFunds, setExpandedFunds] = useState<Set<string>>(new Set())

  const toggleFund = (address: string) => {
    setExpandedFunds((prev) => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  if (funds.length === 0) {
    return (
      <p className="text-text-secondary">
        No fund data is currently available for this protocol.
      </p>
    )
  }

  const totalFunds = funds.reduce(
    (sum, f) =>
      sum +
      (f.balances?.totalUsdValue ?? 0) +
      (f.positions?.totalUsdValue ?? 0),
    0,
  )

  const chartData = funds
    .map((f) => ({
      address: f.address,
      name: f.name.length > 30 ? `${f.name.slice(0, 27)}...` : f.name,
      fullName: f.name,
      value:
        (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const fundByAddress = new Map(funds.map((f) => [f.address, f]))

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        The protocol holds{' '}
        <span className="font-semibold text-capital">
          {formatUsdValue(totalFunds)}
        </span>{' '}
        across {funds.length} contract{funds.length !== 1 ? 's' : ''}.
        {totals.totalTokenValueAtRisk > 0 && (
          <>
            {' '}
            Additionally, the protocol's native token{' '}
            <span className="font-semibold text-token">
              {review.metadata.tokenName}
            </span>{' '}
            has a market cap of{' '}
            <UsdValue value={totals.totalTokenValueAtRisk} variant="token" />.
          </>
        )}{' '}
        Here's where the money sits and what controls it.
      </p>

      {/* Expandable bar visualization for fund distribution */}
      {chartData.length > 1 && (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm mb-8">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Fund Distribution
          </h3>
          <div className="space-y-3">
            {chartData.map((entry, index) => {
              const percentage = totalFunds > 0 ? (entry.value / totalFunds) * 100 : 0
              const isExpanded = expandedFunds.has(entry.address)
              const fund = fundByAddress.get(entry.address)

              return (
                <div key={entry.address}>
                  <button
                    type="button"
                    onClick={() => toggleFund(entry.address)}
                    className="w-full text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className={clsx(
                          'w-3 h-3 text-text-muted transition-transform shrink-0',
                          isExpanded && 'rotate-90',
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <div className="flex items-center justify-between flex-1 text-sm">
                        <span className="text-text-primary font-medium truncate mr-4 group-hover:text-purple-600 transition-colors">
                          {entry.fullName}
                        </span>
                        <span className="text-text-secondary shrink-0">
                          {formatUsdValue(entry.value)}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-bg-muted overflow-hidden ml-5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(percentage, 1)}%`,
                          backgroundColor:
                            BAR_COLORS[index % BAR_COLORS.length],
                        }}
                      />
                    </div>
                  </button>

                  {isExpanded && fund && (
                    <div className="ml-5 mt-3 mb-2">
                      <FundCardInline fund={fund} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Standalone fund cards only when no chart (single fund holder) */}
      {chartData.length <= 1 && (
        <div className="space-y-4">
          {funds.map((fund) => (
            <FundCard key={fund.address} fund={fund} />
          ))}
        </div>
      )}
    </div>
  )
}

function FundCard({ fund }: { fund: CompiledFundHolder }) {
  const totalValue =
    (fund.balances?.totalUsdValue ?? 0) + (fund.positions?.totalUsdValue ?? 0)

  const hasBalances = fund.balances && fund.balances.totalUsdValue > 0
  const hasPositions = fund.positions && fund.positions.totalUsdValue > 0

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-lg">
            {fund.name}
          </h3>
          <div className="mt-1">
            <AddressDisplay address={fund.address} />
          </div>
        </div>
        <div className="text-right shrink-0">
          {totalValue > 0 && (
            <UsdValue
              value={totalValue}
              variant="capital"
              className="text-xl font-bold"
            />
          )}
        </div>
      </div>

      {/* Breakdown bar */}
      {hasBalances && hasPositions && totalValue > 0 && (
        <div className="mt-4">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-bg-muted">
            <div
              className="bg-purple-500 rounded-l-full transition-all"
              style={{
                width: `${(fund.balances!.totalUsdValue / totalValue) * 100}%`,
              }}
              title={`Protocol Token Value: ${formatUsdValue(fund.balances!.totalUsdValue)}`}
            />
            <div
              className="bg-purple-300 rounded-r-full transition-all"
              style={{
                width: `${(fund.positions!.totalUsdValue / totalValue) * 100}%`,
              }}
              title={`Positions: ${formatUsdValue(fund.positions!.totalUsdValue)}`}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-text-muted">
            <span>
              Protocol Token Value:{' '}
              <UsdValue
                value={fund.balances!.totalUsdValue}
                className="text-xs"
              />
            </span>
            <span>
              DeFi Positions:{' '}
              <UsdValue
                value={fund.positions!.totalUsdValue}
                className="text-xs"
              />
            </span>
          </div>
        </div>
      )}

      {/* Token info */}
      {fund.tokenInfo && (
        <div className="mt-3 flex items-center gap-2">
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

      {/* Description from review config */}
      {fund.description && (
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          {fund.description}
        </p>
      )}
    </div>
  )
}

function FundCardInline({ fund }: { fund: CompiledFundHolder }) {
  const totalValue =
    (fund.balances?.totalUsdValue ?? 0) + (fund.positions?.totalUsdValue ?? 0)
  const hasBalances = fund.balances && fund.balances.totalUsdValue > 0
  const hasPositions = fund.positions && fund.positions.totalUsdValue > 0

  return (
    <div className="rounded-lg border border-border/50 bg-bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <AddressDisplay address={fund.address} />
        {totalValue > 0 && (
          <UsdValue
            value={totalValue}
            variant="capital"
            className="text-sm font-semibold"
          />
        )}
      </div>

      {hasBalances && hasPositions && totalValue > 0 && (
        <div className="mt-3">
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/50">
            <div
              className="bg-purple-500 rounded-l-full"
              style={{
                width: `${(fund.balances!.totalUsdValue / totalValue) * 100}%`,
              }}
              title={`Protocol Token Value: ${formatUsdValue(fund.balances!.totalUsdValue)}`}
            />
            <div
              className="bg-purple-300 rounded-r-full"
              style={{
                width: `${(fund.positions!.totalUsdValue / totalValue) * 100}%`,
              }}
              title={`Positions: ${formatUsdValue(fund.positions!.totalUsdValue)}`}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-text-muted">
            <span>
              Protocol Token Value:{' '}
              <UsdValue
                value={fund.balances!.totalUsdValue}
                className="text-xs"
              />
            </span>
            <span>
              DeFi Positions:{' '}
              <UsdValue
                value={fund.positions!.totalUsdValue}
                className="text-xs"
              />
            </span>
          </div>
        </div>
      )}

      {fund.tokenInfo && (
        <div className="mt-2.5 flex items-center gap-2">
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
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          {fund.description}
        </p>
      )}
    </div>
  )
}
