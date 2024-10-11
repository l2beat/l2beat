'use client'

import { cn } from '~/utils/cn'

export function ChangeButton({ show }: { show?: () => void }) {
  return (
    <button
      className={cn(
        'flex h-5 w-16 items-center justify-center border border-[#A3A3A3]',
        'cursor-pointer rounded px-[8px] py-[4px] text-2xs font-medium uppercase text-[#A3A3A3]',
      )}
      onClick={show}
    >
      Change
    </button>
  )
}
