import { type ReactNode, useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HeadToHeadRow } from './HeadToHeadRow'
import {
  type EntitySelectOption,
  InteropEntitySelect,
} from './InteropEntitySelect'
import type { ComparisonSide } from './types'

interface CompareRow {
  label: string
  leftValue: number | null
  rightValue: number | null
  format: (value: number) => string
  lowerIsBetter?: boolean
}

export function InteropCompareContent({
  title,
  description,
  options,
  isLoading,
  getComparison,
}: {
  title: string
  description: string
  options: EntitySelectOption[]
  isLoading: boolean
  getComparison: (
    leftId: string | undefined,
    rightId: string | undefined,
  ) => {
    leftSide: ComparisonSide | undefined
    rightSide: ComparisonSide | undefined
    rows: CompareRow[]
    extra?: ReactNode
  }
}) {
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()

  const { leftSide, rightSide, rows, extra } = getComparison(leftId, rightId)
  const showSkeleton = isLoading && (!!leftId || !!rightId)

  return (
    <div>
      <h2 className="font-bold text-heading-18 md:text-heading-20">{title}</h2>
      <p className="mt-1 font-medium text-secondary text-xs leading-[1.2]">
        {description}
      </p>
      <HorizontalSeparator className="my-6" />
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-5">
        <InteropEntitySelect
          options={options}
          value={leftId}
          onChange={setLeftId}
          excludeId={rightId}
        />
        <span className="text-center font-semibold text-base text-secondary sm:text-left">
          vs.
        </span>
        <InteropEntitySelect
          options={options}
          value={rightId}
          onChange={setRightId}
          excludeId={leftId}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {rows.map((row) => (
          <HeadToHeadRow
            key={row.label}
            label={row.label}
            left={leftSide}
            right={rightSide}
            leftValue={row.leftValue}
            rightValue={row.rightValue}
            format={row.format}
            lowerIsBetter={row.lowerIsBetter}
            isLoading={showSkeleton}
          />
        ))}
        {extra}
      </div>
    </div>
  )
}
