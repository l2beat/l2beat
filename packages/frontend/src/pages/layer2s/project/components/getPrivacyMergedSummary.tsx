import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { PrivacySummary } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import { PrivacyAssessmentStat } from '../../../privacy/project/components/PrivacyProjectRiskProfile'
import {
  getPrivacySummaryStats,
  PrivacySummaryRosette,
} from '../../../privacy/project/components/PrivacyProjectSummaryCard'
import type { MergedSummary } from './L2ProjectSummary'

/**
 * What the summary of a scaling project that is also a privacy protocol adds.
 * The scaling rosette covers the privacy page's trusted setup, exit window
 * and reproducibility, so they are left out. The adversaries come from the
 * page's own sections.
 */
export function getPrivacyMergedSummary(
  privacy: PrivacySummary,
  sections: ProjectDetailsSection[],
): MergedSummary {
  const adversaries = getPrivacyAdversariesSummary(sections)
  return {
    label: 'Privacy',
    rows: (
      <>
        <HorizontalSeparator className="max-md:my-2 md:mt-4" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:mt-4 md:grid-cols-4">
          <PrivacyAssessmentStat
            adversaries={adversaries}
            href={privacy.href}
            isUnderReview={privacy.isUnderReview}
          />
          {getPrivacySummaryStats(privacy)}
        </div>
      </>
    ),
    rosette: (
      <PrivacySummaryRosette
        adversaries={adversaries}
        isUnderReview={privacy.isUnderReview}
      />
    ),
  }
}
