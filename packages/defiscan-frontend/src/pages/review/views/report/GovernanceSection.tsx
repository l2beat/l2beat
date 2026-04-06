import type { CompiledReview } from '../../../../types'
import { SectionHeader, ShowMoreButton } from './_shared'

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
        action={<ShowMoreButton onClick={onShowMore} />}
      />

      {governanceAdmins.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-[33px] flex flex-col items-center justify-center gap-4 min-h-[220px]">
          <svg className="size-14 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <p className="text-sm text-text-muted">No governance system detected</p>
        </div>
      ) : (
      <div className="grid grid-cols-3 gap-x-[20px]">
        {/* System Overview */}
        <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
          <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
            System Overview
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-muted">Implementation</span>
              <span className="font-mono font-bold text-[14px] text-text-primary">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-muted">Vote Execution</span>
              <span className="font-mono font-bold text-[14px] text-text-primary">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-muted">Voting Unit</span>
              <span className="font-mono font-bold text-[14px] text-text-primary">—</span>
            </div>
          </div>
          {governanceAdmins.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-[11px] text-text-muted">
                {governanceAdmins.length} governance-controlled admin{governanceAdmins.length !== 1 ? 's' : ''}: {governanceAdmins.map((a) => a.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Voting Process */}
        <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
          <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
            Voting Process
          </p>
          <div className="flex flex-col gap-3">
            {/* Voting Period row */}
            <div className="flex items-center h-[48px] gap-1">
              <div className="w-[127px] shrink-0 flex items-center justify-center">
                <span className="font-bold text-[36px] leading-none text-accent">—</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                  Voting Period
                </span>
              </div>
            </div>
            {/* Execution Delay row */}
            <div className="flex items-center h-[48px] gap-1">
              <div className="w-[127px] shrink-0 flex items-center justify-center">
                <span className="font-bold text-[36px] leading-none text-accent">—</span>
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
              <div className="h-full w-0 bg-accent rounded-full" />
            </div>
            <p className="text-xs text-text-muted">
              {governanceAdmins.length > 0
                ? 'Voting power distribution data is not yet available.'
                : 'No on-chain governance detected for this protocol.'}
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
