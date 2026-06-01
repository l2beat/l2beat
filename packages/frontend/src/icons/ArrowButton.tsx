import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArrowButtonIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_9936_27892)">
        <path d="M34 34H-2V-2h36zM13.849 8.151A1.2 1.2 0 0012.15 9.85L18.303 16l-6.152 6.151-.082.091a1.2 1.2 0 001.689 1.689l.09-.082 6.902-6.902a1.34 1.34 0 000-1.894z" />
      </g>
      <defs>
        <clipPath id="clip0_9936_27892">
          <rect width="32" height="32" rx="4" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
