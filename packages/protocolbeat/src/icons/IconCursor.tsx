import { Icon } from './Icon'

export function IconCursor(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.69 3.13a.33.33 0 0 1 .43-.43l10.67 4.33a.33.33 0 0 1-.04.63l-4.08 1.05a1.33 1.33 0 0 0-.96.96l-1.05 4.08a.33.33 0 0 1-.63.04z" />
    </Icon>
  )
}
