import { Icon } from './Icon'

export function IconSearch(props: { className?: string }) {
  return (
    <Icon {...props}>
      <circle
        stroke="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        cx="7.333"
        cy="7.333"
        r="5.333"
      />
      <path
        stroke="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14,14L11.133,11.133"
      />
    </Icon>
  )
}
