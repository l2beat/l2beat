import { formatSeconds } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
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
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { Last24HoursBadge } from '~/pages/interop/token-frameworks/components/Last24HoursBadge'
import type {
  IntentBridgeDominanceEntry,
  IntentBridgesData,
} from '~/server/features/scaling/interop/getIntentBridgesData'
import { useTRPC } from '~/trpc/React'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'

type Metric = 'volume' | 'transfers'

export function IntentBridgeDominanceWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <PrimaryCard className="border-divider max-md:border-b md:col-span-2 lg:row-span-10">
      <Tabs
        name="intentBridgesMode"
        defaultValue="dominance"
        variant="highlighted"
      >
        <TabsList className="w-full">
          <TabsTrigger value="dominance">Intent bridge dominance</TabsTrigger>
          <TabsTrigger value="compare">Compare mode</TabsTrigger>
        </TabsList>
        <TabsContent value="dominance" className="mt-2">
          <IntentBridgeDominanceContent
            intentBridges={intentBridges}
            bridgeDominance={data?.bridgeDominance}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="compare" className="mt-2">
          <IntentBridgeCompareContent
            intentBridges={intentBridges}
            bridgeDominance={data?.bridgeDominance}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}

function IntentBridgeDominanceContent({
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

function IntentBridgeCompareContent({
  intentBridges,
  bridgeDominance,
  isLoading,
}: {
  intentBridges: InteropIntentBridge[]
  bridgeDominance: IntentBridgesData['bridgeDominance'] | undefined
  isLoading: boolean
}) {
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()
  const entriesById = new Map(
    bridgeDominance?.volume.entries.map((entry) => [entry.id, entry]) ?? [],
  )

  const left = getCompareSide(intentBridges, entriesById, leftId)
  const right = getCompareSide(intentBridges, entriesById, rightId)
  const showSkeleton = isLoading && (!!leftId || !!rightId)

  return (
    <div>
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Intent Bridges Head-to-Head
      </h2>
      <p className="mt-1 font-medium text-secondary text-xs leading-[1.2]">
        Select two intent bridges and compare usage plus execution properties.
      </p>
      <div className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-5">
        <IntentBridgeSelect
          bridges={intentBridges}
          value={leftId}
          onChange={setLeftId}
          excludeId={rightId}
        />
        <span className="text-center font-semibold text-base text-secondary sm:text-left">
          vs.
        </span>
        <IntentBridgeSelect
          bridges={intentBridges}
          value={rightId}
          onChange={setRightId}
          excludeId={leftId}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CompareMetricRow
          label="Volume"
          left={left?.entry.volume ?? null}
          right={right?.entry.volume ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <CompareMetricRow
          label="Transfers"
          left={left?.entry.transferCount ?? null}
          right={right?.entry.transferCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <CompareMetricRow
          label="Avg. transfer time"
          left={left?.entry.averageDurationSeconds ?? null}
          right={right?.entry.averageDurationSeconds ?? null}
          format={formatSeconds}
          lowerIsBetter
          isLoading={showSkeleton}
        />
        <CompareMetricRow
          label="Avg. transfer size"
          left={left?.entry.averageValue ?? null}
          right={right?.entry.averageValue ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <CompareMetricRow
          label="Active chains"
          left={left?.entry.activeChainCount ?? null}
          right={right?.entry.activeChainCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <CompareMetricRow
          label="Active tokens"
          left={left?.entry.activeTokenCount ?? null}
          right={right?.entry.activeTokenCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <CompareTextRow
          label="User recovery"
          left={left?.bridge.userRecovery.value}
          right={right?.bridge.userRecovery.value}
        />
        <CompareTextRow
          label="Solver access"
          left={left?.bridge.solverAccess.value}
          right={right?.bridge.solverAccess.value}
        />
        <CompareTextRow
          label="Intent model"
          left={left?.bridge.intentModel.value}
          right={right?.bridge.intentModel.value}
        />
      </div>
    </div>
  )
}

function IntentBridgeSelect({
  bridges,
  value,
  onChange,
  excludeId,
}: {
  bridges: InteropIntentBridge[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
}) {
  const selected = bridges.find((bridge) => bridge.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex h-10 min-w-0 flex-1 items-center border border-divider bg-surface-primary">
        <SelectValue placeholder="Select project">
          {selected && <BridgeLabel bridge={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {bridges.map((bridge) => (
          <SelectItem
            key={bridge.id}
            value={bridge.id}
            disabled={bridge.id === excludeId}
          >
            <BridgeLabel bridge={bridge} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function BridgeLabel({ bridge }: { bridge: InteropIntentBridge }) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <img
        src={bridge.iconUrl}
        alt={bridge.name}
        className="size-5 shrink-0 rounded-full"
      />
      <span className="min-w-0 truncate font-bold">{bridge.name}</span>
    </span>
  )
}

function CompareMetricRow({
  label,
  left,
  right,
  format,
  lowerIsBetter,
  isLoading,
}: {
  label: string
  left: number | null
  right: number | null
  format: (value: number) => string
  lowerIsBetter?: boolean
  isLoading: boolean
}) {
  if (isLoading) return <Skeleton className="h-8 w-full" />

  const leftWins =
    left !== null &&
    right !== null &&
    (lowerIsBetter ? left < right : left > right)
  const rightWins =
    left !== null &&
    right !== null &&
    (lowerIsBetter ? right < left : right > left)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] items-center gap-3">
      <CompareValue active={leftWins}>
        {left !== null ? format(left) : '—'}
      </CompareValue>
      <span className="text-center font-medium text-label-value-13 text-secondary">
        {label}
      </span>
      <CompareValue active={rightWins} alignRight>
        {right !== null ? format(right) : '—'}
      </CompareValue>
    </div>
  )
}

function CompareTextRow({
  label,
  left,
  right,
}: {
  label: string
  left: string | undefined
  right: string | undefined
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] items-center gap-3">
      <CompareValue>{left ?? '—'}</CompareValue>
      <span className="text-center font-medium text-label-value-13 text-secondary">
        {label}
      </span>
      <CompareValue alignRight>{right ?? '—'}</CompareValue>
    </div>
  )
}

function CompareValue({
  active,
  alignRight,
  children,
}: {
  active?: boolean
  alignRight?: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'min-w-0 rounded bg-surface-secondary px-2 py-1 font-bold text-label-value-14',
        active && 'text-brand',
        alignRight && 'text-right',
      )}
    >
      {children}
    </span>
  )
}

function getCompareSide(
  bridges: InteropIntentBridge[],
  entriesById: Map<string, IntentBridgeDominanceEntry>,
  id: string | undefined,
) {
  if (!id) return undefined
  const bridge = bridges.find((item) => item.id === id)
  const entry = entriesById.get(id)
  return bridge && entry ? { bridge, entry } : undefined
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
