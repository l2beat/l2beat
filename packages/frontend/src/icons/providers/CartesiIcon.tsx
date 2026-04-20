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
      <path d="M45.2861 88.1378L61.1856 127L96.5666 90.8116H69.7384L62.5745 70.4465L45.2861 88.1378Z" />
      <path d="M88.2694 44.1843L67.9839 64.9157L74.6361 83.8157H128L114.074 44.1843H88.2694Z" />
      <path d="M0 44.1843L13.9258 83.8157H39.7304L59.9794 63.1209L53.3272 44.1843H0Z" />
      <path d="M66.8143 1L31.4333 37.1884H58.2614L65.4254 57.5535L82.7138 39.8988L66.8143 1Z" />
    </SvgIcon>
  )
}
