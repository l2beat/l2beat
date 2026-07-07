import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PercentChange } from '~/components/PercentChange'
import { InfoIcon } from '~/icons/Info'
import type {
  FrameworkDominanceEntry,
  TokenFrameworksData,
} from '~/server/features/scaling/interop/getTokenFrameworksData'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { Last24HoursBadge } from '../../components/Last24HoursBadge'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

type Metric = 'volume' | 'transfers'

type DisplayFramework = {
  iconUrl?: string
  label: string
  name: string
  color: string
  slug?: string
}

type DisplayItem = {
  entry: FrameworkDominanceEntry
  framework: DisplayFramework
}

export function FrameworkDominanceContent({
  tokenFrameworks,
  frameworkDominance,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  isLoading: boolean
}) {
  const [metric, setMetric] = useState<Metric>('volume')

  const metricData = frameworkDominance
    ? metric === 'volume'
      ? frameworkDominance.volume
      : frameworkDominance.transfers
    : undefined

  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))
  const displayItems = metricData
    ? buildDisplayItems(metricData.entries, frameworksById)
    : []

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-18 md:text-heading-20">
          Framework Dominance by {metric === 'volume' ? 'Volume' : 'Transfers'}
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name="frameworkDominanceMetric"
        value={metric}
        onValueChange={(v) => setMetric(v as Metric)}
        className="mt-4"
        variant="highlighted"
      >
        <TabsList className="h-6 w-fit gap-1 bg-transparent p-0">
          <TabsTrigger
            value="volume"
            className="rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
          >
            Volume
          </TabsTrigger>
          <TabsTrigger
            value="transfers"
            className="rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
          >
            Transfers
          </TabsTrigger>
        </TabsList>
        <TabsContent value={metric} className="mt-1.5 md:mt-4">
          {isLoading ? (
            <RowsSkeleton />
          ) : !metricData || displayItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-5">
              {displayItems.map((item) => (
                <FrameworkRowItem
                  key={item.entry.id}
                  entry={item.entry}
                  framework={item.framework}
                  metric={metric}
                  total={metricData.total}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FrameworkRowItem({
  entry,
  framework,
  metric,
  total,
}: {
  entry: FrameworkDominanceEntry
  framework: DisplayFramework
  metric: Metric
  total: number
}) {
  const value = metric === 'volume' ? entry.volume : entry.transferCount
  const previousValue =
    metric === 'volume' ? entry.previousVolume : entry.previousTransferCount
  const share = total > 0 ? (value / total) * 100 : 0
  const percentChange =
    previousValue !== null && previousValue > 0
      ? calculatePercentageChange(value, previousValue)
      : null

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <FrameworkHeader framework={framework} />
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-label-value-16">
            {metric === 'volume'
              ? formatCurrency(value, 'usd', { decimals: 2 })
              : formatInteger(value)}
          </span>
          {percentChange !== null && (
            <div className="flex items-center gap-1">
              <PercentChange
                className="font-medium text-label-value-16"
                value={percentChange}
              />
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="size-3" />
                </TooltipTrigger>
                <TooltipContent>
                  Percentage change compared to the previous 24 hours.
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(share, 100))}%`,
            backgroundColor: framework.color,
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label={metric === 'volume' ? 'Number of transfers' : 'Volume'}
          value={
            metric === 'volume'
              ? formatInteger(entry.transferCount)
              : formatCurrency(entry.volume, 'usd', { decimals: 2 })
          }
        />
        <Stat
          label="Avg. transfer time"
          value={
            entry.averageDurationSeconds !== null
              ? formatSeconds(entry.averageDurationSeconds)
              : '—'
          }
        />
        <Stat
          label="Avg. transfer size"
          value={
            entry.averageValue !== null
              ? formatCurrency(entry.averageValue, 'usd', { decimals: 2 })
              : '—'
          }
          align="right"
        />
      </div>
    </div>
  )
}

function FrameworkHeader({ framework }: { framework: DisplayFramework }) {
  const content = (
    <>
      {framework.iconUrl && (
        <img
          src={framework.iconUrl}
          alt={framework.name}
          className="size-6 rounded-full"
        />
      )}
      <div className="flex items-center gap-1">
        <span className="font-bold text-heading-16">{framework.label}</span>
        {framework.label !== framework.name && (
          <span className="font-medium text-label-value-16 text-secondary">
            {framework.name}
          </span>
        )}
      </div>
    </>
  )

  if (framework.slug) {
    return (
      <a
        href={`/interop/protocols/${framework.slug}`}
        className="-mx-2 inline-flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
      >
        {content}
      </a>
    )
  }
  return <div className="flex items-center gap-2">{content}</div>
}

function Stat({
  label,
  value,
  align,
}: {
  label: string
  value: string
  align?: 'right'
}) {
  return (
    <div
      className={cn('flex flex-col gap-0.5', align === 'right' && 'items-end')}
    >
      <span className="font-medium text-[13px] text-secondary leading-none">
        {label}
      </span>
      <span className="font-medium text-label-value-15">{value}</span>
    </div>
  )
}

function RowsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      No data for the selected chains.
    </div>
  )
}

function buildDisplayItems(
  entries: FrameworkDominanceEntry[],
  frameworksById: Map<string, InteropTokenFramework>,
): DisplayItem[] {
  if (entries.length <= 5) {
    return entries.flatMap((entry) => {
      const framework = frameworksById.get(entry.id)
      return framework ? [{ entry, framework }] : []
    })
  }

  const top4: DisplayItem[] = entries.slice(0, 4).flatMap((entry) => {
    const framework = frameworksById.get(entry.id)
    return framework ? [{ entry, framework }] : []
  })
  return [...top4, buildOthersItem(entries.slice(4))]
}

function buildOthersItem(entries: FrameworkDominanceEntry[]): DisplayItem {
  const volume = entries.reduce((sum, e) => sum + e.volume, 0)
  const transferCount = entries.reduce((sum, e) => sum + e.transferCount, 0)

  const previousVolume = entries.reduce(
    (sum, e) => sum + (e.previousVolume ?? 0),
    0,
  )
  const previousTransferCount = entries.reduce(
    (sum, e) => sum + (e.previousTransferCount ?? 0),
    0,
  )
  const durationWeightedSum = entries.reduce(
    (s, e) => s + (e.averageDurationSeconds ?? 0) * e.transferCount,
    0,
  )
  const averageDurationSeconds =
    transferCount > 0 ? Math.floor(durationWeightedSum / transferCount) : null

  const averageValue = transferCount > 0 ? volume / transferCount : null

  return {
    entry: {
      id: '__others__',
      volume,
      transferCount,
      previousVolume,
      previousTransferCount,
      averageDurationSeconds,
      averageValue,
    },
    framework: {
      label: 'Others',
      name: 'Others',
      color: '#E9BB00',
    },
  }
}
