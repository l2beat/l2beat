import { useMemo } from 'react'
import type { CompiledReview } from '../../../../types'
import { formatUsdValue } from '../../../../utils/format'
import { buildRiskProfile } from '../../../../utils/risk'

interface RiskOverviewProps {
  review: CompiledReview
}

const ADMIN_TYPE_BG: Record<string, string> = {
  EOA: 'bg-red-50 text-red-700 border-red-200',
  EOAPermissioned: 'bg-red-50 text-red-700 border-red-200',
  Multisig: 'bg-amber-50 text-amber-700 border-amber-200',
  Timelock: 'bg-green-50 text-green-700 border-green-200',
  Contract: 'bg-blue-50 text-blue-700 border-blue-200',
  Upgradeable: 'bg-blue-50 text-blue-700 border-blue-200',
  Revoked: 'bg-green-50 text-green-700 border-green-200',
  Immutable: 'bg-green-50 text-green-700 border-green-200',
  Untemplatized: 'bg-gray-50 text-gray-600 border-gray-200',
  Diamond: 'bg-blue-50 text-blue-700 border-blue-200',
}

export function RiskOverview({ review }: RiskOverviewProps) {
  const profile = useMemo(() => buildRiskProfile(review), [review])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Risk Analysis</h3>

      {/* Key Risk Factors */}
      {profile.keyRiskFactors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h4 className="text-sm font-semibold text-red-800 mb-3">
            Key Risk Factors
          </h4>
          <div className="space-y-2">
            {profile.keyRiskFactors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <span className="text-sm text-red-900">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Analysis Cards */}
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h4 className="text-sm font-semibold text-text-primary">
            Admin Analysis
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            {review.admins.length} admin
            {review.admins.length !== 1 ? 's' : ''} controlling permissioned
            functions
          </p>
        </div>
        <div className="divide-y divide-border">
          {review.admins.map((admin) => (
            <div key={admin.address} className="px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${ADMIN_TYPE_BG[admin.adminType] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    {admin.adminType}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {admin.name}
                  </span>
                  {admin.isGovernance && (
                    <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Governance
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0 ml-3">
                  {admin.totalDirectCapital > 0 && (
                    <div className="text-sm font-semibold text-capital tabular-nums">
                      {formatUsdValue(admin.totalDirectCapital)}
                    </div>
                  )}
                  {admin.totalDirectTokenValue > 0 && (
                    <div className="text-xs text-token tabular-nums">
                      {formatUsdValue(admin.totalDirectTokenValue)} protocol token
                    </div>
                  )}
                </div>
              </div>
              {admin.description && (
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {admin.description}
                </p>
              )}
              <div className="mt-2 text-xs text-text-muted">
                {admin.functions.length} permissioned function
                {admin.functions.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies Table */}
      {review.dependencies.length > 0 && (
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h4 className="text-sm font-semibold text-text-primary">
              External Dependencies
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {review.dependencies.length} external{' '}
              {review.dependencies.length !== 1
                ? 'dependencies'
                : 'dependency'}
            </p>
          </div>
          <div className="divide-y divide-border">
            {review.dependencies.map((dep) => (
              <div
                key={dep.address}
                className="px-5 py-3 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-primary">
                      {dep.name}
                    </span>
                    {dep.entity && (
                      <span className="inline-flex items-center rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                        {dep.entity}
                      </span>
                    )}
                    {dep.isAutoDetected && (
                      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        auto
                      </span>
                    )}
                  </div>
                  {dep.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">
                      {dep.description}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-text-muted tabular-nums">
                    {dep.functions.length} function
                    {dep.functions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fund Holders Table */}
      {review.funds.length > 0 && (
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h4 className="text-sm font-semibold text-text-primary">
              Fund-Holding Contracts
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              {review.funds.length} contract
              {review.funds.length !== 1 ? 's' : ''} with tracked balances
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-muted/50">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-text-secondary">
                    Contract
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-text-secondary">
                    Balances
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-text-secondary">
                    Positions
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-text-secondary">
                    Protocol Token Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {review.funds.map((fund) => (
                  <tr
                    key={fund.address}
                    className="border-b border-border last:border-0 hover:bg-bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-text-primary">
                        {fund.name}
                      </div>
                      {fund.description && (
                        <div className="text-xs text-text-muted mt-0.5 line-clamp-1">
                          {fund.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium text-capital tabular-nums">
                        {fund.balances
                          ? formatUsdValue(fund.balances.totalUsdValue)
                          : '--'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium text-status-blue tabular-nums">
                        {fund.positions
                          ? formatUsdValue(fund.positions.totalUsdValue)
                          : '--'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium text-token tabular-nums">
                        {fund.tokenInfo
                          ? formatUsdValue(fund.tokenInfo.tokenValue)
                          : '--'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
