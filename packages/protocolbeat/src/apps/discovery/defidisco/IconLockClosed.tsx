import { Icon } from '../../../icons/Icon'

export function IconLockClosed(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M4 6V4C4 2.89543 4.89543 2 6 2H10C11.1046 2 12 2.89543 12 4V6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="2"
        y="6"
        width="12"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="8" cy="10" r="1" fill="currentColor" />
    </Icon>
  )
}
