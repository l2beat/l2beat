import { Icon } from './Icon'

export function IconTreemap(props: { className?: string }) {
  return (
    <Icon {...props}>
      <rect x="1" y="1" width="7" height="9" fill="currentColor" />
      <rect x="9" y="1" width="6" height="4" fill="currentColor" />
      <rect x="9" y="6" width="6" height="4" fill="currentColor" />
      <rect x="1" y="11" width="9" height="4" fill="currentColor" />
      <rect x="11" y="11" width="4" height="4" fill="currentColor" />
    </Icon>
  )
}
