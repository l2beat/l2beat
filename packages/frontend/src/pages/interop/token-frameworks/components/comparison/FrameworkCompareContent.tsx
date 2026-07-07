import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { TokenFrameworksData } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { HeadToHeadRow } from '../../../components/comparison/HeadToHeadRow'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { FrameworkSelect } from './FrameworkSelect'
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
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()

  const getSide = (id: string | undefined): Side | undefined => {
    const framework = tokenFrameworks.find((f) => f.id === id)
    const entry = frameworkDominance?.volume.entries.find((e) => e.id === id)
    return framework && entry ? { framework, entry } : undefined
  }

  const getTokenCount = (id: string | undefined): number | null => {
    if (!id) return null
    return frameworkTable?.find((e) => e.id === id)?.tokens.length ?? null
  }

  const left = getSide(leftId)
  const right = getSide(rightId)
  const leftSide = toComparisonSide(left)
  const rightSide = toComparisonSide(right)
  const showSkeleton = isLoading && (!!leftId || !!rightId)

  return (
    <div>
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Frameworks Head-to-Head
      </h2>
      <p className="mt-1 font-medium text-secondary text-xs leading-[1.2]">
        Select two frameworks & view head-to-head comparison
      </p>
      <HorizontalSeparator className="my-6" />
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-5">
        <FrameworkSelect
          frameworks={tokenFrameworks}
          value={leftId}
          onChange={setLeftId}
          excludeId={rightId}
        />
        <span className="text-center font-semibold text-base text-secondary sm:text-left">
          vs.
        </span>
        <FrameworkSelect
          frameworks={tokenFrameworks}
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
          format={(v) => formatCurrency(v, 'usd')}
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
          label="Tokens"
          left={leftSide}
          right={rightSide}
          leftValue={getTokenCount(leftId)}
          rightValue={getTokenCount(rightId)}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <HeadToHeadRow
          label="Avg. transfer time"
          left={leftSide}
          right={rightSide}
          leftValue={left?.entry.averageDurationSeconds ?? null}
          rightValue={right?.entry.averageDurationSeconds ?? null}
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
          format={(v) => formatCurrency(v, 'usd')}
          isLoading={showSkeleton}
        />
      </div>
    </div>
  )
}
