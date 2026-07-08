import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { IntentBridgesData } from '~/server/features/scaling/interop/getIntentBridgesData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { HeadToHeadRow } from '../../../components/comparison/HeadToHeadRow'
import type { ComparisonSide } from '../../../components/comparison/types'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import {
  buildIntentBridgeRows,
  type IntentBridgeRow,
} from '../../utils/buildIntentBridgeRows'
import { IntentAttributeRow } from './IntentAttributeRow'
import { IntentBridgeSelect } from './IntentBridgeSelect'

type Side = IntentBridgeRow & {
  activity: NonNullable<IntentBridgeRow['activity']>
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
  const rows = data ? buildIntentBridgeRows(intentBridges, data) : []

  const getSide = (id: string | undefined): Side | undefined => {
    const row = rows.find((item) => item.bridge.id === id)
    return row?.activity ? { ...row, activity: row.activity } : undefined
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
          leftValue={left?.activity.volume ?? null}
          rightValue={right?.activity.volume ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Transfers"
          left={leftSide}
          right={rightSide}
          leftValue={left?.activity.transferCount ?? null}
          rightValue={right?.activity.transferCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Avg. transfer time"
          left={leftSide}
          right={rightSide}
          leftValue={left?.activity.averageDurationSeconds ?? null}
          rightValue={right?.activity.averageDurationSeconds ?? null}
          format={formatSeconds}
          lowerIsBetter
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Avg. transfer size"
          left={leftSide}
          right={rightSide}
          leftValue={left?.activity.averageValue ?? null}
          rightValue={right?.activity.averageValue ?? null}
          format={(value) => formatCurrency(value, 'usd')}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Active chains"
          left={leftSide}
          right={rightSide}
          leftValue={left?.activeChainCount ?? null}
          rightValue={right?.activeChainCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Active tokens"
          left={leftSide}
          right={rightSide}
          leftValue={left?.activeTokenCount ?? null}
          rightValue={right?.activeTokenCount ?? null}
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
