import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function FilledArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="20" height="20" viewBox="0 0 20 20" {...props}>
      <path d="m19 10-9 5v-4.134H1V9.134h9V5z" />
    </SvgIcon>
  )
}
