import { pluralize } from '@l2beat/shared-pure'
import { formatDuration } from '~/components/audits/auditsTimeline'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { AuditsProjectTimeline } from '~/server/features/audits/types'
import { formatTimestamp } from '~/utils/dates'
import { AuditsCoverageChart } from './AuditsCoverageChart'
import { AuditsTimelineChart } from './AuditsTimelineChart'

interface Props {
  timeline: AuditsProjectTimeline
}

export function AuditsTimelineSection({ timeline }: Props) {
  const interval = timeline.auditInterval
  return (
    <div className="flex flex-col gap-4">
      <p className="text-paragraph-15 md:text-paragraph-16">
        When the project's audit reports were published, against the code
        changes of its critical contracts as tracked by ossification. State
        changes of those contracts alter no deployed code and are left out. For
        a project built on a stack, the stack's audits that matched its deployed
        code count as its own. Code changed after the latest audit is only
        covered where it stayed identical to an audited version.
        {timeline.coverageHistory !== undefined &&
          ' The chart below shows how many lines of the critical contracts no audit covered at each moment, counting only the audits published by then and the code deployed then.'}
      </p>
      <ChartStats className="lg:grid-cols-4">
        <ChartStatsItem
          label="Latest audit"
          tooltip="The newest dated report among the project's audits: its own reports, whether or not they matched the deployed code, and the matched reports of its stack. Library audits and matches of unrelated projects are not counted."
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
          tooltip="The project's life since its launch or its first own audit, whichever came first, divided by the number of its dated audit reports since then, own and stack. Library audits and matches of unrelated projects are not counted."
        >
          {interval !== null && (
            <>
              {formatDuration(interval.average)}
              <SecondLine>
                {interval.audits} {pluralize(interval.audits, 'audit')} since{' '}
                {formatTimestamp(interval.start)}
              </SecondLine>
            </>
          )}
        </ChartStatsItem>
        <ChartStatsItem
          label="Average upgrade interval"
          tooltip="The project's life since its launch divided by the number of code changes to its critical contracts, as measured by ossification. State changes are not counted."
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
          tooltip="Code changes to the project's critical contracts after the project's latest audit report, own or of its stack, was published, as measured by ossification. State changes, library audits and matches of unrelated projects are not counted."
        >
          {timeline.criticalChangesSinceLatestAudit !== null ? (
            String(timeline.criticalChangesSinceLatestAudit)
          ) : (
            <NotApplicableBadge />
          )}
        </ChartStatsItem>
      </ChartStats>
      <AuditsTimelineChart timeline={timeline} />
      {timeline.coverageHistory !== undefined && (
        <AuditsCoverageChart history={timeline.coverageHistory} />
      )}
    </div>
  )
}

function SecondLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-normal text-secondary text-xs">{children}</span>
  )
}
