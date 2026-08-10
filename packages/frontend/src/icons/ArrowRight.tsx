import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArrowRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 15 14" width="15" height="14" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.103 6.294c-.363 0-.658.314-.658.7 0 .387.295.7.658.7H11.7l-3.425 3.64a.73.73 0 000 .99.63.63 0 00.931 0l4.55-4.835a.73.73 0 000-.99l-4.55-4.835a.63.63 0 00-.931 0 .73.73 0 000 .99l3.425 3.64z"
      />
    </SvgIcon>
  )
}
