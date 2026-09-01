import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function CartesiIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 128 128"
      fill="none"
      aria-label="Cartesi icon"
      className={cn('fill-[#0090A8] dark:fill-[#00F6FF]', className)}
      {...props}
    >
      <path d="M45.286 88.138 61.186 127l35.38-36.188H69.739l-7.163-20.365z" />
      <path d="M88.27 44.184 67.983 64.916l6.652 18.9H128l-13.926-39.632z" />
      <path d="m0 44.184 13.926 39.632H39.73L59.98 63.12l-6.653-18.937z" />
      <path d="m66.814 1-35.38 36.188H58.26l7.164 20.365L82.714 39.9z" />
    </SvgIcon>
  )
}
