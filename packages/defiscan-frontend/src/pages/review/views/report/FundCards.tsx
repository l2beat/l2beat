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

/** Generate a narrative sentence for a fund holder */
function narrativeForFund(fund: CompiledFundHolder): string {
  const parts: string[] = []
  const balanceVal = fund.balances?.totalUsdValue ?? 0
  const positionVal = fund.positions?.totalUsdValue ?? 0
  const total = balanceVal + positionVal

  if (total === 0) {
    return 'This contract currently holds no significant value.'
  }

  if (balanceVal > 0 && positionVal > 0) {
    parts.push(
      `This contract holds ${formatUsdValue(balanceVal)} in token balances and ${formatUsdValue(positionVal)} in DeFi positions`,
    )
  } else if (balanceVal > 0) {
    parts.push(
      `This contract holds ${formatUsdValue(balanceVal)} in token balances`,
    )
  } else {
    parts.push(
      `This contract has ${formatUsdValue(positionVal)} deployed in DeFi positions`,
    )
  }

  if (fund.tokenInfo) {
    parts.push(
      `, with the protocol token ${fund.tokenInfo.symbol} having a market cap of ${formatUsdValue(fund.tokenInfo.tokenValue)}`,
    )
  }

  return parts.join('') + '.'
}

export function FundCards({ review }: FundCardsProps) {
  const { funds, totals } = review

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
      name: f.name.length > 30 ? `${f.name.slice(0, 27)}...` : f.name,
      fullName: f.name,
      value:
        (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

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

      {/* Simple bar visualization for fund distribution */}
      {chartData.length > 1 && (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm mb-8">
          <h3 className="text-base font-semibold text-text-primary mb-4">
            Fund Distribution
          </h3>
          <div className="space-y-3">
            {chartData.map((entry, index) => {
              const percentage = totalFunds > 0 ? (entry.value / totalFunds) * 100 : 0
              return (
                <div key={entry.fullName}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-primary font-medium truncate mr-4">
                      {entry.fullName}
                    </span>
                    <span className="text-text-secondary shrink-0">
                      {formatUsdValue(entry.value)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(percentage, 1)}%`,
                        backgroundColor:
                          BAR_COLORS[index % BAR_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Fund holder cards with narrative */}
      <div className="space-y-4">
        {funds.map((fund) => (
          <FundCard key={fund.address} fund={fund} />
        ))}
      </div>
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
              title={`Balances: ${formatUsdValue(fund.balances!.totalUsdValue)}`}
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
              Token Balances:{' '}
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

      {/* Narrative */}
      <div className="mt-3 rounded-lg bg-bg-muted/60 p-3">
        <p className="text-sm text-text-secondary leading-relaxed">
          {narrativeForFund(fund)}
        </p>
      </div>

      {/* Description from review config */}
      {fund.description && (
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          {fund.description}
        </p>
      )}
    </div>
  )
}
