import { formatSeconds } from '@l2beat/shared-pure'
import type { TokenFrameworksData } from '~/server/features/layer2s/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropCompareContent } from '../../../components/comparison/InteropCompareContent'
import type { EntitySelectOption } from '../../../components/comparison/InteropEntitySelect'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { type Side, toComparisonSide } from './types'

export function FrameworkCompareContent({
  tokenFrameworks,
  frameworkDominance,
  frameworkTable,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  frameworkTable: TokenFrameworksData['frameworkTable'] | undefined
  isLoading: boolean
}) {
  const options: EntitySelectOption[] = tokenFrameworks.map((framework) => ({
    id: framework.id,
    iconUrl: framework.iconUrl,
    label: framework.label,
    secondaryLabel: framework.name,
  }))

  const getSide = (id: string | undefined): Side | undefined => {
    const framework = tokenFrameworks.find((f) => f.id === id)
    const entry = frameworkDominance?.volume.entries.find((e) => e.id === id)
    return framework && entry ? { framework, entry } : undefined
  }

  const getTokenCount = (id: string | undefined): number | null => {
    if (!id) return null
    return frameworkTable?.find((e) => e.id === id)?.tokens.length ?? null
  }

  return (
    <InteropCompareContent
      title="Frameworks Head-to-Head"
      description="Select two frameworks & view head-to-head comparison"
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
              leftValue: left?.entry.volume ?? null,
              rightValue: right?.entry.volume ?? null,
              format: (value) => formatCurrency(value, 'usd'),
            },
            {
              label: 'Transfers',
              leftValue: left?.entry.transferCount ?? null,
              rightValue: right?.entry.transferCount ?? null,
              format: formatInteger,
            },
            {
              label: 'Tokens',
              leftValue: getTokenCount(leftId),
              rightValue: getTokenCount(rightId),
              format: formatInteger,
            },
            {
              label: 'Avg. transfer time',
              leftValue: left?.entry.averageDurationSeconds ?? null,
              rightValue: right?.entry.averageDurationSeconds ?? null,
              format: formatSeconds,
              lowerIsBetter: true,
            },
            {
              label: 'Avg. transfer size',
              leftValue: left?.entry.averageValue ?? null,
              rightValue: right?.entry.averageValue ?? null,
              format: (value) => formatCurrency(value, 'usd'),
            },
          ],
        }
      }}
    />
  )
}
