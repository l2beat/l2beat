import type { Stage } from '@l2beat/config'

import { cn } from '~/utils/cn'

interface StageBadgeProps {
  stage: Stage | 'UnderReview' | 'NotApplicable'
  isAppchain: boolean
  inline?: boolean
  className?: string
  appchainClassName?: string
}

export function StageBadge({
  stage,
  isAppchain,
  inline,
  className,
  appchainClassName,
}: StageBadgeProps) {
  const value =
    stage === 'UnderReview'
      ? 'Review'
      : stage === 'NotApplicable'
        ? undefined
        : stage

  return (
    <div className={cn(inline && 'flex items-center gap-1.5', className)}>
      <div
        className={cn(
          'inline-flex h-[18px] w-[60px] items-center justify-center rounded text-center font-medium text-[13px] uppercase leading-none! md:h-[22px] md:w-[66px] md:text-xs',
          getClassNames(stage),
        )}
      >
        {value ?? 'n/a'}
      </div>
      {isAppchain && (
        <div
          className={cn(
            'text-center font-medium text-[11px] leading-none! md:text-2xs',
            getStageTextClassname(stage),
            inline && 'text-xs',
            appchainClassName,
          )}
        >
          Appchain
        </div>
      )}
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

export function getStageTextClassname(
  stage: Stage | 'UnderReview' | 'NotApplicable',
): string {
  switch (stage) {
    case 'Stage 2':
      return 'text-positive'
    case 'Stage 1':
      return 'text-warning'
    case 'Stage 0':
      return 'text-negative'
    case 'UnderReview':
      return 'text-n-yellow-700 dark:text-yellow-200'
    default:
      return 'text-secondary'
  }
}
