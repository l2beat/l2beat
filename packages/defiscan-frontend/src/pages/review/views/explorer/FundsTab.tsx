import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { AddressDisplay } from '../../../../components/AddressDisplay'
import { UsdValue } from '../../../../components/UsdValue'
import { Badge } from '../../../../components/Badge'
import { formatUsdValue } from '../../../../utils/format'
import type { CompiledReview, CompiledFundHolder } from '../../../../types'

interface FundsTabProps {
  review: CompiledReview
}

type SortField = 'name' | 'total' | 'balances' | 'positions'
type SortDir = 'asc' | 'desc'

export function FundsTab({ review }: FundsTabProps) {
  const { funds } = review
  const [sortField, setSortField] = useState<SortField>('total')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    const copy = [...funds]
    copy.sort((a, b) => {
      const aTotal =
        (a.balances?.totalUsdValue ?? 0) +
        (a.positions?.totalUsdValue ?? 0) +
        (a.aggregate?.totalUsdValue ?? 0)
      const bTotal =
        (b.balances?.totalUsdValue ?? 0) +
        (b.positions?.totalUsdValue ?? 0) +
        (b.aggregate?.totalUsdValue ?? 0)
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'total':
          cmp = aTotal - bTotal
          break
        case 'balances':
          cmp =
            (a.balances?.totalUsdValue ?? 0) -
            (b.balances?.totalUsdValue ?? 0)
          break
        case 'positions':
          cmp =
            (a.positions?.totalUsdValue ?? 0) -
            (b.positions?.totalUsdValue ?? 0)
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [funds, sortField, sortDir])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  if (funds.length === 0) {
    return <p className="text-text-muted">No TVL data available.</p>
  }

  const totalCapital = funds.reduce(
    (s, f) =>
      s +
      (f.balances?.totalUsdValue ?? 0) +
      (f.positions?.totalUsdValue ?? 0) +
      (f.aggregate?.totalUsdValue ?? 0),
    0,
  )
  const totalTokenValue = funds.reduce(
    (s, f) => s + (f.tokenInfo?.tokenValue ?? 0),
    0,
  )

  // Chart data: TVL (balances + positions + aggregate) and Market Cap (tokenInfo.tokenValue)
  const chartData = funds
    .map((f) => ({
      name:
        f.name.length > 20 ? `${f.name.slice(0, 18)}...` : f.name,
      tvl:
        (f.balances?.totalUsdValue ?? 0) +
        (f.positions?.totalUsdValue ?? 0) +
        (f.aggregate?.totalUsdValue ?? 0),
      marketCap: f.tokenInfo?.tokenValue ?? 0,
    }))
    .filter((d) => d.tvl > 0 || d.marketCap > 0)
    .sort((a, b) => b.tvl + b.marketCap - (a.tvl + a.marketCap))

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-6 mb-4 text-sm flex-wrap">
        <FundsSummaryLabel funds={funds} />
        <span className="text-text-secondary">
          TVL:{' '}
          <UsdValue
            value={totalCapital}
            variant="capital"
            className="text-sm"
          />
        </span>
        {totalTokenValue > 0 && (
          <span className="text-text-secondary">
            Token:{' '}
            <UsdValue
              value={totalTokenValue}
              variant="token"
              className="text-sm"
            />
          </span>
        )}
      </div>

      {/* Stacked bar chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-4 mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            TVL Distribution
          </h3>
          <ResponsiveContainer
            width="100%"
            height={Math.max(chartData.length * 40, 100)}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v: number) => formatUsdValue(v)}
                fontSize={10}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                formatter={(value: number) => formatUsdValue(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E1ED',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="tvl"
                stackId="total"
                fill="#10B981"
                name="TVL"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="marketCap"
                stackId="total"
                fill="#F59E0B"
                name="Market Cap"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-status-green" /> TVL
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-amber-500" /> Market Cap
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-muted">
              <SortHeader
                field="name"
                label="Contract"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Address
              </th>
              <SortHeader
                field="balances"
                label="Balances"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <SortHeader
                field="positions"
                label="Positions"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <SortHeader
                field="total"
                label="TVL"
                current={sortField}
                dir={sortDir}
                onClick={handleSort}
                className="text-right"
              />
              <th className="px-4 py-2 font-medium text-text-secondary text-left">
                Market Cap Token
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((fund) => (
              <FundRow key={fund.address} fund={fund} />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-bg-muted/50">
              <td
                colSpan={2}
                className="px-4 py-2 font-semibold text-text-primary"
              >
                Total
              </td>
              <td className="px-4 py-2 text-right">
                <UsdValue
                  value={funds.reduce(
                    (s, f) => s + (f.balances?.totalUsdValue ?? 0),
                    0,
                  )}
                  variant="capital"
                  className="text-sm font-semibold"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <UsdValue
                  value={funds.reduce(
                    (s, f) => s + (f.positions?.totalUsdValue ?? 0),
                    0,
                  )}
                  variant="capital"
                  className="text-sm font-semibold"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <UsdValue
                  value={totalCapital}
                  variant="capital"
                  className="text-sm font-bold"
                />
              </td>
              <td className="px-4 py-2">
                {totalTokenValue > 0 && (
                  <UsdValue
                    value={totalTokenValue}
                    variant="token"
                    className="text-sm font-semibold"
                  />
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function FundRow({ fund }: { fund: CompiledFundHolder }) {
  const [expanded, setExpanded] = useState(false)
  const total =
    (fund.balances?.totalUsdValue ?? 0) +
    (fund.positions?.totalUsdValue ?? 0) +
    (fund.aggregate?.totalUsdValue ?? 0)

  const balPct =
    total > 0
      ? ((fund.balances?.totalUsdValue ?? 0) / total) * 100
      : 0

  return (
    <>
      <tr
        className="border-b border-border hover:bg-bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <svg
              className={`w-3 h-3 text-text-muted transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`}
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
            <span className="font-medium text-text-primary">{fund.name}</span>
            {fund.aggregate && (
              <Badge variant="governance">
                Aggregate ({fund.aggregate.contractCount})
              </Badge>
            )}
          </div>
        </td>
        <td className="px-4 py-2.5">
          <AddressDisplay address={fund.address} className="text-xs" />
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {(fund.balances?.totalUsdValue ?? 0) > 0 ? (
            <UsdValue
              value={fund.balances!.totalUsdValue}
              variant="capital"
              className="text-sm"
            />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums">
          {(fund.positions?.totalUsdValue ?? 0) > 0 ? (
            <UsdValue
              value={fund.positions!.totalUsdValue}
              variant="capital"
              className="text-sm"
            />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td className="px-4 py-2.5 text-right">
          {total > 0 ? (
            <UsdValue
              value={total}
              variant="capital"
              className="text-sm font-semibold"
            />
          ) : (
            <span className="text-text-muted">$0</span>
          )}
        </td>
        <td className="px-4 py-2.5">
          {fund.tokenInfo ? (
            <div className="flex items-center gap-1">
              <Badge variant="purple">{fund.tokenInfo.symbol}</Badge>
              <span className="text-xs text-token tabular-nums">
                {formatUsdValue(fund.tokenInfo.tokenValue)}
              </span>
            </div>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td
            colSpan={6}
            className="px-8 py-3 bg-bg-muted/50 border-b border-border"
          >
            {fund.description && (
              <p className="text-sm text-text-secondary leading-relaxed mb-2">
                {fund.description}
              </p>
            )}
            {fund.aggregate && (
              <p className="text-sm text-text-secondary mb-2">
                {fund.aggregate.label || fund.aggregate.handlerName}
                {' \u2014 '}
                {formatUsdValue(fund.aggregate.totalUsdValue)} across{' '}
                {fund.aggregate.contractCount} contracts
              </p>
            )}
            {total > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-status-green rounded-l"
                    style={{ width: `${balPct}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {balPct.toFixed(0)}% balances / {(100 - balPct).toFixed(0)}%
                  positions
                </span>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

function FundsSummaryLabel({ funds }: { funds: CompiledFundHolder[] }) {
  const tvlCount = funds.filter(
    (f) =>
      (f.balances?.totalUsdValue ?? 0) > 0 ||
      (f.positions?.totalUsdValue ?? 0) > 0 ||
      (f.aggregate?.totalUsdValue ?? 0) > 0,
  ).length
  const tokenCount = funds.filter((f) => f.tokenInfo != null).length

  if (tvlCount === 0 && tokenCount === 0) {
    return <span className="text-text-muted">No TVL data</span>
  }

  return (
    <span className="text-text-secondary">
      {tvlCount > 0 && (
        <>
          <span className="font-semibold text-text-primary">{tvlCount}</span>
          {' '}contract{tvlCount !== 1 ? 's' : ''} holding TVL
        </>
      )}
      {tvlCount > 0 && tokenCount > 0 && ', '}
      {tokenCount > 0 && (
        <>
          <span className="font-semibold text-text-primary">{tokenCount}</span>
          {' '}issued token{tokenCount !== 1 ? 's' : ''}
        </>
      )}
    </span>
  )
}

function SortHeader({
  field,
  label,
  current,
  dir,
  onClick,
  className,
}: {
  field: SortField
  label: string
  current: SortField
  dir: SortDir
  onClick: (f: SortField) => void
  className?: string
}) {
  const isActive = current === field
  return (
    <th
      className={`px-4 py-2 font-medium text-text-secondary cursor-pointer select-none hover:text-text-primary transition-colors text-left ${className ?? ''}`}
      onClick={() => onClick(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            {dir === 'desc' ? (
              <path d="M6 8L2 4h8z" />
            ) : (
              <path d="M6 4l4 4H2z" />
            )}
          </svg>
        )}
      </span>
    </th>
  )
}
