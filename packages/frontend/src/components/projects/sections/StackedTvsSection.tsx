import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/ProjectStackedTvsChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TvsBreakdownSummaryBox } from '~/pages/scaling/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { cn } from '~/utils/cn'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface StackedTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvsInfo: ProjectTvsInfo
  tvsBreakdownUrl?: string
  defaultRange: TvsChartRange
}

export function StackedTvsSection({
  projectId,
  milestones,
  tokens,
  tvsProjectStats,
  tvsInfo,
  tvsBreakdownUrl,
  defaultRange,
  ...sectionProps
}: StackedTvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectStackedTvsChart
        milestones={milestones}
        projectId={projectId}
        tokens={tokens}
        tvsBreakdownUrl={tvsBreakdownUrl}
        defaultRange={defaultRange}
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
            warning={tvsInfo?.warnings[0]}
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
}: {
  tvsBreakdownUrl: string
}) {
  return (
    <a
      href={tvsBreakdownUrl}
      className={cn(
        'font-bold text-primary text-xs leading-none md:text-white',
        'mt-4 flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-linear-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
    >
      View TVS breakdown
    </a>
  )
}
