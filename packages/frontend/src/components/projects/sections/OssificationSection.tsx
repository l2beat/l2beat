import { formatSeconds } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type {
  OssificationContractBreakdown,
  OssificationFactor,
} from '~/server/features/projects/ossification/getOssificationFactor'
import { cn } from '~/utils/cn'
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
          The ossification factor measures how battle-tested the code securing
          this project is. Every contract in the critical perimeter carries a
          clock that starts at its deployment and resets on every critical
          change — implementation upgrades and high-severity value changes such
          as verifier keys or permission sets. Code that secures value for years
          without changing earns a high score; frequently changed code is
          unproven, since exploits historically cluster in the weeks after a
          change. Changes within 24 hours count as a single event. The perimeter
          is the set of contracts classified as critical by our research team:
          those whose compromise can lead to loss or freezing of user funds,
          directly or through permissions they hold.
        </p>
        <ChartStats className="md:grid-cols-3 lg:grid-cols-3">
          <ChartStatsItem label="Ossification score" className="max-md:h-7">
            <span className="tabular-nums">{ossification.score} / 100</span>
          </ChartStatsItem>
          <ChartStatsItem label="Last critical change" className="max-md:h-7">
            {ossification.lastCriticalChangeAgeSeconds !== null ? (
              `${formatSeconds(ossification.lastCriticalChangeAgeSeconds)} ago`
            ) : (
              <span>None observed</span>
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
        {ossification.weakestLink && (
          <p className="text-secondary text-xs">
            Youngest code in the perimeter:{' '}
            <span className="font-medium text-primary">
              {ossification.weakestLink.name}
            </span>{' '}
            ({formatSeconds(ossification.weakestLink.ageSeconds)} old)
          </p>
        )}
        <ContractBreakdownTable contracts={ossification.contracts} />
        {ossification.unknownAgeCount > 0 && (
          <p className="text-secondary text-xs">
            {ossification.unknownAgeCount}{' '}
            {ossification.unknownAgeCount === 1 ? 'contract' : 'contracts'}{' '}
            without a known deployment or change timestamp{' '}
            {ossification.unknownAgeCount === 1 ? 'is' : 'are'} excluded from
            the score.
          </p>
        )}
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
              <th className="px-4 py-2 font-medium">Clock started</th>
              <th className="px-4 py-2 text-right font-medium">Age</th>
              <th className="px-4 py-2 text-right font-medium">
                Critical changes
              </th>
              <th className="px-4 py-2 text-right font-medium">Maturity</th>
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
                <td
                  className={cn(
                    'px-4 py-2 text-right font-medium tabular-nums',
                    contract.maturity !== null &&
                      contract.maturity < 0.25 &&
                      'text-negative',
                    contract.maturity !== null &&
                      contract.maturity >= 0.75 &&
                      'text-positive',
                  )}
                >
                  {contract.maturity !== null ? (
                    `${Math.round(contract.maturity * 100)}%`
                  ) : (
                    <NotApplicableBadge />
                  )}
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
