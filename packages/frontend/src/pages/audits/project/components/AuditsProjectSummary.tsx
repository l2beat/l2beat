import { formatInteger } from '@l2beat/shared-pure'
import {
  formatShare,
  totalUnits,
  UNCOUNTED_UNITS_NOTE,
} from '~/components/audits/auditStatus'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatContractCount } from '~/components/ossification/formatCriticalChangesPerYear'
import type {
  AuditsProjectDetails,
  AuditsProjectScope,
  AuditsReadingDetails,
} from '~/server/features/audits/types'
import { AuditsDisclaimer } from './AuditsDisclaimer'

type Props = Pick<
  AuditsProjectDetails,
  'coverage' | 'contracts' | 'verifiers' | 'fullyCoveredContracts' | 'scope'
>

export function AuditsProjectSummary(props: Props) {
  if (props.scope) {
    return <ScopedSummary {...props} scope={props.scope} />
  }
  return <BaseSummary {...props} />
}

/** Label above value on a phone: two readings do not fit beside the label. */
const STACKED_ON_MOBILE = 'max-md:flex-col max-md:items-start max-md:gap-0.5'

/**
 * The three shares under both readings of the reports. What a reading means
 * for a share is on the value itself. See
 * docs/superpowers/specs/2026-11-17-audit-scope-explicitness-design.md.
 */
function ScopedSummary({
  scope,
  contracts,
  verifiers,
}: Props & { scope: AuditsProjectScope }) {
  const { strict, relaxed } = scope
  const audited = (reading: AuditsReadingDetails) =>
    totalUnits(reading.coverage.units) - reading.coverage.units.unaudited
  return (
    <>
      <ChartStats className="lg:grid-cols-3">
        <ChartStatsItem
          className={STACKED_ON_MOBILE}
          label="Fully audited contracts"
          tooltip="Critical contracts whose whole deployed source is identical to audited code."
        >
          <TwoReadings
            strict={{
              value: formatShare(strict.fullyCoveredContracts, contracts),
              tooltip:
                'Contracts made up entirely of code that an audit report explicitly includes.',
            }}
            relaxed={{
              value: formatShare(relaxed.fullyCoveredContracts, contracts),
              tooltip:
                'Also accepts code that no report names, when code a report does name depends on it.',
            }}
          />
          <SecondLine>
            {formatInteger(strict.fullyCoveredContracts)} /{' '}
            {formatInteger(relaxed.fullyCoveredContracts)} of{' '}
            {formatInteger(contracts)} contracts
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ON_MOBILE}
          label="Ever audited"
          tooltip="Deployed contracts, libraries and free functions that have an audited source, identical to it or not."
        >
          <TwoReadings
            strict={{
              value: formatShare(
                audited(strict),
                totalUnits(strict.coverage.units),
              ),
              tooltip:
                'Units that an audit report explicitly includes, in some version.',
            }}
            relaxed={{
              value: formatShare(
                audited(relaxed),
                totalUnits(relaxed.coverage.units),
              ),
              tooltip:
                'Also units that no report names, when code a report does name inherits from, calls or links them.',
            }}
          />
          <SecondLine>
            {formatInteger(audited(strict))} / {formatInteger(audited(relaxed))}{' '}
            of {formatInteger(totalUnits(strict.coverage.units))} units
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          className={STACKED_ON_MOBILE}
          label="Lines identical to audited"
          tooltip="Deployed lines that are identical to an audited version of the same code."
        >
          <TwoReadings
            strict={{
              value: formatShare(
                strict.coverage.lines.covered,
                strict.coverage.lines.total,
              ),
              tooltip:
                'Lines matching code that an audit report explicitly includes.',
            }}
            relaxed={{
              value: formatShare(
                relaxed.coverage.lines.covered,
                relaxed.coverage.lines.total,
              ),
              tooltip:
                'Also lines matching code that no report names, when code a report does name depends on it.',
            }}
          />
          <SecondLine>
            {formatInteger(strict.coverage.lines.covered)} /{' '}
            {formatInteger(relaxed.coverage.lines.covered)} of{' '}
            {formatInteger(strict.coverage.lines.total)} lines
          </SecondLine>
        </ChartStatsItem>
      </ChartStats>
      {verifiers > 0 && <VerifiersNote verifiers={verifiers} />}
      <AuditsDisclaimer className="mt-4" />
    </>
  )
}

interface ReadingValue {
  value: string
  /** What this reading counts for this share. */
  tooltip: string
}

function TwoReadings({
  strict,
  relaxed,
}: {
  strict: ReadingValue
  relaxed: ReadingValue
}) {
  return (
    <span className="flex items-baseline gap-x-2 max-lg:flex-wrap lg:whitespace-nowrap">
      <Reading label="strict" {...strict} />
      <span className="font-normal text-secondary">/</span>
      <Reading label="relaxed" {...relaxed} />
    </span>
  )
}

function Reading({
  label,
  value,
  tooltip,
}: ReadingValue & { label: 'strict' | 'relaxed' }) {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-help whitespace-nowrap text-left">
        <span className="text-xl leading-7 md:text-2xl">{value}</span>{' '}
        <span className="font-normal text-secondary text-xs underline decoration-dotted underline-offset-2">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] font-normal">
        <span className="font-medium capitalize">{label}.</span> {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

function BaseSummary({
  coverage,
  contracts,
  verifiers,
  fullyCoveredContracts,
}: Props) {
  const units = totalUnits(coverage.units)
  const audited = units - coverage.units.unaudited
  const { lines } = coverage
  return (
    <>
      <ChartStats className="lg:grid-cols-3">
        <ChartStatsItem
          label="Fully audited contracts"
          tooltip={`Share of the critical contracts whose whole deployed source, every unit of every file, is identical to audited code. Contracts without verified source count as not covered. ${UNCOUNTED_UNITS_NOTE}`}
        >
          {formatShare(fullyCoveredContracts, contracts)}
          <SecondLine>
            {formatInteger(fullyCoveredContracts)} of {formatInteger(contracts)}{' '}
            contracts
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          label="Ever audited"
          tooltip={`Share of deployed units (contracts, libraries, free functions) that have an audited source, identical to it or not. The rest was never audited. ${UNCOUNTED_UNITS_NOTE}`}
        >
          {formatShare(audited, units)}
          <SecondLine>
            {formatInteger(audited)} of {formatInteger(units)} units
          </SecondLine>
        </ChartStatsItem>
        <ChartStatsItem
          label="Lines identical to audited"
          tooltip={`Deployed lines identical to an audited version: every line of identical units plus the unchanged lines of differing units. ${UNCOUNTED_UNITS_NOTE}`}
        >
          {formatShare(lines.covered, lines.total)}
          <SecondLine>
            {formatInteger(lines.covered)} of {formatInteger(lines.total)} lines{' '}
            {formatContractCount(contracts)}
          </SecondLine>
        </ChartStatsItem>
      </ChartStats>
      {verifiers > 0 && <VerifiersNote verifiers={verifiers} />}
      <AuditsDisclaimer className="mt-4" />
    </>
  )
}

function VerifiersNote({ verifiers }: { verifiers: number }) {
  return (
    <p className="mt-4 text-secondary text-xs">
      {formatInteger(verifiers)} ZK{' '}
      {verifiers === 1 ? 'verifier is' : 'verifiers are'} left out of every
      number: zk program audits are not tracked yet.
    </p>
  )
}

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}
