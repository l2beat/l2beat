import { type Stage } from '@l2beat/config'

import { cn } from '~/utils/cn'

export interface StageBadgeProps {
  stage: Stage | 'UnderReview' | 'NotApplicable'
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const value =
    stage === 'UnderReview'
      ? 'Review'
      : stage === 'NotApplicable'
        ? undefined
        : stage

  return (
    <div
      className={cn(
        'leading-none! inline-flex h-[22px] w-[66px] items-center justify-center rounded-sm text-center text-xs font-medium uppercase',
        getClassNames(stage),
        className,
      )}
    >
      {value ?? 'n/a'}
    </div>
  )
}

function getClassNames(stage: Stage | 'UnderReview' | 'NotApplicable'): string {
  switch (stage) {
    case 'Stage 2':
      return 'bg-green-900 border border-[#179323] text-white'
    case 'Stage 1':
      return 'bg-[#FFC61B] border border-[#D9AA1E] text-yellow-900'
    case 'Stage 0':
      return 'bg-orange-600 border border-[#F98A24] dark:bg-[#E03109] dark:border-[#F25430] text-white'
    case 'UnderReview':
      return 'border border-current text-n-yellow-700 dark:text-yellow-200'
    case 'NotApplicable':
      return 'bg-[#B4C7D5] dark:bg-[#3D4361] border border-[#D1E1EC] dark:border-[#343955] text-zinc-800 dark:text-primary'
    default:
      return ''
  }
}
