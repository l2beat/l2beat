import { Icon } from '../../../icons/Icon'

export function IconVoltage(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M9 2L5 8H8L7 14L11 8H8L9 2Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}
