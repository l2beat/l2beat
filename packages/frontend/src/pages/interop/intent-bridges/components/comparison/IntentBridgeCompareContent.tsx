import { formatSeconds } from '@l2beat/shared-pure'
import type { IntentBridgesData } from '~/server/features/layer2s/interop/getIntentBridgesData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropCompareContent } from '../../../components/comparison/InteropCompareContent'
import type { EntitySelectOption } from '../../../components/comparison/InteropEntitySelect'
import type { ComparisonSide } from '../../../components/comparison/types'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import {
  buildIntentBridgeRows,
  type IntentBridgeRow,
} from '../../utils/buildIntentBridgeRows'
import { IntentAttributeRow } from './IntentAttributeRow'

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
  const rows = data ? buildIntentBridgeRows(intentBridges, data) : []
  const options: EntitySelectOption[] = intentBridges.map((bridge) => ({
    id: bridge.id,
    iconUrl: bridge.iconUrl,
    label: bridge.name,
  }))

  const getSide = (id: string | undefined): Side | undefined => {
    const row = rows.find((item) => item.bridge.id === id)
    return row?.activity ? { ...row, activity: row.activity } : undefined
  }

  return (
    <InteropCompareContent
      title="Intent Bridges Head-to-Head"
      description="Select two intent bridges and compare usage plus execution properties."
      options={options}
      isLoading={isLoading}
      getComparison={(leftId, rightId) => {
        const left = getSide(leftId)
        const right = getSide(rightId)
        return {
          leftSide: toComparisonSide(left),
          rightSide: toComparisonSide(right),
          rows: [
            {
              label: 'Volume',
              leftValue: left?.activity.volume ?? null,
              rightValue: right?.activity.volume ?? null,
              format: (value) => formatCurrency(value, 'usd'),
            },
            {
              label: 'Transfers',
              leftValue: left?.activity.transferCount ?? null,
              rightValue: right?.activity.transferCount ?? null,
              format: formatInteger,
            },
            {
              label: 'Avg. transfer time',
              leftValue: left?.activity.averageDurationSeconds ?? null,
              rightValue: right?.activity.averageDurationSeconds ?? null,
              format: formatSeconds,
              lowerIsBetter: true,
            },
            {
              label: 'Avg. transfer size',
              leftValue: left?.activity.averageValue ?? null,
              rightValue: right?.activity.averageValue ?? null,
              format: (value) => formatCurrency(value, 'usd'),
            },
            {
              label: 'Active chains',
              leftValue: left?.activeChainCount ?? null,
              rightValue: right?.activeChainCount ?? null,
              format: formatInteger,
            },
            {
              label: 'Active tokens',
              leftValue: left?.activeTokenCount ?? null,
              rightValue: right?.activeTokenCount ?? null,
              format: formatInteger,
            },
          ],
          extra: (
            <>
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
            </>
          ),
        }
      }}
    />
  )
}

function toComparisonSide(side: Side | undefined): ComparisonSide | undefined {
  return side
    ? { label: side.bridge.name, color: side.bridge.color }
    : undefined
}
