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
        d="M6.94495 7.99998L2.10126 12.8437L3.72761 14.47L8.5713 9.62633L13.415 14.47L15.0413 12.8437L10.1976 7.99998L15.0413 3.15631L13.415 1.52997L8.5713 6.37364L3.72761 1.52995L2.10126 3.15629L6.94495 7.99998Z"
      />
    </SvgIcon>
  )
}
