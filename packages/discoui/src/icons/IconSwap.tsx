import { Icon } from './Icon'

export function IconSwap(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M10.667,2L13.333,4.667L10.667,7.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M13.333,4.667L2.667,4.667"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M5.333,14L2.667,11.333L5.333,8.667"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M2.667,11.333L13.333,11.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
    </Icon>
  )
}
