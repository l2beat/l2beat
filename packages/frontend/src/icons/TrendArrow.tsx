import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'

export function TrendArrowIcon(props: SvgIconProps) {
  return (
    <svg width="10" height="5" viewBox="0 0 10 5" {...props}>
      <path d="M4.856.15a.2.2 0 01.288 0l3.86 4.011a.2.2 0 01-.144.339H1.14a.2.2 0 01-.144-.339z" />
    </svg>
  )
}

export function TrendArrowUpIcon(props: SvgIconProps) {
  return (
    <TrendArrowIcon
      aria-label="Arrow up icon"
      alt-text="+"
      className={cn('inline-block fill-positive', props.className)}
    />
  )
}

export function TrendArrowDownIcon(props: SvgIconProps) {
  return (
    <TrendArrowIcon
      aria-label="Arrow down icon"
      alt-text="-"
      className={cn('inline-block rotate-180 fill-red-300', props.className)}
    />
  )
}
