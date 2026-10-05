import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { AuditsProjectTimeline } from '~/server/features/audits/types'
import { formatTimestamp } from '~/utils/dates'
import { AuditsProjectTimelineChart } from './AuditsProjectTimelineChart'

interface Props {
  project: ChartProject
  timeline: AuditsProjectTimeline
}

export function AuditsTimelineSection({ project, timeline }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-paragraph-15 md:text-paragraph-16">
        When the project's own audit reports were published, against the
        critical upgrades of its contracts as tracked by ossification. Code
        changed after the latest audit is only covered where it stayed identical
        to an audited version.
      </p>
      <ChartStats className="lg:grid-cols-3">
        <ChartStatsItem
          label="Latest audit"
          tooltip="The newest dated report in the project's own audit collection, whether or not it matched the deployed code."
        >
          {timeline.latestAudit && (
            <>
              {formatTimestamp(timeline.latestAudit.timestamp)}
              <SecondLine>{timeline.latestAudit.auditor}</SecondLine>
            </>
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Latest critical upgrade"
          tooltip="The newest critical change to the project's critical contracts, as measured by ossification."
        >
          {timeline.hasOssification ? (
            timeline.latestCriticalChange ? (
              formatTimestamp(timeline.latestCriticalChange)
            ) : (
              'None recorded'
            )
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Upgrades since latest audit"
          tooltip="Critical changes that happened after the latest audit report was published."
        >
          {timeline.criticalChangesSinceLatestAudit !== null ? (
            String(timeline.criticalChangesSinceLatestAudit)
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
      </ChartStats>
      <AuditsProjectTimelineChart project={project} timeline={timeline} />
    </div>
  )
}

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}
