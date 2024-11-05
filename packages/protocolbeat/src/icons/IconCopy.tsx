import { Icon } from './Icon'

export function IconCopy(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3L6 2H13L14 3V10L13 11H11V13L10 14H3L2 13V6L3 5H5V3ZM6 5H10L11 6V10H13V3H6V5ZM10 6H3V13H10V6Z"
        fill="currentColor"
      />
    </Icon>
  )
}
