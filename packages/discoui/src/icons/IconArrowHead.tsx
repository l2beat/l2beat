import { Icon } from './Icon'

export function IconArrowHeadRight(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M2.5 4L14 8L2.5 12L5 8Z" fill="currentColor" />
    </Icon>
  )
}

export function IconArrowHeadLeft(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M13.5 4L2 8L13.5 12L11 8Z" fill="currentColor" />
    </Icon>
  )
}
