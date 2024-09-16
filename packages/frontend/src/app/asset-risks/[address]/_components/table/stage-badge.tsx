import { type Stage } from '@l2beat/config'
import React from 'react'
import { cn } from '~/utils/cn'

export interface StageBadgeProps {
  stage: 'Validium' | 'Optimium' | 'NotApplicable' | 'UnderReview' | Stage
}

export function StageBadge({ stage }: StageBadgeProps) {
  const value =
    stage === 'UnderReview'
      ? 'In review'
      : stage === 'NotApplicable'
        ? undefined
        : stage
  return (
    <span
      className={cn(
        getColorClassName(stage),
        'inline-block h-4 rounded px-1 py-px text-center text-2xs font-medium uppercase !leading-none',
      )}
    >
      <span className="relative top-[0.5px]">{value ?? 'n/a'}</span>
    </span>
  )
}

function getColorClassName(
  stage: 'Validium' | 'Optimium' | 'NotApplicable' | 'UnderReview' | Stage,
): string {
  switch (stage) {
    case 'Stage 2':
      return 'bg-green-800 text-white'
    case 'Stage 1':
      return 'bg-[#FFC61B] text-[#684E00] border border-[#D9AA1E]'
    case 'Stage 0':
      return 'bg-orange-600 text-white border border-[#F98A24]'
    case 'UnderReview':
      return 'bg-zinc-700 text-yellow-200'
    case 'NotApplicable':
    case 'Optimium':
    case 'Validium':
      return 'bg-[#B4C7D5] text-black border border-[#D1E1EC]'
    default:
      return ''
  }
}
