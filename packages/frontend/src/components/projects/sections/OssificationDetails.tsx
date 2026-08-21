import { formatCurrency, formatSeconds } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { OssificationContractBreakdown } from '~/server/features/projects/ossification/getOssificationFactor'
import type { ProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'

export interface OssificationDetailsProps {
  ossification: ProjectOssification
}

export function OssificationDetails({
  ossification,
}: OssificationDetailsProps) {
  return (
    <div
      id="ossification"
      className="flex scroll-mt-[38px] flex-col gap-4 md:scroll-mt-14 lg:scroll-mt-4"
    >
      <h3 className="text-heading-20">Ossification</h3>
      <div className="flex flex-col gap-4">
        <p className="text-secondary text-sm leading-relaxed">
          Contracts classified as critical by our research team form one
          project-wide perimeter; deploying or critically changing any of them
          resets its clock (changes within 24 hours count as one event).
          Ossification N means the unchanged perimeter has outlived the code age
          of N% of recorded code-bug exploits in our published, onchain-verified
          incident dataset. Battle-tested exposure is the value secured summed
          over that unchanged period — the implicit bug bounty the code has
          withstood.
        </p>
        <ChartStats className="md:grid-cols-2 lg:grid-cols-4">
          <ChartStatsItem label="Ossification %" className="max-md:h-7">
            <span className="tabular-nums">{ossification.score}</span>
          </ChartStatsItem>
          <ChartStatsItem label="Battle-tested exposure" className="max-md:h-7">
            {ossification.exposure !== null ? (
              <span className="tabular-nums">
                {formatCurrency(ossification.exposure, 'usd')}
                <span className="ml-0.5 text-secondary text-xs">·years</span>
              </span>
            ) : (
              <NotApplicableBadge />
            )}
          </ChartStatsItem>
          <ChartStatsItem label="Last change" className="max-md:h-7">
            {ossification.projectAgeSeconds !== null ? (
              `${formatSeconds(ossification.projectAgeSeconds)} ago`
            ) : (
              <NotApplicableBadge />
            )}
          </ChartStatsItem>
          <ChartStatsItem
            label="Critical changes / year"
            className="max-md:h-7"
          >
            {ossification.clusteredEventCount === 0 ? (
              '0'
            ) : (
              <span className="tabular-nums">
                {formatRate(ossification.criticalChangesPerYear)}
              </span>
            )}
          </ChartStatsItem>
        </ChartStats>
        <ContractBreakdownTable contracts={ossification.contracts} />
      </div>
    </div>
  )
}

function ContractBreakdownTable({
  contracts,
}: {
  contracts: OssificationContractBreakdown[]
}) {
  return (
    <details className="group rounded-lg border border-divider bg-surface-primary">
      <summary className="cursor-pointer list-none px-4 py-3 font-medium text-sm marker:hidden hover:bg-surface-secondary">
        Per-contract breakdown ({contracts.length}{' '}
        {contracts.length === 1 ? 'contract' : 'contracts'})
      </summary>
      <div className="overflow-x-auto border-divider border-t">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-2xs text-secondary uppercase">
              <th className="px-4 py-2 font-medium">Contract</th>
              <th className="px-4 py-2 text-right font-medium">Age</th>
              <th className="px-4 py-2 text-right font-medium">Code changes</th>
              <th className="px-4 py-2 text-right font-medium">
                State changes
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr
                key={contract.address}
                className="border-divider border-t text-primary"
              >
                <td className="px-4 py-2">
                  <span className="font-medium">{contract.name}</span>
                  {!contract.isVerified && (
                    <Badge
                      type="error"
                      size="extraSmall"
                      padding="small"
                      className="ml-2 uppercase"
                    >
                      Unverified
                    </Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-right tabular-nums">
                  {contract.ageSeconds !== null ? (
                    formatSeconds(contract.ageSeconds)
                  ) : (
                    <NotApplicableBadge />
                  )}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {contract.codeChangeCount}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {contract.stateChangeCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

function formatRate(rate: number): string {
  return rate >= 10 ? rate.toFixed(0) : rate.toFixed(1)
}
