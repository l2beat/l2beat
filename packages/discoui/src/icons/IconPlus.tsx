import { Icon } from './Icon'

export function IconPlus(props: { className?: string }) {
  return (
    <Icon
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  )
}
