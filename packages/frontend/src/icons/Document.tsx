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
          d="M10.4 8H5.6C5.26863 8 5 8.26863 5 8.6C5 8.93137 5.26863 9.2 5.6 9.2H10.4C10.7314 9.2 11 8.93137 11 8.6C11 8.26863 10.7314 8 10.4 8Z"
          className="fill-primary"
        />
        <path
          d="M10.4 11H5.6C5.26863 11 5 11.2686 5 11.6C5 11.9314 5.26863 12.2 5.6 12.2H10.4C10.7314 12.2 11 11.9314 11 11.6C11 11.2686 10.7314 11 10.4 11Z"
          className="fill-primary"
        />
        <path
          d="M13.25 14C13.25 14.4132 12.9132 14.75 12.5 14.75H3.5C3.08675 14.75 2.75 14.4132 2.75 14V2C2.75 1.58675 3.08675 1.25 3.5 1.25H9.1895L13.25 5.3105V14Z"
          className="stroke-primary"
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
        <path
          d="M12.9751 5.65479H9.8501C9.29781 5.65479 8.8501 5.20707 8.8501 4.65479V1.52979L12.9751 5.65479Z"
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
