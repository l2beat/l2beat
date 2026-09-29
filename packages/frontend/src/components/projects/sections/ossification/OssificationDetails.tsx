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
import {
  OSSIFICATION_VALUE_LABELS,
  OssificationExposure,
} from '~/components/ossification/OssificationExposure'
import { OssificationUnverifiedBadge } from '~/components/ossification/OssificationUnverifiedBadge'
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
  const valueLabel = ossification.valueSource
    ? OSSIFICATION_VALUE_LABELS[ossification.valueSource]
    : 'Value secured'
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
          tooltip="0 to 100. Gated to 0 while any critical contract is unverified."
        >
          {ossification.isUnverified ? (
            <OssificationUnverifiedBadge />
          ) : (
            ossification.score
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Battle-tested exposure"
          tooltip={`${valueLabel} summed over the unchanged period, in USD·years.`}
        >
          <OssificationExposure
            exposure={ossification.exposure}
            valueSource={ossification.valueSource}
          />
        </ChartStatsItem>
        <ChartStatsItem
          label="Last change"
          tooltip="Time since the last critical change, or since the newest deployment if there was none."
        >
          {formatSeconds(ossification.lastChangeAgeSeconds)} ago
        </ChartStatsItem>
        <ChartStatsItem
          label="Critical changes per year"
          tooltip="Changes within 24 hours count as one."
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
