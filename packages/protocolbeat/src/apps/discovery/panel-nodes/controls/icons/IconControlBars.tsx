import { Icon } from '../../../../../icons/Icon'

export function IconControlBars(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12.5V8.5" />
      <path d="M6.5 12.5V5.5" />
      <path d="M10 12.5V3.5" />
      <path d="M13 12.5V7" />
    </Icon>
  )
}
