import { formatInteger } from '@l2beat/shared-pure'
import { formatShare, totalUnits } from '~/components/audits/auditStatus'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { formatContractCount } from '~/components/ossification/formatCriticalChangesPerYear'
import { DiscoUiIcon } from '~/icons/DiscoUi'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { AuditsProjectDetails } from '~/server/features/audits/types'
import { AuditsDisclaimer } from './AuditsDisclaimer'

type Props = Pick<
  AuditsProjectDetails,
  'coverage' | 'contracts' | 'fullyCoveredContracts' | 'discoUiHref'
>

export function AuditsProjectSummary({
  coverage,
  contracts,
  fullyCoveredContracts,
  discoUiHref,
}: Props) {
  const units = totalUnits(coverage.units)
  const audited = units - coverage.units.unaudited
  const { lines } = coverage
  return (
    <>
      <ChartStats className="lg:grid-cols-4">
        <ChartStatsItem
          label="Fully audited contracts"
          tooltip="Share of the critical contracts whose whole deployed source, every unit of every file, is identical to audited code. Contracts without verified source count as not covered."
        >
          {formatShare(fullyCoveredContracts, contracts)}
          <SecondLine>
            {formatInteger(fullyCoveredContracts)} of {formatInteger(contracts)}{' '}
            contracts
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          label="Ever audited"
          tooltip="Share of deployed units (contracts, interfaces, libraries) that have an audited source, identical to it or not. The rest was never audited."
        >
          {formatShare(audited, units)}
          <SecondLine>
            {formatInteger(audited)} of {formatInteger(units)} units
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          label="Lines identical to audited"
          tooltip="Deployed lines identical to an audited version: every line of identical units plus the unchanged lines of differing units."
        >
          {formatShare(lines.covered, lines.total)}
          <SecondLine>
            {formatInteger(lines.covered)} of {formatInteger(lines.total)} lines{' '}
            {formatContractCount(contracts)}
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          label="Explore contracts in Disco"
          tooltip="The contracts and permissions of this project, where each contract's audited and unaudited parts can be inspected."
        >
          {discoUiHref ? (
            <a
              href={discoUiHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 whitespace-nowrap rounded bg-linear-to-r from-[#854220] to-[#DE7B16] px-3 py-1.5 font-medium text-white text-xs md:mt-1"
            >
              <DiscoUiIcon className="h-[14px] w-[67px] fill-white" />
              <CustomLinkIcon className="size-3.5 fill-white" />
            </a>
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
      </ChartStats>
      <AuditsDisclaimer className="mt-4" />
    </>
  )
}

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}
