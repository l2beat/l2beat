import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MaximizeIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 4.5h7.5V12h-2V7.914L7.914 17.5H12v2H4.5V12h2v4.086L16.086 6.5H12z"
      />
    </SvgIcon>
  )
}
