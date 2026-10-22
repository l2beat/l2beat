import { Icon } from './Icon'

export function IconArrowToDotUp(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M8,14.667L8,5.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M12.667,10L8,5.333L3.333,10"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <circle
        cx="8"
        cy="2"
        r="0.667"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
    </Icon>
  )
}
