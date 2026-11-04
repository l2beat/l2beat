import { Icon } from './Icon'

export function IconArrowHeadRight(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M3 4L13 8L3 12Z" fill="currentColor" />
    </Icon>
  )
}

export function IconArrowHeadLeft(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M13 4L3 8L13 12Z" fill="currentColor" />
    </Icon>
  )
}
