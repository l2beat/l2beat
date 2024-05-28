'use client'
import { cn } from '~/utils/cn'

export function ChangeButton({ show }: { show?: () => void }) {
  return (
    <button
      className={cn(
        'w-16 h-5 flex items-center justify-center border border-[#A3A3A3]',
        'text-[#A3A3A3] text-2xs font-semibold rounded px-[8px] py-[4px] cursor-pointer uppercase',
      )}
      onClick={show}
    >
      Change
    </button>
  )
}
