import { Icon } from '../../../icons/Icon'

export function IconClock(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M8 4.5V8L10.5 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  )
}
