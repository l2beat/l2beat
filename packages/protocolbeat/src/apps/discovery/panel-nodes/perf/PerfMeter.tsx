import clsx from 'clsx'
import { type ReactNode, useState, useSyncExternalStore } from 'react'
import { type PerfSnapshot, perfStats } from './perfStats'

const ACTION_LIMIT = 8

export function PerfMeter() {
  useSyncExternalStore(
    perfStats.subscribe,
    perfStats.getVersion,
    perfStats.getVersion,
  )

  const snapshot = perfStats.snapshot()
  const [expanded, setExpanded] = useState(false)
  const topActions = snapshot.actions.slice(0, ACTION_LIMIT)

  return (
    <div className="pointer-events-none absolute inset-y-4 right-4 z-20 flex w-[min(30rem,calc(100vw-2rem))] flex-col gap-2">
      <button
        type="button"
        className="pointer-events-auto w-full rounded border border-coffee-400/60 bg-black/85 px-3 py-2 text-left shadow-[0_18px_40px_-24px_#000000] backdrop-blur-sm"
        onClick={() => setExpanded((state) => !state)}
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-[11px] text-coffee-200 uppercase tracking-[0.22em]">
            <span
              className={clsx(
                'h-2.5 w-2.5 rounded-full',
                getFpsDotClass(snapshot.avgFps),
              )}
            />
            Perf
          </div>
          <div className="font-mono text-[11px] text-coffee-400">
            {expanded ? 'hide details' : 'show details'}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <SummaryStat
            label="FPS"
            value={formatNumber(snapshot.avgFps)}
            tone={getFpsTextClass(snapshot.avgFps)}
          />
          <SummaryStat
            label="Frame p95"
            value={formatMs(snapshot.frameP95Ms)}
            tone={getDurationTextClass(snapshot.frameP95Ms, 16.7, 33.3)}
          />
          <SummaryStat
            label="Render p95"
            value={formatMs(snapshot.renderP95Ms)}
            tone={getDurationTextClass(snapshot.renderP95Ms, 8, 16)}
          />
        </div>
      </button>

      {expanded && (
        <div className="pointer-events-auto relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded border border-coffee-400/60 bg-black/90 p-3 text-xs shadow-[0_24px_48px_-28px_#000000] backdrop-blur-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <BudgetBar
              label="Frame p95"
              valueMs={snapshot.frameP95Ms}
              goodMs={16.7}
              warnMs={33.3}
            />
            <BudgetBar
              label="Render p95"
              valueMs={snapshot.renderP95Ms}
              goodMs={8}
              warnMs={16}
            />
          </div>

          <SectionTitle className="mt-4">Live</SectionTitle>
          <StatsGrid
            items={[
              ['fps now', formatNumber(snapshot.fps)],
              ['fps avg', formatNumber(snapshot.avgFps)],
              ['fps min', formatNumber(snapshot.minFps)],
              ['frame last', formatMs(snapshot.frameLastMs)],
              ['frame p50', formatMs(snapshot.frameP50Ms)],
              ['frame max', formatMs(snapshot.frameMaxMs)],
              ['render last', formatMs(snapshot.renderLastMs)],
              ['render avg', formatMs(snapshot.renderAvgMs)],
              ['renders / 5s', String(snapshot.renderCount)],
              ['long tasks / 5s', String(snapshot.longTasks5s)],
              [
                'heap',
                snapshot.memoryMB ? formatMegabytes(snapshot.memoryMB) : 'n/a',
              ],
              ['uptime', formatDuration(snapshot.uptimeSec)],
            ]}
          />

          <SectionTitle className="mt-4">Scene</SectionTitle>
          <StatsGrid
            items={[
              ['nodes', String(snapshot.scene.nodes)],
              ['visible', String(snapshot.scene.visibleNodes)],
              ['hidden', String(snapshot.scene.hiddenNodes)],
              ['connections', String(snapshot.scene.connections)],
              ['fields', String(snapshot.scene.fields)],
            ]}
          />

          <div className="mt-4 flex items-center justify-between gap-2">
            <SectionTitle>Hot Actions</SectionTitle>
            <button
              type="button"
              className="rounded border border-coffee-500 bg-coffee-800 px-2 py-1 font-medium text-[11px] text-coffee-200 uppercase tracking-[0.16em]"
              onClick={() => perfStats.reset()}
            >
              Reset
            </button>
          </div>

          {topActions.length > 0 ? (
            <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
              {topActions.map((action) => (
                <ActionRow
                  key={action.name}
                  action={action}
                  baselineMs={snapshot.actions[0]?.p95Ms ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 rounded border border-coffee-700 bg-coffee-900/60 px-3 py-2 text-coffee-400">
              No action samples yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryStat(props: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded border border-coffee-700/80 bg-coffee-900/70 px-2 py-1.5">
      <div className="text-[11px] text-coffee-400 uppercase tracking-[0.16em]">
        {props.label}
      </div>
      <div className={clsx('font-mono text-base text-coffee-100', props.tone)}>
        {props.value}
      </div>
    </div>
  )
}

function BudgetBar(props: {
  label: string
  valueMs: number
  goodMs: number
  warnMs: number
}) {
  const width = Math.min(100, (props.valueMs / (props.warnMs * 2)) * 100)
  return (
    <div className="rounded border border-coffee-700/80 bg-coffee-900/60 p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] text-coffee-300 uppercase tracking-[0.16em]">
          {props.label}
        </div>
        <div
          className={clsx(
            'font-mono text-sm',
            getDurationTextClass(props.valueMs, props.goodMs, props.warnMs),
          )}
        >
          {formatMs(props.valueMs)}
        </div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-coffee-700">
        <div
          className={clsx(
            'h-full rounded-full transition-[width] duration-200',
            getDurationBarClass(props.valueMs, props.goodMs, props.warnMs),
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-1 text-[11px] text-coffee-400">
        target {formatMs(props.goodMs)} / warn {formatMs(props.warnMs)}
      </div>
    </div>
  )
}

function StatsGrid(props: {
  items: readonly [label: string, value: string][]
}) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 rounded border border-coffee-700/80 bg-coffee-900/60 p-2">
      {props.items.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-2">
          <span className="text-coffee-400">{label}</span>
          <span className="font-mono text-coffee-100">{value}</span>
        </div>
      ))}
    </div>
  )
}

function SectionTitle(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'font-medium text-[11px] text-coffee-300 uppercase tracking-[0.22em]',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

function ActionRow(props: {
  action: PerfSnapshot['actions'][number]
  baselineMs: number
}) {
  const width =
    props.baselineMs > 0
      ? Math.min(100, (props.action.p95Ms / props.baselineMs) * 100)
      : 0

  return (
    <div className="rounded border border-coffee-700/80 bg-coffee-900/60 p-2">
      <div className="flex items-center justify-between gap-3">
        <div className="truncate font-mono text-coffee-100">
          {props.action.name}
        </div>
        <div
          className={clsx(
            'shrink-0 font-mono',
            getDurationTextClass(props.action.p95Ms, 4, 12),
          )}
        >
          p95 {formatMs(props.action.p95Ms)}
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-coffee-700">
        <div
          className={clsx(
            'h-full rounded-full transition-[width] duration-200',
            getDurationBarClass(props.action.p95Ms, 4, 12),
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
        <ActionStat label="last" value={formatMs(props.action.lastMs)} />
        <ActionStat label="avg" value={formatMs(props.action.avgMs)} />
        <ActionStat label="max" value={formatMs(props.action.maxMs)} />
        <ActionStat
          label="count"
          value={`${props.action.recent}/${props.action.count}`}
        />
      </div>
    </div>
  )
}

function ActionStat(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-1">
      <span className="text-coffee-400">{props.label}</span>
      <span className="font-mono text-coffee-100">{props.value}</span>
    </div>
  )
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(0) : '0'
}

function formatMs(value: number) {
  return `${value.toFixed(1)}ms`
}

function formatMegabytes(value: number) {
  return `${value.toFixed(0)} MB`
}

function formatDuration(valueSec: number) {
  if (valueSec < 60) {
    return `${valueSec.toFixed(0)}s`
  }
  return `${(valueSec / 60).toFixed(1)}m`
}

function getFpsDotClass(fps: number) {
  if (fps >= 55) return 'bg-aux-green'
  if (fps >= 40) return 'bg-aux-orange'
  return 'bg-aux-red'
}

function getFpsTextClass(fps: number) {
  if (fps >= 55) return 'text-aux-green'
  if (fps >= 40) return 'text-aux-orange'
  return 'text-aux-red'
}

function getDurationTextClass(value: number, good: number, warn: number) {
  if (value <= good) return 'text-aux-green'
  if (value <= warn) return 'text-aux-orange'
  return 'text-aux-red'
}

function getDurationBarClass(value: number, good: number, warn: number) {
  if (value <= good) return 'bg-aux-green'
  if (value <= warn) return 'bg-aux-orange'
  return 'bg-aux-red'
}
