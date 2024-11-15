import { Icon } from './Icon'

export function IconDiamond(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 7.19L7.64 13.83H8.36L15 7.19V6.47L11.68 3.15L11.32 3H4.68L4.32 3.15L1 6.47V7.19ZM8 12.75L2.08 6.83L4.89 4H11.11L13.92 6.83L8 12.75ZM8 5.02002H10.69L12.5 6.83002L8 11.23V5.02002Z"
        fill="currentColor"
      />
    </Icon>
  )
}
