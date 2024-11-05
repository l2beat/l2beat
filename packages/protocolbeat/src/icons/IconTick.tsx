import { Icon } from './Icon'

export function IconTick(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M4 8L7.33333 11L12 4"
        stroke="currentColor"
        stroke-linejoin="bevel"
      />
    </Icon>
  )
}
