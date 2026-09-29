import {
  ChainSpecificAddress,
  formatAddress,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { formatCriticalChangesPerYear } from '~/components/ossification/formatCriticalChangesPerYear'
import { OssificationExposure } from '~/components/ossification/OssificationExposure'
import { OssificationScore } from '~/components/ossification/OssificationScore'
import { OssificationUnverifiedBadge } from '~/components/ossification/OssificationUnverifiedBadge'
import { OSSIFICATION_TOOLTIPS } from '~/components/ossification/ossificationTooltips'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  OssificationContractView,
  ProjectOssificationView,
} from '~/server/features/projects/ossification/getProjectOssification'
import { SubsectionHeading } from '../Subsection'

export function OssificationDetails({
  ossification,
}: {
  ossification: ProjectOssificationView
}) {
  return (
    <div
      id="ossification"
      className="scroll-mt-[38px] md:scroll-mt-14 lg:scroll-mt-4"
    >
      <SubsectionHeading className="mb-3 font-bold text-heading-20">
        Ossification
      </SubsectionHeading>
      <p className="mb-4 text-paragraph-15 md:text-paragraph-16">
        Contracts our research team classifies as critical form the project's
        perimeter. Any deployment or critical change to them resets its clock
        (changes within 24 hours count as one). The ossification score is the
        share of recorded code-bug exploits whose exploited code was younger
        than this perimeter is today. Battle-tested exposure is the value
        secured, summed over that unchanged period.
      </p>
      <ChartStats>
        <ChartStatsItem
          label="Ossification score"
          tooltip={OSSIFICATION_TOOLTIPS.score}
        >
          <OssificationScore
            score={ossification.score}
            isUnverified={ossification.isUnverified}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label="Battle-tested exposure"
          tooltip={OSSIFICATION_TOOLTIPS.exposure}
        >
          <OssificationExposure
            exposure={ossification.exposure}
            valueSource={ossification.valueSource}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label="Last change"
          tooltip={OSSIFICATION_TOOLTIPS.lastChange}
        >
          {formatSeconds(ossification.lastChangeAgeSeconds)} ago
        </ChartStatsItem>
        <ChartStatsItem
          label="Critical changes per year"
          tooltip={OSSIFICATION_TOOLTIPS.criticalChangesPerYear}
        >
          {formatCriticalChangesPerYear(ossification)}
        </ChartStatsItem>
      </ChartStats>
      <CriticalContracts contracts={ossification.contracts} />
    </div>
  )
}

function CriticalContracts({
  contracts,
}: {
  contracts: OssificationContractView[]
}) {
  return (
    <Collapsible className="mt-4 rounded-lg border border-divider">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-bold text-sm">
        Critical contracts ({contracts.length})
        <ChevronIcon className="group-data-[state=open]/Collapsible:-rotate-180 size-3 fill-current transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="overflow-x-auto border-divider border-t">
          <table className="w-full min-w-[480px] border-collapse text-left text-xs md:text-sm">
            <thead className="text-2xs text-secondary uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Contract</th>
                <th className="px-4 py-2 font-medium">Unchanged for</th>
                <th className="px-4 py-2 text-right font-medium">
                  Code changes
                </th>
                <th className="px-4 py-2 text-right font-medium">
                  State changes
                </th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.address} className="border-divider border-t">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contract.name}</span>
                      {!contract.isVerified && <OssificationUnverifiedBadge />}
                    </div>
                    {/* Names repeat within a perimeter, the address tells them apart. */}
                    <span className="text-2xs text-secondary">
                      {formatAddress(
                        ChainSpecificAddress.address(contract.address),
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {formatSeconds(contract.ageSeconds)}
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
      </CollapsibleContent>
    </Collapsible>
  )
}
