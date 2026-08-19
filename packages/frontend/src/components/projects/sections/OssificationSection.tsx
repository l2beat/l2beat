import { formatCurrency, formatSeconds } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type {
  OssificationContractBreakdown,
  OssificationFactor,
} from '~/server/features/projects/ossification/getOssificationFactor'
import { formatTimestamp } from '~/utils/dates'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface OssificationSectionProps extends ProjectSectionProps {
  ossification: OssificationFactor
}

export function OssificationSection({
  ossification,
  ...sectionProps
}: OssificationSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-4">
        <p className="text-secondary text-sm leading-relaxed">
          Ossification measures how battle-tested the code securing this project
          is. Contracts classified as critical by our research team form one
          project-wide perimeter; deploying or critically changing any of them
          counts as a change to the whole perimeter. A critical change is an
          implementation upgrade or a high-severity value change, such as a
          verifier key or permission set, and changes within 24 hours count as
          one event. Ossification grows the longer the perimeter stays
          unchanged. The battle-tested exposure is the value secured summed up
          over that unchanged period — the implicit bug bounty the code has
          withstood, expressed in dollar-years, not a literal reward.
        </p>
        <ChartStats className="md:grid-cols-2 lg:grid-cols-4">
          <ChartStatsItem label="Ossification" className="max-md:h-7">
            <span className="tabular-nums">{ossification.score} / 100</span>
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
    </ProjectSection>
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
              <th className="px-4 py-2 font-medium">
                Individual clock started
              </th>
              <th className="px-4 py-2 text-right font-medium">Age</th>
              <th className="px-4 py-2 text-right font-medium">
                Critical changes
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
                <td className="whitespace-nowrap px-4 py-2 text-secondary">
                  {contract.clockStart !== null ? (
                    <>
                      {formatTimestamp(contract.clockStart)}
                      <span className="ml-1 text-2xs">
                        ({contract.hasChanged ? 'last change' : 'deployment'})
                      </span>
                    </>
                  ) : (
                    <NotApplicableBadge />
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
                  {contract.criticalChangeCount}
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
