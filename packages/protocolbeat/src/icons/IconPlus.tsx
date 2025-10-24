import { Icon } from './Icon'

export function IconPlus(props: { className?: string }) {
  return (
    <Icon
      {...props}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  )
}
