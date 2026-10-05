import { formatCurrency, pluralize } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import {
  SPARKLINE_BASELINE as BASELINE,
  SPARKLINE_CRISP as CRISP,
  getSparklineAreaPaths,
  SPARKLINE_HEIGHT as HEIGHT,
  SPARKLINE_LINE_PROPS as LINE_PROPS,
  SPARKLINE_SCALE_NOTE as SCALE_NOTE,
  snapToPixel,
  SPARKLINE_WIDTH as WIDTH,
} from '~/components/ossification/timelineSparkline'
import type { AuditsSummaryTimeline } from '~/server/features/audits/types'
import type { OssificationValueSource } from '~/server/features/projects/ossification/getOssificationSeries'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  timeline: AuditsSummaryTimeline
  valueSource: OssificationValueSource | null
  className?: string
}

/** A year of value with the project's own audit reports ticked below it. */
export function AuditsTimelineChart({
  timeline,
  valueSource,
  className,
}: Props) {
  const { from, to, audits, latestAudit, values } = timeline
  const toX = (timestamp: number) => ((timestamp - from) / (to - from)) * WIDTH
  const latestBeforeWindow = latestAudit !== null && latestAudit < from
  const area = values ? getSparklineAreaPaths(values) : undefined
  const description = getDescription(timeline, valueSource)

  return (
    <Tooltip>
      <TooltipTrigger className={cn('block', className)}>
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={[
            `${description.title}, ${description.period}.`,
            ...description.lines,
            `${SCALE_NOTE}.`,
          ].join(' ')}
        >
          <line
            x1={0}
            x2={WIDTH}
            y1={BASELINE + 0.5}
            y2={BASELINE + 0.5}
            stroke="var(--divider)"
            {...CRISP}
          />
          {area && (
            <>
              <path d={area.fill} fill="var(--chart-pink)" fillOpacity={0.25} />
              <path
                d={area.line}
                fill="none"
                stroke="var(--chart-pink)"
                {...LINE_PROPS}
              />
            </>
          )}
          {audits.map((audit, i) => (
            <line
              // Several reports can share a day.
              key={`${audit}-${i}`}
              x1={snapToPixel(toX(audit))}
              x2={snapToPixel(toX(audit))}
              y1={BASELINE + 2}
              y2={HEIGHT}
              stroke="var(--brand)"
              {...CRISP}
            />
          ))}
          {latestBeforeWindow && (
            <path
              d={`M5 ${BASELINE + 1.5}L1 ${BASELINE + 3.5}L5 ${BASELINE + 5.5}Z`}
              fill="var(--brand)"
            />
          )}
        </svg>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-80 flex-col gap-1.5">
        <div>
          <div className="font-bold">{description.title}</div>
          <div className="text-secondary">{description.period}</div>
        </div>
        {description.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <span className="text-secondary">{SCALE_NOTE}.</span>
      </TooltipContent>
    </Tooltip>
  )
}

function getDescription(
  { from, to, audits, latestAudit, values }: AuditsSummaryTimeline,
  valueSource: OssificationValueSource | null,
) {
  const known = values?.filter((value) => value !== null) ?? []
  const current = known.at(-1)
  return {
    title: `${OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short} & audits`,
    period: `${formatTimestamp(from)} – ${formatTimestamp(to)}`,
    lines: [
      audits.length === 0
        ? 'No audit report in this window.'
        : `${audits.length} audit ${pluralize(audits.length, 'report')} in this window: ${audits.map((audit) => formatTimestamp(audit)).join(', ')}.`,
      latestAudit === null
        ? 'No dated audit report.'
        : `Latest audit report ${formatTimestamp(latestAudit)}${latestAudit < from ? ', before this window' : ''}.`,
      current !== undefined && valueSource
        ? `${OSSIFICATION_VALUE_LABELS[valueSource].long} now ${formatCurrency(current, 'usd')}, peaking at ${formatCurrency(Math.max(...known), 'usd')}.`
        : 'No value data.',
    ],
  }
}
