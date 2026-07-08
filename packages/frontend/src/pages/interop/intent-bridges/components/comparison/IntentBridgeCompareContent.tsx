import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type {
  IntentBridgeActivityEntry,
  IntentBridgesData,
} from '~/server/features/scaling/interop/getIntentBridgesData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { HeadToHeadRow } from '../../../components/comparison/HeadToHeadRow'
import type { ComparisonSide } from '../../../components/comparison/types'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import { getDurationSeconds } from '../../utils/getDurationSeconds'
import {
  type ActiveCounts,
  getActiveCounts,
} from '../dominance/getActiveCounts'
import { IntentAttributeRow } from './IntentAttributeRow'
import { IntentBridgeSelect } from './IntentBridgeSelect'

type Side = {
  bridge: InteropIntentBridge
  entry: IntentBridgeActivityEntry
  counts: ActiveCounts | undefined
}

export function IntentBridgeCompareContent({
  intentBridges,
  data,
  isLoading,
}: {
  intentBridges: InteropIntentBridge[]
  data: IntentBridgesData | undefined
  isLoading: boolean
}) {
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()

  const getSide = (id: string | undefined): Side | undefined => {
    const bridge = intentBridges.find((item) => item.id === id)
    const entry = data?.activity.entries.find((item) => item.id === id)
    if (!bridge || !entry) return undefined
    const counts = data
      ? getActiveCounts(data.table.entries).get(bridge.id)
      : undefined
    return { bridge, entry, counts }
  }

  const left = getSide(leftId)
  const right = getSide(rightId)
  const leftSide = toComparisonSide(left)
  const rightSide = toComparisonSide(right)
  const showSkeleton = isLoading && (!!leftId || !!rightId)

  return (
    <div>
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Intent Bridges Head-to-Head
      </h2>
      <p className="mt-1 font-medium text-secondary text-xs leading-[1.2]">
        Select two intent bridges and compare usage plus execution properties.
      </p>
      <HorizontalSeparator className="my-6" />
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-5">
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

      <div className="mt-6 flex flex-col gap-5">
        <HeadToHeadRow
          label="Volume"
          left={leftSide}
          right={rightSide}
          leftValue={left?.entry.volume ?? null}
          rightValue={right?.entry.volume ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Transfers"
          left={leftSide}
          right={rightSide}
          leftValue={left?.entry.transferCount ?? null}
          rightValue={right?.entry.transferCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Avg. transfer time"
          left={leftSide}
          right={rightSide}
          leftValue={getDurationSeconds(left?.entry.averageDuration)}
          rightValue={getDurationSeconds(right?.entry.averageDuration)}
          format={formatSeconds}
          lowerIsBetter
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Avg. transfer size"
          left={leftSide}
          right={rightSide}
          leftValue={left?.entry.averageValue ?? null}
          rightValue={right?.entry.averageValue ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Active chains"
          left={leftSide}
          right={rightSide}
          leftValue={left?.counts?.chains ?? null}
          rightValue={right?.counts?.chains ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Active tokens"
          left={leftSide}
          right={rightSide}
          leftValue={left?.counts?.tokens ?? null}
          rightValue={right?.counts?.tokens ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <IntentAttributeRow
          label="User recovery"
          left={left?.bridge.userRecovery}
          right={right?.bridge.userRecovery}
        />
        <IntentAttributeRow
          label="Solver access"
          left={left?.bridge.solverAccess}
          right={right?.bridge.solverAccess}
        />
        <IntentAttributeRow
          label="Intent model"
          left={left?.bridge.intentModel}
          right={right?.bridge.intentModel}
        />
        <IntentAttributeRow
          label="Settlement"
          left={left?.bridge.settlement}
          right={right?.bridge.settlement}
        />
      </div>
    </div>
  )
}

function toComparisonSide(side: Side | undefined): ComparisonSide | undefined {
  return side
    ? { label: side.bridge.name, color: side.bridge.color }
    : undefined
}
