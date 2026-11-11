import { Icon } from './Icon'

export function IconPrompt(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        d="M2 3H4V5H6V7H8V9H6V11H4V13H2V11H4V9H6V7H4V5H2V3ZM9 11H14V13H9V11Z"
        fill="currentColor"
      />
    </Icon>
  )
}
