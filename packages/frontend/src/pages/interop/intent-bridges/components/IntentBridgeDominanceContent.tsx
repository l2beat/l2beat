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
import { Last24HoursBadge } from '~/pages/interop/components/Last24HoursBadge'
import type {
  IntentBridgeDominanceEntry,
  IntentBridgesData,
} from '~/server/features/scaling/interop/getIntentBridgesData'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'

type Metric = 'volume' | 'transfers'

export function IntentBridgeDominanceContent({
  intentBridges,
  bridgeDominance,
  isLoading,
}: {
  intentBridges: InteropIntentBridge[]
  bridgeDominance: IntentBridgesData['bridgeDominance'] | undefined
  isLoading: boolean
}) {
  const [metric, setMetric] = useState<Metric>('volume')

  const metricData = bridgeDominance
    ? metric === 'volume'
      ? bridgeDominance.volume
      : bridgeDominance.transfers
    : undefined

  const bridgesById = new Map(
    intentBridges.map((bridge) => [bridge.id, bridge]),
  )
  const displayItems = metricData
    ? metricData.entries
        .map((entry) => {
          const bridge = bridgesById.get(entry.id)
          return bridge ? { entry, bridge } : undefined
        })
        .filter((item) => item !== undefined)
    : []

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-18 md:text-heading-20">
          Intent Bridge Dominance by{' '}
          {metric === 'volume' ? 'Volume' : 'Transfers'}
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name="intentBridgeDominanceMetric"
        value={metric}
        onValueChange={(value) => setMetric(value as Metric)}
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
              {displayItems.map(({ entry, bridge }) => (
                <IntentBridgeRowItem
                  key={entry.id}
                  entry={entry}
                  bridge={bridge}
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

function IntentBridgeRowItem({
  entry,
  bridge,
  metric,
  total,
}: {
  entry: IntentBridgeDominanceEntry
  bridge: InteropIntentBridge
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
        <BridgeHeader bridge={bridge} />
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
            backgroundColor: bridge.color,
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label={metric === 'volume' ? 'Transfers' : 'Volume'}
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
          label="Active chains / tokens"
          value={`${formatInteger(entry.activeChainCount)} / ${formatInteger(
            entry.activeTokenCount,
          )}`}
          align="right"
        />
      </div>
    </div>
  )
}

function BridgeHeader({ bridge }: { bridge: InteropIntentBridge }) {
  return (
    <a
      href={`/interop/protocols/${bridge.slug}`}
      className="-mx-2 inline-flex min-w-0 items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
    >
      <img
        src={bridge.iconUrl}
        alt={bridge.name}
        className="size-6 shrink-0 rounded-full"
      />
      <span className="min-w-0 truncate font-bold text-heading-16">
        {bridge.name}
      </span>
    </a>
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

function EmptyState() {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      No intent bridge activity found.
    </div>
  )
}
