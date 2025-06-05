import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'

export function FilterIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn('fill-icon-secondary', className)}
      {...props}
    >
      <path d="M13.7778 1H2.22222C1.82283 1 1.5 1.32356 1.5 1.72222V3.16667C1.5 3.33928 1.56139 3.50611 1.67406 3.63683L5.83333 8.48944V12.5556C5.83333 12.8293 5.98789 13.0792 6.23272 13.2019L9.12161 14.6464C9.22344 14.6969 9.33394 14.7222 9.44444 14.7222C9.57661 14.7222 9.70806 14.6861 9.82361 14.6146C10.0367 14.4824 10.1667 14.2506 10.1667 14V8.48944L14.3259 3.63683C14.4386 3.50611 14.5 3.33928 14.5 3.16667V1.72222C14.5 1.32356 14.1772 1 13.7778 1Z" />
    </svg>
  )
}
