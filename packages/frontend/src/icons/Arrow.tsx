import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="12" height="7" viewBox="0 0 12 7" {...props}>
      <path d="m6 2.414 3.566 3.565a.99.99 0 001.4-1.4L6.66.274a.93.93 0 00-1.32 0L1.036 4.579a.99.99 0 001.4 1.4z" />
    </SvgIcon>
  )
}
