import { Icon } from './Icon'

export function IconBoard(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      {...props}
    >
      <path d="M2.5 3h11v10h-11zM2.5 6.5h11M2.5 9.75h11M6.5 6.5V13" />
    </Icon>
  )
}
