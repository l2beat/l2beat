import type { SvgIconProps } from './SvgIcon'

export function ClockIcon(props: SvgIconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334"
        stroke="#5F6470"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4v4l2.667 1.333"
        stroke="#5F6470"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
