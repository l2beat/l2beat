import { Icon } from './Icon'

export function IconHand(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 7.33V4a1.33 1.33 0 0 0-2.67 0v.67" />
      <path d="M9.33 6.67V2.67a1.33 1.33 0 0 0-2.66 0V4" />
      <path d="M6.67 7V4A1.33 1.33 0 0 0 4 4v5.33" />
      <path d="M12 5.33a1.33 1.33 0 1 1 2.67 0v4a5.33 5.33 0 0 1-5.34 5.34H8c-1.87 0-3-.58-4-1.57l-2.4-2.4a1.33 1.33 0 0 1 1.89-1.88L4.67 10" />
    </Icon>
  )
}
