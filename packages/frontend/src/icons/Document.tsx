import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function DocumentIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Document icon"
      {...props}
    >
      <g clipPath="url(#clip0_197_5676)">
        <path
          d="M10.4 8H5.6a.6.6 0 000 1.2h4.8a.6.6 0 100-1.2"
          className="fill-primary"
        />
        <path
          d="M10.4 11H5.6a.6.6 0 100 1.2h4.8a.6.6 0 100-1.2"
          className="fill-primary"
        />
        <path
          d="M13.25 14c0 .413-.337.75-.75.75h-9a.75.75 0 01-.75-.75V2c0-.413.337-.75.75-.75h5.69l4.06 4.06z"
          className="stroke-primary"
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
        <path
          d="M12.975 5.655H9.85a1 1 0 01-1-1V1.53z"
          className="fill-primary"
        />
      </g>
      <defs>
        <clipPath id="clip0_197_5676">
          <rect width="16" height="16" className="fill-primary" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
