import { useState } from 'react'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { Badge } from '../../../../components/Badge'
import { UsdValue } from '../../../../components/UsdValue'
import { formatUsdValue } from '../../../../utils/format'
import type { CompiledReview, CompiledFundHolder, CompiledAdmin } from '../../../../types'

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

export function FundCards({ review }: FundCardsProps) {
  const { funds, totals } = review
  const [expandedFunds, setExpandedFunds] = useState<Set<string>>(new Set())

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
      fund: f,
      fullName: f.name,
      value:
        (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  // Separate token entries (funds with tokenInfo)
  const tokenFunds = funds.filter((f) => f.tokenInfo)
  const totalTokenValue = tokenFunds.reduce(
    (sum, f) => sum + (f.tokenInfo?.tokenValue ?? 0),
    0,
  )
  const tokenChartData = tokenFunds
    .map((f) => ({
      fund: f,
      fullName: `${f.tokenInfo!.symbol} (${f.name})`,
      value: f.tokenInfo!.tokenValue,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  // Build token names list for pretext
  const tokenNames = tokenFunds
    .map((f) => f.tokenInfo!.symbol)
    .filter((s, i, arr) => arr.indexOf(s) === i)

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

  return (
    <div>
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
        The protocol holds{' '}
        <span className="font-semibold text-capital">
          {formatUsdValue(totalFunds)}
        </span>{' '}
        across {funds.length} contract{funds.length !== 1 ? 's' : ''}.
        {totalTokenValue > 0 && tokenNames.length > 0 && (
          <>
            {' '}
            Additionally, the protocol{tokenNames.length === 1 ? "'s native token" : ' issues'}{' '}
            {tokenNames.map((name, i) => (
              <span key={name}>
                {i > 0 && (i === tokenNames.length - 1 ? ' and ' : ', ')}
                <span className="font-semibold text-token">{name}</span>
              </span>
            ))}{' '}
            {tokenNames.length === 1 ? 'has' : 'have'} a combined market cap of{' '}
            <UsdValue value={totalTokenValue} variant="token" />.
          </>
        )}{' '}
        Here's where the money sits and what controls it.
      </p>

      {/* Fund Distribution */}
      {chartData.length > 0 && (
        <DistributionChart
          title="Fund Distribution"
          entries={chartData}
          total={totalFunds}
          barColors={BAR_COLORS}
          valueVariant="capital"
          expandedSet={expandedFunds}
          onToggle={toggleFund}
          keyPrefix="fund"
          review={review}
        />
      )}

      {/* Token Distribution */}
      {tokenChartData.length > 0 && (
        <div className="mt-6">
          <DistributionChart
            title="Protocol Token Distribution"
            entries={tokenChartData}
            total={totalTokenValue}
            barColors={TOKEN_BAR_COLORS}
            valueVariant="token"
            expandedSet={expandedFunds}
            onToggle={toggleFund}
            keyPrefix="token"
            review={review}
          />
        </div>
      )}
    </div>
  )
}

function DistributionChart({
  title,
  entries,
  total,
  barColors,
  valueVariant,
  expandedSet,
  onToggle,
  keyPrefix,
  review,
}: {
  title: string
  entries: { fund: CompiledFundHolder; fullName: string; value: number }[]
  total: number
  barColors: string[]
  valueVariant: 'capital' | 'token'
  expandedSet: Set<string>
  onToggle: (key: string) => void
  keyPrefix: string
  review: CompiledReview
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const percentage =
            total > 0 ? (entry.value / total) * 100 : 0
          const expandKey = `${keyPrefix}-${entry.fund.address}`
          const isExpanded = expandedSet.has(expandKey)
          const admins = getAdminsForFund(review, entry.fund.address)

          return (
            <div key={expandKey}>
              <button
                type="button"
                onClick={() => onToggle(expandKey)}
                className="w-full text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-primary font-medium truncate mr-4 flex items-center gap-1.5">
                    <span className="text-text-muted text-xs">
                      {isExpanded ? '\u25BC' : '\u25B6'}
                    </span>
                    {entry.fullName}
                  </span>
                  <span className={`font-semibold shrink-0 ${valueVariant === 'token' ? 'text-token' : 'text-capital'}`}>
                    {formatUsdValue(entry.value)}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(percentage, 1)}%`,
                      backgroundColor:
                        barColors[index % barColors.length],
                    }}
                  />
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
