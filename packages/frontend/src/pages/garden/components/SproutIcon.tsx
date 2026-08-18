import { cn } from '~/utils/cn'

/** A two-leaf sprout, used on the submission calls to action. */
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
        d="M8 15 V7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 8.4 C4.9 8.4 2.6 6.3 2.2 3.2 C5.6 2.9 8 5.1 8 8.4 Z"
        fill="currentColor"
      />
      <path
        d="M8 8.4 C11.1 8.4 13.4 6.3 13.8 3.2 C10.4 2.9 8 5.1 8 8.4 Z"
        fill="currentColor"
        opacity=".75"
      />
    </svg>
  )
}
