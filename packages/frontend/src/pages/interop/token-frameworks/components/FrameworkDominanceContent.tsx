import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import type {
  FrameworkDominanceEntry,
  TokenFrameworksData,
} from '~/server/features/scaling/interop/getTokenFrameworksData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

type Metric = 'volume' | 'transfers'

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

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-20">
          Framework Dominance by {metric === 'volume' ? 'Volume' : 'Transfers'}
        </h2>
        <div className="rounded bg-n-blue-700 px-1.5 py-[3px] font-bold text-sm text-white leading-[1.15]">
          Last 24 hours
        </div>
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
        <TabsContent value={metric} className="mt-4">
          {isLoading ? (
            <RowsSkeleton />
          ) : !metricData || metricData.entries.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-5">
              {metricData.entries.map((entry) => {
                const framework = frameworksById.get(entry.id)
                if (!framework) return null
                return (
                  <FrameworkRowItem
                    key={entry.id}
                    entry={entry}
                    framework={framework}
                    metric={metric}
                    total={metricData.total}
                  />
                )
              })}
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
  framework: InteropTokenFramework
  metric: Metric
  total: number
}) {
  const value = metric === 'volume' ? entry.volume : entry.transferCount
  const share = total > 0 ? (value / total) * 100 : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={framework.iconUrl}
            alt={framework.name}
            className="size-6 rounded-full"
          />
          <span className="font-bold text-label-value-16">
            {framework.label}
          </span>
          {framework.label !== framework.name && (
            <span className="font-medium text-label-value-15 text-secondary">
              {framework.name}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-label-value-16">
            {metric === 'volume'
              ? formatCurrency(value, 'usd', { decimals: 2 })
              : formatInteger(value)}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
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
      <span className="font-medium text-2xs text-secondary">{label}</span>
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
