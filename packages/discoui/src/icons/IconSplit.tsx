import { Icon } from './Icon'

export function IconSplit(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M14.333,5.667L14.333,2.333L11,2.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M14.333,11L14.333,14.333L11,14.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M1.667,8.333L7.2,8.333C7.917,8.326 8.608,8.607 9.115,9.115L14.333,14.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
      <path
        d="M10.333,6.333L14.333,2.333"
        stroke="currentColor"
        strokeWidth="1.33"
        fill="none"
      />
    </Icon>
  )
}
