import { Icon } from './Icon'

export function IconChecked(props: { className?: string }) {
  return (
    <Icon className="stroke-coffee-200" {...props}>
      <path d="M2.5 8.5L6.5 12.5L13.5 4" strokeWidth="2" />
    </Icon>
  )
}
