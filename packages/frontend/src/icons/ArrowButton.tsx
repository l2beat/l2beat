import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArrowButtonIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="32" height="32" viewBox="0 0 32 32" {...props}>
      <g clipPath="url(#clip0_9936_27892)">
        <path
          d="M34 34H-2V-2H34V34ZM13.8486 8.15137C13.38 7.68274 12.62 7.68274 12.1514 8.15137C11.6827 8.62 11.6827 9.38 12.1514 9.84863L18.3027 16L12.1514 22.1514L12.0693 22.2422C11.6846 22.7135 11.7119 23.4092 12.1514 23.8486C12.5908 24.2881 13.2865 24.3154 13.7578 23.9307L13.8486 23.8486L20.75 16.9473C21.2728 16.4241 21.2728 15.5759 20.75 15.0527L13.8486 8.15137Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_9936_27892">
          <rect width="32" height="32" rx="4" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
