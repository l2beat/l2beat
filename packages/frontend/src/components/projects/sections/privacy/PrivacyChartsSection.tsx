import type { ChartProject } from '~/components/core/chart/Chart'
import { PrivacyBreakdownTable } from '~/pages/privacy/project/components/PrivacyBreakdownTable'
import { PrivacyFlowsChartsSection } from '~/pages/privacy/project/components/PrivacyFlowsChartsSection'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyChartsSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  assets: PrivacyAssetSnapshot[]
}

export function PrivacyChartsSection({
  defaultRange,
  project,
  assets,
  ...projectSectionProps
}: PrivacyChartsSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <PrivacyFlowsChartsSection defaultRange={defaultRange} project={project} />
      <div className="mt-8">
        <h3 className="mb-3 font-bold text-lg md:text-xl">Assets Breakdown</h3>
        <PrivacyBreakdownTable assets={assets} />
      </div>
    </ProjectSection>
  )
}
