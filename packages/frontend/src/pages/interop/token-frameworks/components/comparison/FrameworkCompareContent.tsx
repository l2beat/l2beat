import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { TokenFrameworksData } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { CompareRow } from './CompareRow'
import { FrameworkSelect } from './FrameworkSelect'
import type { Side } from './types'

export function FrameworkCompareContent({
  tokenFrameworks,
  frameworkDominance,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  isLoading: boolean
}) {
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()

  const getSide = (id: string | undefined): Side | undefined => {
    const framework = tokenFrameworks.find((f) => f.id === id)
    const entry = frameworkDominance?.volume.entries.find((e) => e.id === id)
    return framework && entry ? { framework, entry } : undefined
  }

  const left = getSide(leftId)
  const right = getSide(rightId)
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
      <div className="flex items-center gap-5">
        <FrameworkSelect
          frameworks={tokenFrameworks}
          value={leftId}
          onChange={setLeftId}
          excludeId={rightId}
        />
        <span className="font-semibold text-base text-secondary">vs.</span>
        <FrameworkSelect
          frameworks={tokenFrameworks}
          value={rightId}
          onChange={setRightId}
          excludeId={leftId}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <CompareRow
          label="Volume"
          left={left}
          right={right}
          leftValue={left?.entry.volume ?? null}
          rightValue={right?.entry.volume ?? null}
          format={(v) => formatCurrency(v, 'usd')}
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Transfers"
          left={left}
          right={right}
          leftValue={left?.entry.transferCount ?? null}
          rightValue={right?.entry.transferCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Avg. transfer time"
          left={left}
          right={right}
          leftValue={left?.entry.averageDurationSeconds ?? null}
          rightValue={right?.entry.averageDurationSeconds ?? null}
          format={formatSeconds}
          lowerIsBetter
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Avg. transfer size"
          left={left}
          right={right}
          leftValue={left?.entry.averageValue ?? null}
          rightValue={right?.entry.averageValue ?? null}
          format={(v) => formatCurrency(v, 'usd')}
          isLoading={showSkeleton}
        />
      </div>
    </div>
  )
}
