import { pluralize } from '@l2beat/shared-pure'
import { formatDuration } from '~/components/audits/auditsTimeline'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { AuditsProjectTimeline } from '~/server/features/audits/types'
import { formatTimestamp } from '~/utils/dates'
import { AuditsTimelineChart } from './AuditsTimelineChart'

interface Props {
  timeline: AuditsProjectTimeline
}

export function AuditsTimelineSection({ timeline }: Props) {
  const firstAudit = timeline.audits[0]
  const intervalStart = Math.min(
    timeline.launch ?? Number.POSITIVE_INFINITY,
    firstAudit?.timestamp ?? Number.POSITIVE_INFINITY,
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-paragraph-15 md:text-paragraph-16">
        When the project's own audit reports were published, against the
        critical upgrades of its contracts as tracked by ossification. Code
        changed after the latest audit is only covered where it stayed identical
        to an audited version.
      </p>
      <ChartStats className="lg:grid-cols-4">
        <ChartStatsItem
          label="Latest audit"
          tooltip="The newest dated report among the project's own audits, whether or not it matched the deployed code. Shared audits of upstream code, stacks and libraries are not counted."
        >
          {timeline.latestAudit && (
            <>
              {formatTimestamp(timeline.latestAudit.timestamp)}
              <SecondLine>
                {timeline.latestAudit.auditor} ·{' '}
                {formatDuration(timeline.to - timeline.latestAudit.timestamp)}{' '}
                ago
              </SecondLine>
            </>
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Average audit interval"
          tooltip="The project's life since its launch or its first audit, whichever came first, divided by the number of its own dated audit reports. Shared audits are not counted."
        >
          {timeline.averageAuditInterval !== null && (
            <>
              {formatDuration(timeline.averageAuditInterval)}
              <SecondLine>
                {timeline.audits.length}{' '}
                {pluralize(timeline.audits.length, 'audit')} since{' '}
                {formatTimestamp(intervalStart)}
              </SecondLine>
            </>
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Average upgrade interval"
          tooltip="The project's life since its launch divided by the number of critical changes to its critical contracts, as measured by ossification."
        >
          {timeline.averageUpgradeInterval !== null ? (
            <>
              {formatDuration(timeline.averageUpgradeInterval)}
              <SecondLine>
                {timeline.criticalChanges.length}{' '}
                {pluralize(timeline.criticalChanges.length, 'upgrade')}
                {timeline.launch !== null &&
                  ` since ${formatTimestamp(timeline.launch)}`}
              </SecondLine>
            </>
          ) : timeline.hasOssification ? (
            'No upgrades'
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Upgrades since latest audit"
          tooltip="Critical changes to the project's critical contracts after the project's latest own audit report was published, as measured by ossification. Shared audits are not counted."
        >
          {timeline.criticalChangesSinceLatestAudit !== null ? (
            String(timeline.criticalChangesSinceLatestAudit)
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
      </ChartStats>
      <AuditsTimelineChart timeline={timeline} />
    </div>
  )
}

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}
