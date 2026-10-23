import { Icon } from './Icon'

export function IconInitial(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="4" fill="currentColor" />
    </Icon>
  )
}
