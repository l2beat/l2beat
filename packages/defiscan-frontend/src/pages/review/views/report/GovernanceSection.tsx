import type {
  CompiledGovernance,
  CompiledGovernanceDuration,
  CompiledReview,
} from '../../../../types'
import { SectionHeader, ShowMoreButton } from './_shared'

interface GovernanceGridData {
  implementation: string
  voteExecution: string
  votingUnit: string
  votingPeriod: string
  votingPeriodTitle?: string
  executionDelay: string
  executionDelayTitle?: string
  proposalRequirements: string
  votingProcess: string
  footer?: React.ReactNode
}

function GovernanceGrid({ data }: { data: GovernanceGridData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
      {/* System Overview */}
      <div className="bg-white border border-border rounded-lg px-[22px] pt-[22px] pb-[24px] flex flex-col gap-5">
        <p className="font-bold text-[12px] uppercase text-text-muted whitespace-nowrap tracking-[1.2px]">
          System Overview
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-text-muted">Implementation</span>
            <span className="font-mono font-bold text-[13px] text-text-primary text-right">{data.implementation}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-text-muted">Vote Execution</span>
            <span className="font-mono font-bold text-[13px] text-text-primary text-right">{data.voteExecution}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-text-muted">Voting Unit</span>
            <span className="font-mono font-bold text-[13px] text-text-primary text-right">{data.votingUnit}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-[13px] text-text-muted shrink-0">Proposal Requirements</span>
            <span className="font-mono font-bold text-[13px] text-text-primary text-right line-clamp-4 whitespace-pre-wrap">
              {data.proposalRequirements || '—'}
            </span>
          </div>
        </div>
        {data.footer}
      </div>

      {/* Voting Process */}
      <div className="bg-white border border-border rounded-lg px-[22px] pt-[22px] pb-[24px] flex flex-col gap-4">
        <p className="font-bold text-[12px] uppercase text-text-muted whitespace-nowrap tracking-[1.2px]">
          Voting Process
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center h-[40px] gap-1">
            <div className="flex-1 flex items-center justify-center pr-3">
              <span
                className="font-bold text-[25px] leading-none text-accent"
                title={data.votingPeriodTitle}
              >
                {data.votingPeriod}
              </span>
            </div>
            <div className="w-[110px] shrink-0 flex items-center justify-center">
              <span className="font-bold text-[12px] uppercase text-text-muted whitespace-nowrap">
                Voting Period
              </span>
            </div>
          </div>
          <div className="flex items-center h-[40px] gap-1">
            <div className="flex-1 flex items-center justify-center pr-3">
              <span
                className="font-bold text-[25px] leading-none text-accent"
                title={data.executionDelayTitle}
              >
                {data.executionDelay}
              </span>
            </div>
            <div className="w-[110px] shrink-0 flex items-center justify-center">
              <span className="font-bold text-[12px] uppercase text-text-muted whitespace-nowrap">
                Execution Delay
              </span>
            </div>
          </div>
        </div>
        {data.votingProcess && (
          <p className="border-t border-border pt-3 text-[12px] text-text-muted whitespace-pre-wrap leading-snug">
            {data.votingProcess}
          </p>
        )}
      </div>

      {/* Voting Power Distribution — Coming Soon (blurred placeholder) */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          aria-hidden="true"
          className="blur-[1.5px] opacity-70 select-none pointer-events-none h-full"
        >
          <div className="bg-white border border-border rounded-lg px-[22px] pt-[22px] pb-[24px] flex flex-col gap-5 h-full">
            <p className="font-bold text-[12px] uppercase text-text-muted whitespace-nowrap tracking-[1.2px]">
              Voting Power Distribution
            </p>
            <div className="flex flex-col gap-3">
              <div className="h-5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
              <p className="text-xs text-text-muted">
                Top 10 delegates control 62% of voting power.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent uppercase tracking-[1.2px]">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  )
}

const placeholderData: GovernanceGridData = {
  implementation: 'Governor Bravo',
  voteExecution: 'Timelock',
  votingUnit: 'ERC-20 Token',
  votingPeriod: '3 days',
  executionDelay: '48h',
  proposalRequirements: '100k tokens delegated to propose.',
  votingProcess: '',
}

interface GovernanceSectionProps {
  review: CompiledReview
  onShowMore: () => void
}

export function GovernanceSection({ review, onShowMore }: GovernanceSectionProps) {
  const governance = review.governance
  const governanceAdmins = review.admins.filter((a) => a.isGovernance)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-[33px] flex flex-col gap-8">
      <SectionHeader
        icon={
          <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
        }
        label="Governance"
        action={governanceAdmins.length > 0 ? <ShowMoreButton onClick={onShowMore} /> : undefined}
      />

      {!governance ? (
        <div className="relative overflow-hidden rounded-lg">
          <div aria-hidden="true" className="blur-[3px] opacity-60 select-none pointer-events-none">
            <GovernanceGrid data={placeholderData} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg className="size-14 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent uppercase tracking-[1.2px]">
              Not Yet Documented
            </span>
          </div>
        </div>
      ) : (
        <GovernanceGrid data={mapGovernanceToGrid(governance, governanceAdmins.length)} />
      )}
    </div>
  )
}

function mapGovernanceToGrid(
  governance: CompiledGovernance,
  adminCount: number,
): GovernanceGridData {
  const period = formatDuration(governance.proposalPeriod)
  const delay = formatDuration(governance.executionDelay)
  return {
    implementation: governance.framework || '—',
    voteExecution:
      governance.voteExecution === 'onchain' ? 'On-chain' : 'Off-chain',
    votingUnit: governance.votingUnit || '—',
    votingPeriod: period.display,
    votingPeriodTitle: period.title,
    executionDelay: delay.display,
    executionDelayTitle: delay.title,
    proposalRequirements: governance.proposalRequirements,
    votingProcess: governance.votingProcess ?? '',
    footer:
      adminCount > 0 ? (
        <div className="border-t border-border pt-3">
          <p className="text-[11px] text-text-muted">
            {adminCount} governance-controlled admin{adminCount !== 1 ? 's' : ''}
          </p>
        </div>
      ) : undefined,
  }
}

function formatDuration(d: CompiledGovernanceDuration): {
  display: string
  title?: string
} {
  if (d.kind === 'none') {
    return { display: 'None' }
  }
  if (d.kind === 'fixed') {
    return { display: d.value?.trim() || '—' }
  }
  // fieldRef
  if (d.resolved && typeof d.seconds === 'number') {
    const contractLabel = d.contractName ?? d.contractAddress
    return {
      display: formatSeconds(d.seconds),
      title: `${d.fieldName} on ${contractLabel}`,
    }
  }
  return { display: 'Unresolved', title: d.error }
}

function formatSeconds(seconds: number): string {
  const format = (value: number, singular: string, plural: string) => {
    const rounded = value === Math.floor(value) ? value : Number(value.toFixed(1))
    return `${rounded} ${rounded === 1 ? singular : plural}`
  }
  if (seconds >= 86400) return format(seconds / 86400, 'Day', 'Days')
  if (seconds >= 3600) return format(seconds / 3600, 'Hour', 'Hours')
  if (seconds >= 60) return format(seconds / 60, 'Minute', 'Minutes')
  return format(seconds, 'Second', 'Seconds')
}
