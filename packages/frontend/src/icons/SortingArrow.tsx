import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SortingArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="10" height="6" viewBox="0 0 10 6" {...props}>
      <path d="M5 .5a.55.55 0 00-.383.154l-4.333 4.2a.51.51 0 00-.118.572.54.54 0 00.5.324h8.667a.54.54 0 00.5-.324.51.51 0 00-.117-.572L5.383.654A.55.55 0 005 .5" />
    </SvgIcon>
  )
}
