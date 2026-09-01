import { Icon } from '../../../../../icons/Icon'

export function IconControlStack(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 2.5L13 5.5L8 8.5L3 5.5L8 2.5Z" />
      <path d="M3.5 8L8 10.75L12.5 8" />
      <path d="M3.5 11L8 13.75L12.5 11" />
    </Icon>
  )
}
