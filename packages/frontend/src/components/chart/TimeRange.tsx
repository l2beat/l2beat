import React from 'react'

import { cn } from '../../utils/cn'

export function TimeRange({ isMetaChart }: { isMetaChart: boolean }) {
  return (
    <p
      data-role="chart-range"
      className={cn(
        'flex h-8 max-w-[130px] items-center font-bold transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 sm:max-w-full',
        isMetaChart && 'absolute bottom-4 left-4 z-[1000] text-lg',
      )}
    >
      ...
    </p>
  )
}
