import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import type {
  IntentBridgeDominanceEntry,
  IntentBridgesData,
} from '~/server/features/scaling/interop/getIntentBridgesData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'

export function IntentBridgeCompareContent({
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
          left={left?.bridge.userRecovery}
          right={right?.bridge.userRecovery}
        />
        <CompareTextRow
          label="Solver access"
          left={left?.bridge.solverAccess}
          right={right?.bridge.solverAccess}
        />
        <CompareTextRow
          label="Intent model"
          left={left?.bridge.intentModel}
          right={right?.bridge.intentModel}
        />
        <CompareTextRow
          label="Settlement"
          left={left?.bridge.settlement}
          right={right?.bridge.settlement}
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
  left: { value: string; sentiment?: 'bad' } | undefined
  right: { value: string; sentiment?: 'bad' } | undefined
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] items-center gap-3">
      <CompareValue sentiment={left?.sentiment}>
        {left?.value ?? '—'}
      </CompareValue>
      <span className="text-center font-medium text-label-value-13 text-secondary">
        {label}
      </span>
      <CompareValue sentiment={right?.sentiment} alignRight>
        {right?.value ?? '—'}
      </CompareValue>
    </div>
  )
}

function CompareValue({
  active,
  alignRight,
  sentiment,
  children,
}: {
  active?: boolean
  alignRight?: boolean
  sentiment?: 'bad'
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'min-w-0 rounded bg-surface-secondary px-2 py-1 font-bold text-label-value-14',
        sentiment === 'bad'
          ? 'bg-negative/10 text-negative dark:bg-negative/20'
          : active && 'text-brand',
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
