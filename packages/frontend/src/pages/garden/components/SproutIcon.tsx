import { cn } from '~/utils/cn'

/** Shared with the badge HTML in integrate/badge.ts, so the two sprouts are one drawing. */
export const SPROUT_PATHS = {
  stem: 'M8 15 V7.5',
  leftLeaf: 'M8 8.4 C4.9 8.4 2.6 6.3 2.2 3.2 C5.6 2.9 8 5.1 8 8.4 Z',
  rightLeaf: 'M8 8.4 C11.1 8.4 13.4 6.3 13.8 3.2 C10.4 2.9 8 5.1 8 8.4 Z',
}

export function SproutIcon({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path
        d={SPROUT_PATHS.stem}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d={SPROUT_PATHS.leftLeaf} fill="currentColor" />
      <path d={SPROUT_PATHS.rightLeaf} fill="currentColor" opacity=".75" />
    </svg>
  )
}
