import React from 'react'

import { cn } from '../../utils/cn'

interface TooltipProviderProps {
  withAnimation?: boolean
}

export function TooltipProvider({
  withAnimation = true,
}: TooltipProviderProps) {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-110 hidden max-w-[300px] rounded-md bg-white px-4 py-3 text-left text-sm leading-tight text-gray-700   dark:bg-neutral-700 dark:text-white',
        withAnimation && 'animate-quick-fade-in',
      )}
      data-role="tooltip-popup"
      data-testid="tooltip"
    >
      <span className="whitespace-pre-line" />
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        className="fixed left-0 top-0 -z-1 h-2 w-4 fill-white stroke-1 dark:fill-neutral-700"
        data-role="tooltip-popup-triangle"
      >
        <path d="M0 8L8 1L16 8" />
      </svg>
    </div>
  )
}
