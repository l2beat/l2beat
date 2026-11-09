import type { ComponentProps } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import { PrivacyAssessmentStat } from '../../privacy/project/components/PrivacyProjectRiskProfile'
import {
  getPrivacySummaryStats,
  PrivacyProjectRosette,
} from '../../privacy/project/components/PrivacyProjectSummaryCard'
import { L2ProjectPage } from './L2ProjectPage'

interface Props
  extends Omit<ComponentProps<typeof L2ProjectPage>, 'mergedSummary'> {
  privacyEntry: ProjectPrivacyEntry
}

/**
 * A scaling project that is also a privacy protocol: the L2 page with the
 * privacy summary merged in. The scaling rosette covers the privacy page's
 * trusted setup, exit window and reproducibility, so they are left out. A page
 * of its own, so the privacy code stays out of every other L2 page's bundle.
 */
export function L2PrivacyProjectPage({ privacyEntry, ...props }: Props) {
  return (
    <L2ProjectPage
      {...props}
      mergedSummary={{
        label: 'Privacy',
        rows: (
          <>
            <HorizontalSeparator className="max-md:my-2 md:mt-4" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:mt-4 md:grid-cols-4">
              <PrivacyAssessmentStat
                adversaries={getPrivacyAdversariesSummary(
                  privacyEntry.sections,
                )}
                href={privacyEntry.href}
                isUnderReview={privacyEntry.isUnderReview}
              />
              {getPrivacySummaryStats(privacyEntry)}
            </div>
          </>
        ),
        rosette: <PrivacyProjectRosette entry={privacyEntry} />,
      }}
    />
  )
}
