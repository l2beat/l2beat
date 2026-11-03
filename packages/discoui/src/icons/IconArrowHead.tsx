import { Icon } from './Icon'

export function IconArrowHeadRight(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M4 3L12 8L4 13Z" fill="currentColor" />
    </Icon>
  )
}

export function IconArrowHeadLeft(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path d="M12 3L4 8L12 13Z" fill="currentColor" />
    </Icon>
  )
}
