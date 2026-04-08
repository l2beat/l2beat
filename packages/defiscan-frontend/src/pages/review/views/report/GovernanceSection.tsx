import type { CompiledReview } from '../../../../types'
import { SectionHeader, ShowMoreButton } from './_shared'

interface GovernanceGridData {
  implementation: string
  voteExecution: string
  votingUnit: string
  votingPeriod: string
  executionDelay: string
  powerPercent: number
  powerDescription: string
  footer?: React.ReactNode
}

function GovernanceGrid({ data }: { data: GovernanceGridData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
      {/* System Overview */}
      <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
        <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
          System Overview
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-text-muted">Implementation</span>
            <span className="font-mono font-bold text-[14px] text-text-primary">{data.implementation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-text-muted">Vote Execution</span>
            <span className="font-mono font-bold text-[14px] text-text-primary">{data.voteExecution}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-text-muted">Voting Unit</span>
            <span className="font-mono font-bold text-[14px] text-text-primary">{data.votingUnit}</span>
          </div>
        </div>
        {data.footer}
      </div>

      {/* Voting Process */}
      <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
        <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
          Voting Process
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center h-[48px] gap-1">
            <div className="w-[127px] shrink-0 flex items-center justify-center">
              <span className="font-bold text-[36px] leading-none text-accent">{data.votingPeriod}</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                Voting Period
              </span>
            </div>
          </div>
          <div className="flex items-center h-[48px] gap-1">
            <div className="w-[127px] shrink-0 flex items-center justify-center">
              <span className="font-bold text-[36px] leading-none text-accent">{data.executionDelay}</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                Execution Delay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Power Distribution */}
      <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
        <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
          Voting Power Distribution
        </p>
        <div className="flex flex-col gap-3">
          <div className="h-5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${data.powerPercent}%` }} />
          </div>
          <p className="text-xs text-text-muted">
            {data.powerDescription}
          </p>
        </div>
      </div>
    </div>
  )
}

const mockData: GovernanceGridData = {
  implementation: 'Governor Bravo',
  voteExecution: 'Timelock',
  votingUnit: 'ERC-20 Token',
  votingPeriod: '3 days',
  executionDelay: '48h',
  powerPercent: 65,
  powerDescription: 'Top 10 delegates control 62% of voting power.',
}

interface GovernanceSectionProps {
  review: CompiledReview
  onShowMore: () => void
}

export function GovernanceSection({ review, onShowMore }: GovernanceSectionProps) {
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

      {governanceAdmins.length === 0 ? (
        <div className="relative overflow-hidden rounded-lg">
          <div aria-hidden="true" className="blur-[3px] opacity-60 select-none pointer-events-none">
            <GovernanceGrid data={mockData} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg className="size-14 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent uppercase tracking-[1.2px]">
              Coming Soon
            </span>
          </div>
        </div>
      ) : (
        <GovernanceGrid
          data={{
            implementation: '—',
            voteExecution: '—',
            votingUnit: '—',
            votingPeriod: '—',
            executionDelay: '—',
            powerPercent: 0,
            powerDescription: governanceAdmins.length > 0
              ? 'Voting power distribution data is not yet available.'
              : 'No on-chain governance detected for this protocol.',
            footer: governanceAdmins.length > 0 ? (
              <div className="border-t border-border pt-3">
                <p className="text-[11px] text-text-muted">
                  {governanceAdmins.length} governance-controlled admin{governanceAdmins.length !== 1 ? 's' : ''}: {governanceAdmins.map((a) => a.name).join(', ')}
                </p>
              </div>
            ) : undefined,
          }}
        />
      )}
    </div>
  )
}
