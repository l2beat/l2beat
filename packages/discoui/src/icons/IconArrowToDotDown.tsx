import { Icon } from './Icon'

export function IconArrowToDotDown(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M8,1.333L8,10.667"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M12.667,6L8,10.667L3.333,6"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <circle
        cx="8"
        cy="14"
        r="0.667"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
    </Icon>
  )
}
