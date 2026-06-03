import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MissingIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      aria-label="Missing icon"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="#FF0000"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m6.945 8-4.844 4.844 1.627 1.626L8.57 9.626l4.844 4.844 1.626-1.626L10.198 8l4.843-4.844-1.626-1.626-4.844 4.844L3.728 1.53 2.1 3.156z"
      />
    </SvgIcon>
  )
}
