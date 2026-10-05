import { formatCurrency, formatSeconds, pluralize } from '@l2beat/shared-pure'
import { useId } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import {
  SPARKLINE_BASELINE as BASELINE,
  SPARKLINE_CRISP as CRISP,
  getSparklineAreaPaths,
  SPARKLINE_HEIGHT as HEIGHT,
  SPARKLINE_LINE_PROPS as LINE_PROPS,
  SPARKLINE_SCALE_NOTE as SCALE_NOTE,
  snapToPixel,
  SPARKLINE_WIDTH as WIDTH,
} from './timelineSparkline'

type Props = Pick<OssificationStats, 'timeline' | 'valueSource'>

export function OssificationTimelineChart({
  timeline,
  valueSource,
  className,
}: Props & { className?: string }) {
  const id = useId()
  const { from, to, clockStart, resets, values } = timeline
  const toX = (timestamp: number) => ((timestamp - from) / (to - from)) * WIDTH
  const clockBeforeWindow = clockStart < from
  const clockX = clockBeforeWindow ? 0 : toX(clockStart)
  const area = values ? getSparklineAreaPaths(values) : undefined
  const description = getDescription({
    timeline,
    valueSource,
    clockBeforeWindow,
  })

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
          <defs>
            <clipPath id={`${id}-before`}>
              <rect x={0} y={0} width={clockX} height={HEIGHT} />
            </clipPath>
            <clipPath id={`${id}-after`}>
              <rect x={clockX} y={0} width={WIDTH - clockX} height={HEIGHT} />
            </clipPath>
          </defs>
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
              <g clipPath={`url(#${id}-before)`}>
                <path
                  d={area.fill}
                  fill="var(--secondary)"
                  fillOpacity={0.15}
                />
                <path
                  d={area.line}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeOpacity={0.5}
                  {...LINE_PROPS}
                />
              </g>
              <g clipPath={`url(#${id}-after)`}>
                <path
                  d={area.fill}
                  fill="var(--chart-pink)"
                  fillOpacity={0.25}
                />
                <path
                  d={area.line}
                  fill="none"
                  stroke="var(--chart-pink)"
                  {...LINE_PROPS}
                />
              </g>
            </>
          )}
          {resets.map((reset) => (
            <line
              key={reset}
              x1={snapToPixel(toX(reset))}
              x2={snapToPixel(toX(reset))}
              y1={BASELINE + 2}
              y2={HEIGHT}
              stroke="var(--secondary)"
              strokeOpacity={0.6}
              {...CRISP}
            />
          ))}
          {clockBeforeWindow ? (
            <path
              d={`M5 ${BASELINE + 1.5}L1 ${BASELINE + 3.5}L5 ${BASELINE + 5.5}Z`}
              fill="var(--chart-pink)"
            />
          ) : (
            <line
              x1={snapToPixel(clockX)}
              x2={snapToPixel(clockX)}
              y1={0}
              y2={HEIGHT}
              stroke="var(--chart-pink)"
              {...CRISP}
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

function getDescription({
  timeline,
  valueSource,
  clockBeforeWindow,
}: Props & { clockBeforeWindow: boolean }) {
  const { from, to, clockStart, values } = timeline
  const known = values?.filter((value) => value !== null) ?? []
  const current = known.at(-1)
  return {
    title: `${OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short} & critical changes`,
    period: `${formatTimestamp(from)} – ${formatTimestamp(to)}`,
    lines: [
      `Unchanged for ${formatSeconds(to - clockStart)}, since ${formatTimestamp(clockStart)}${clockBeforeWindow ? ' — before this window, so the whole year is highlighted' : ''}.`,
      getResetsLine(timeline),
      current !== undefined && valueSource
        ? `${OSSIFICATION_VALUE_LABELS[valueSource].long} now ${formatCurrency(current, 'usd')}, peaking at ${formatCurrency(Math.max(...known), 'usd')}.`
        : 'No value data.',
    ],
  }
}

// One tick per reset; deployments reset the clock too, so ticks outnumber
// critical changes.
function getResetsLine({ resets, criticalChanges }: Props['timeline']) {
  if (resets.length === 0) {
    return 'No reset in this window.'
  }
  const changes =
    criticalChanges === 0
      ? 'no critical change'
      : `${criticalChanges} critical ${pluralize(criticalChanges, 'change')}`
  return `${resets.length} ${pluralize(resets.length, 'reset')} in this window (${changes}).`
}
