import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function FilledArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="20" height="20" viewBox="0 0 20 20" {...props}>
      <path d="M19 10L10 15V10.866H1V9.13396H10V5L19 10Z" />
    </SvgIcon>
  )
}
