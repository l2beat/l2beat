import type { Milestone, ProjectTvlInfo } from '@l2beat/config'
import Link from 'next/link'
import { TvsBreakdownSummaryBox } from '~/app/(top-nav)/scaling/projects/[slug]/tvs-breakdown/_components/tvs-breakdown-summary-box'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/project-stacked-tvs-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get-7d-tvs-breakdown'
import { cn } from '~/utils/cn'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface StackedTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvlInfo: ProjectTvlInfo
  tvsBreakdownUrl?: string
}

export function StackedTvsSection({
  projectId,
  milestones,
  tokens,
  tvsProjectStats,
  tvlInfo,
  tvsBreakdownUrl,
  ...sectionProps
}: StackedTvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectStackedTvsChart
        milestones={milestones}
        projectId={projectId}
        tokens={tokens}
        tvsBreakdownUrl={tvsBreakdownUrl}
      />
      {tvsProjectStats && (
        <>
          <HorizontalSeparator className="my-4" />
          <TvsBreakdownSummaryBox
            total={{
              value: tvsProjectStats.breakdown.total,
              change: tvsProjectStats.change.total,
            }}
            canonical={{
              value: tvsProjectStats.breakdown.canonical,
              change: tvsProjectStats.change.canonical,
            }}
            external={{
              value: tvsProjectStats.breakdown.external,
              change: tvsProjectStats.change.external,
            }}
            native={{
              value: tvsProjectStats.breakdown.native,
              change: tvsProjectStats.change.native,
            }}
            warning={tvlInfo?.warnings[0]}
          />
          {tvsBreakdownUrl && (
            <div className="w-full md:hidden">
              <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
            </div>
          )}
        </>
      )}
    </ProjectSection>
  )
}

export function TvsBreakdownButton({
  tvsBreakdownUrl,
}: { tvsBreakdownUrl: string }) {
  return (
    <Link
      href={tvsBreakdownUrl}
      className={cn(
        'text-xs font-bold leading-none text-primary md:text-white',
        'mt-4 flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-gradient-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
    >
      View TVS breakdown
    </Link>
  )
}
