import {
  ChainSpecificAddress,
  formatAddress,
  formatSeconds,
} from '@l2beat/shared-pure'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import {
  formatContractCount,
  formatCriticalChangesPerYear,
} from '~/components/ossification/formatCriticalChangesPerYear'
import { OssificationExposure } from '~/components/ossification/OssificationExposure'
import { OssificationScore } from '~/components/ossification/OssificationScore'
import { OssificationTimelineChart } from '~/components/ossification/OssificationTimelineChart'
import { OssificationUnverifiedBadge } from '~/components/ossification/OssificationUnverifiedBadge'
import { OSSIFICATION_TOOLTIPS } from '~/components/ossification/ossificationTooltips'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import { ExitWindowCell } from '~/components/table/cells/ExitWindowCell'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  OssificationContractView,
  ProjectOssificationView,
} from '~/server/features/projects/ossification/getProjectOssification'
import { formatTimestamp } from '~/utils/dates'
import { SubsectionHeading } from '../Subsection'

export function OssificationDetails({
  ossification,
}: {
  ossification: ProjectOssificationView
}) {
  return (
    <div id="ossification" className="scroll-mt-section-nav-card">
      <SubsectionHeading className="mb-3 font-semibold text-heading-16 leading-6 md:text-heading-18">
        Ossification
      </SubsectionHeading>
      <p className="mb-4 text-paragraph-15 md:text-paragraph-16">
        Contracts our research team classifies as critical form the project's
        critical perimeter. Its clock starts at the ossification genesis, and
        every critical change resets it (changes within 24 hours count as one).
        The ossification score is the share of recorded code-bug exploits whose
        exploited code was younger than this perimeter is today. Battle-tested
        exposure is the value secured, summed over that unchanged period.
      </p>
      {/* The same values as a row of the ossification table. */}
      <ChartStats className="max-md:gap-y-4 lg:grid-cols-3">
        <ChartStatsItem
          className={STACKED_ITEM}
          label="Ossification %"
          tooltip={OSSIFICATION_TOOLTIPS.score}
        >
          <OssificationScore
            score={ossification.score}
            isUnverified={ossification.isUnverified}
          />
          <SecondLine>
            since {formatTimestamp(ossification.timeline.clockStart)}
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ITEM}
          label={`${OSSIFICATION_VALUE_LABELS[ossification.valueSource ?? 'tvs'].short} & changes (1Y)`}
          tooltip={OSSIFICATION_TOOLTIPS.timeline}
        >
          <OssificationTimelineChart
            timeline={ossification.timeline}
            valueSource={ossification.valueSource}
          />
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ITEM}
          label="Battle-tested exposure"
          tooltip={OSSIFICATION_TOOLTIPS.exposure}
        >
          <OssificationExposure
            exposure={ossification.exposure}
            valueSource={ossification.valueSource}
            timeline={ossification.timeline}
          />
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ITEM}
          label="Critical changes / year"
          tooltip={OSSIFICATION_TOOLTIPS.criticalChangesPerYear}
        >
          {formatCriticalChangesPerYear(ossification)}
          <SecondLine>
            {formatContractCount(ossification.contractCount)}
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ITEM}
          label="Exit window"
          tooltip={OSSIFICATION_TOOLTIPS.exitWindow}
        >
          {ossification.exitWindow ? (
            <ExitWindowCell value={ossification.exitWindow} />
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
      </ChartStats>
      <CriticalContracts contracts={ossification.contracts} />
    </div>
  )
}

/** Below md each row's value runs to several lines, so the label sits on its first line. */
const STACKED_ITEM = 'max-md:items-start max-md:gap-4 max-md:text-right'

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}

function CriticalContracts({
  contracts,
}: {
  contracts: OssificationContractView[]
}) {
  return (
    <Collapsible className="mt-4 rounded-lg border border-divider">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-semibold text-label-value-16 md:px-6">
        Critical contracts ({contracts.length})
        <ChevronIcon className="group-data-[state=open]/Collapsible:-rotate-180 size-4 fill-secondary transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="overflow-x-auto border-divider border-t">
          <table className="w-full min-w-[480px] border-collapse text-left text-xs md:text-sm">
            <thead className="font-medium text-label-value-13">
              <tr>
                <th className="px-4 py-2 font-medium md:px-6">Contract</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium md:px-6">
                  Unchanged for
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium md:px-6">
                  Code changes
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium md:px-6">
                  State changes
                </th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.address} className="border-divider border-t">
                  <td className="px-4 py-2 md:px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium max-md:max-w-44">
                        {withIdentifierBreaks(contract.name)}
                      </span>
                      {!contract.isVerified && <OssificationUnverifiedBadge />}
                    </div>
                    {/* Names repeat within a perimeter, the address tells them apart. */}
                    <span className="text-2xs text-secondary">
                      {formatAddress(
                        ChainSpecificAddress.address(contract.address),
                      )}
                    </span>
                  </td>
                  <td className="w-px whitespace-nowrap px-4 py-2 tabular-nums md:px-6">
                    {formatSeconds(contract.ageSeconds)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums md:px-6">
                    {contract.codeChangeCount}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums md:px-6">
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

/**
 * Contract names are CamelCase identifiers ("L2CrossDomainMessenger"); on
 * phones they may only break between words, never mid-word.
 */
function withIdentifierBreaks(name: string) {
  return name
    .split(/(?<=[a-z0-9])(?=[A-Z])|(?<=_)|(?<=[A-Za-z])(?=\d)/)
    .flatMap((part, i) => (i === 0 ? [part] : [<wbr key={i} />, part]))
}
