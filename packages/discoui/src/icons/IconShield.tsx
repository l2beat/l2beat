import { Icon } from './Icon'

export function IconShield(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M8 1.5L2.5 3.75V7.75C2.5 11.1 4.85 14.05 8 15C11.15 14.05 13.5 11.1 13.5 7.75V3.75L8 1.5Z"
        fill="currentColor"
      />
    </Icon>
  )
}
