import type { ComponentProps } from 'react'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import {
  getPrivacySummaryStats,
  PrivacyProjectRiskProfileRow,
  PrivacyProjectRosette,
} from '../../privacy/project/components/PrivacyProjectSummaryCard'
import { L2ProjectPage } from './L2ProjectPage'

interface Props
  extends Omit<ComponentProps<typeof L2ProjectPage>, 'mergedSummary'> {
  privacyEntry: ProjectPrivacyEntry
}

/**
 * A scaling project that is also a privacy protocol: the L2 page with the
 * privacy summary merged in. A page of its own, so the privacy code stays out
 * of every other L2 page's bundle.
 */
export function L2PrivacyProjectPage({ privacyEntry, ...props }: Props) {
  return (
    <L2ProjectPage
      {...props}
      mergedSummary={{
        label: 'Privacy',
        stats: getPrivacySummaryStats(privacyEntry),
        rows: <PrivacyProjectRiskProfileRow entry={privacyEntry} />,
        rosette: <PrivacyProjectRosette entry={privacyEntry} />,
      }}
    />
  )
}
