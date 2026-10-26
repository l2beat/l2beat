import { Icon } from './Icon'

export function IconTerminal(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      {...props}
    >
      <path d="M1.5 3.5h13v9h-13z" />
      <path d="M3.75 6.5l2 1.5-2 1.5" />
      <path d="M7.25 10h4" />
    </Icon>
  )
}
