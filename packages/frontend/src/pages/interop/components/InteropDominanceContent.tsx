import { formatSeconds } from '@l2beat/shared-pure'
import { type ReactNode, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PercentChange } from '~/components/PercentChange'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { Last24HoursBadge } from './Last24HoursBadge'

export type DominanceMetric = 'volume' | 'transfers'

export interface DominanceRow {
  id: string
  color: string
  volume: number
  transferCount: number
  previousVolume: number | null
  previousTransferCount: number | null
  averageDurationSeconds: number | null
  header: ReactNode
  thirdStat: { label: string; value: string }
}

export function InteropDominanceContent({
  title,
  tabsName,
  transfersStatLabel,
  emptyState,
  isLoading,
  changePeriod,
  getMetricData,
  className,
  tabsClassName,
  tabsContentClassName,
  scrollClassName,
}: {
  title: string
  tabsName: string
  transfersStatLabel: string
  emptyState: string
  isLoading: boolean
  changePeriod: PercentageChangePeriod | undefined
  getMetricData: (metric: DominanceMetric) => {
    total: number
    rows: DominanceRow[]
  }
  className?: string
  tabsClassName?: string
  tabsContentClassName?: string
  scrollClassName?: string
}) {
  const [metric, setMetric] = useState<DominanceMetric>('volume')
  const { total, rows } = getMetricData(metric)

  return (
    <div className={className}>
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-18 md:text-heading-20">
          {title} {metric === 'volume' ? 'Volume' : 'Transfers'}
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name={tabsName}
        value={metric}
        onValueChange={(value) => setMetric(value as DominanceMetric)}
        className={cn('mt-4', tabsClassName)}
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
        <TabsContent
          value={metric}
          className={cn('mt-1.5 md:mt-4', tabsContentClassName)}
        >
          {isLoading ? (
            <RowsSkeleton />
          ) : rows.length === 0 ? (
            <EmptyState message={emptyState} />
          ) : scrollClassName ? (
            <ScrollWithGradient
              className={cn('flex flex-col gap-5', scrollClassName)}
            >
              {rows.map((row) => (
                <DominanceRowItem
                  key={row.id}
                  row={row}
                  metric={metric}
                  total={total}
                  transfersStatLabel={transfersStatLabel}
                  changePeriod={changePeriod}
                />
              ))}
            </ScrollWithGradient>
          ) : (
            <div className="flex flex-col gap-5">
              {rows.map((row) => (
                <DominanceRowItem
                  key={row.id}
                  row={row}
                  metric={metric}
                  total={total}
                  transfersStatLabel={transfersStatLabel}
                  changePeriod={changePeriod}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DominanceRowItem({
  row,
  metric,
  total,
  transfersStatLabel,
  changePeriod,
}: {
  row: DominanceRow
  metric: DominanceMetric
  total: number
  transfersStatLabel: string
  changePeriod: PercentageChangePeriod | undefined
}) {
  const value = metric === 'volume' ? row.volume : row.transferCount
  const previousValue =
    metric === 'volume' ? row.previousVolume : row.previousTransferCount
  const share = total > 0 ? (value / total) * 100 : 0
  const percentChange =
    previousValue !== null && previousValue > 0
      ? calculatePercentageChange(value, previousValue)
      : null

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        {row.header}
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-label-value-16">
            {metric === 'volume'
              ? formatCurrency(value, 'usd', { decimals: 2 })
              : formatInteger(value)}
          </span>
          {percentChange !== null && changePeriod !== undefined && (
            <PercentChange
              className="font-medium text-label-value-16"
              value={percentChange}
              period={changePeriod}
            />
          )}
        </div>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(share, 100))}%`,
            backgroundColor: row.color,
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label={metric === 'volume' ? transfersStatLabel : 'Volume'}
          value={
            metric === 'volume'
              ? formatInteger(row.transferCount)
              : formatCurrency(row.volume, 'usd', { decimals: 2 })
          }
        />
        <Stat
          label="Avg. transfer time"
          value={
            row.averageDurationSeconds !== null
              ? formatSeconds(row.averageDurationSeconds)
              : '—'
          }
        />
        <Stat
          label={row.thirdStat.label}
          value={row.thirdStat.value}
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
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      {message}
    </div>
  )
}
