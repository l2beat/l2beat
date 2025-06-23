import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ChevronIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-label="Chevron icon"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.484807 4.55147C0.953436 4.08284 1.71323 4.08284 2.18186 4.55147L8 10.3696L13.8181 4.55147C14.2868 4.08284 15.0466 4.08284 15.5152 4.55147C15.9838 5.0201 15.9838 5.7799 15.5152 6.24853L8.94281 12.8209C8.42212 13.3416 7.5779 13.3416 7.05719 12.8209L0.484807 6.24853C0.0161778 5.7799 0.0161778 5.0201 0.484807 4.55147Z"
      />
    </SvgIcon>
  )
}
