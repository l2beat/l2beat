import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SwapIcon(props: SvgIconProps) {
  return (
    <SvgIcon width={16} height={16} viewBox="0 0 16 16" {...props}>
      <path d="M15.113 11.258H3.26a.89.89 0 000 1.778h11.853a.89.89 0 000-1.778" />
      <path d="M.889 4.743h11.853a.89.89 0 000-1.778H.889a.89.89 0 000 1.778" />
      <path d="m11.52 9.814 2.334 2.335-2.334 2.335a.888.888 0 101.257 1.256l2.963-2.963a.89.89 0 000-1.256l-2.963-2.964a.888.888 0 10-1.257 1.257" />
      <path d="M4.48 6.187 2.146 3.852 4.48 1.517A.888.888 0 103.224.26L.26 3.224a.89.89 0 000 1.256l2.964 2.963A.888.888 0 104.48 6.187" />
    </SvgIcon>
  )
}
