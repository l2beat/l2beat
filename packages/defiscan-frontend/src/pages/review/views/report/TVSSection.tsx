import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { CompiledReview, CompiledFundHolder } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { ShowMoreButton } from './_shared'

interface TVSSectionProps {
  review: CompiledReview
  onShowMore: () => void
}

const CHART_COLORS = ['#2563eb', '#60a5fa', '#93c5fd']
const TOKEN_COLORS = ['#16a34a', '#22c55e', '#4ade80']
const OTHER_COLOR = '#e2e8f0'

function getFundName(fund: CompiledFundHolder): string {
  return fund.name || fund.address
}

function getFundValue(fund: CompiledFundHolder, includeTokens: boolean): number {
  if (fund.aggregate?.totalUsdValue) return fund.aggregate.totalUsdValue
  const balanceTotal = fund.balances?.totalUsdValue ?? 0
  const positionTotal = fund.positions?.totalUsdValue ?? 0
  const tokenTotal = includeTokens ? (fund.tokenInfo?.tokenValue ?? 0) : 0
  return balanceTotal + positionTotal + tokenTotal
}

export function TVSSection({ review, onShowMore }: TVSSectionProps) {
  const [includeTokens, setIncludeTokens] = useState(true)
  const { totals, funds } = review
  const totalTvs = totals.totalCapitalAtRisk + (includeTokens ? (totals.totalTokenValue ?? 0) : 0)

  // Build pie data from fund holders — top 3 non-token + top 3 token + "Other"
  const allFundValues = funds
    .map((f) => ({ fund: f, value: getFundValue(f, includeTokens), isToken: !!f.tokenInfo }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value)

  const nonTokenFunds = allFundValues.filter((x) => !x.isToken)
  const tokenFunds = allFundValues.filter((x) => x.isToken)

  const topNonToken = nonTokenFunds.slice(0, 3)
  const topToken = includeTokens ? tokenFunds.slice(0, 3) : []
  const shownKeys = new Set([...topNonToken, ...topToken].map((x) => x.fund.address))
  const otherValue = allFundValues
    .filter((x) => !shownKeys.has(x.fund.address) && (includeTokens || !x.isToken))
    .reduce((s, x) => s + x.value, 0)

  const pieData = [
    ...topNonToken.map((x, i) => ({
      name: getFundName(x.fund),
      value: x.value,
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
    ...topToken.map((x, i) => ({
      name: getFundName(x.fund),
      value: x.value,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
    })),
    ...(otherValue > 0
      ? [{ name: 'Other', value: otherValue, color: OTHER_COLOR }]
      : []),
  ]

  const pieTotal = pieData.reduce((s, x) => s + x.value, 0)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-6">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="size-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          <span className="font-bold text-[11px] uppercase text-text-muted tracking-[1.2px]">
            Total Value Secured
          </span>
        </div>
        <ShowMoreButton onClick={onShowMore} />
      </div>
      <div className="flex flex-col sm:flex-row gap-[30px] items-stretch">
      {/* Left stats card */}
      <div className="sm:w-[312px] sm:shrink-0 bg-bg-card rounded-lg p-6 sm:p-[33px] flex flex-col sm:justify-center gap-6 sm:gap-8">
        <div className="flex flex-col">
          <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
            Total TVS
          </p>
          <p className="font-mono font-bold text-2xl sm:text-[36px] sm:leading-[40px] text-text-primary mt-1">
            {formatUsdValue(totalTvs)}
          </p>
          <label className="flex items-center gap-2 cursor-pointer mt-3">
            <input
              type="checkbox"
              checked={includeTokens}
              onChange={(e) => setIncludeTokens(e.target.checked)}
              className="size-3.5 rounded border-border accent-green-600"
            />
            <span className="text-[11px] text-text-muted">Include protocol tokens</span>
          </label>
        </div>
        <div className="sm:border-t sm:border-border sm:pt-[33px] flex flex-col gap-1">
          <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
            Contracts Holding TVS
          </p>
          <p className="font-mono font-bold text-2xl sm:text-[36px] sm:leading-[40px] text-text-primary">
            {funds.length}
          </p>
        </div>
      </div>

      {/* Right chart + legend */}
      <div className="flex-1 min-w-0 bg-white border border-border rounded-lg p-6 sm:p-[33px] flex flex-col gap-6 sm:gap-8">
        <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
          TVS Distribution
        </p>

        {pieData.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Donut */}
            <div className="w-full sm:w-[256px] h-[200px] sm:h-[256px] sm:shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="35%"
                    outerRadius="65%"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#f8fafc"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatUsdValue(val)}
                    contentStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="w-full sm:flex-1 min-w-0 flex flex-col gap-4 sm:gap-6">
              {pieData.map((entry, i) => {
                const pct = pieTotal > 0 ? ((entry.value / pieTotal) * 100).toFixed(1) : '0'
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between pb-3 ${i < pieData.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{ background: entry.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <p className="font-bold text-[14px] text-text-primary truncate">
                          {entry.name}
                        </p>
                        <p className="font-mono text-[8px] font-bold uppercase text-text-muted tracking-[0.2px]">
                          {formatUsdValue(entry.value)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[14px] text-accent shrink-0 ml-2">
                      {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-text-muted text-sm">No fund distribution data available.</p>
        )}
      </div>
      </div>
    </div>
  )
}
