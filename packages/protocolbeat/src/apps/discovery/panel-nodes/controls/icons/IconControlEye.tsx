import { Icon } from '../../../../../icons/Icon'

export function IconControlEye(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1.75 8C3.15 5.35 5.45 4 8 4C10.55 4 12.85 5.35 14.25 8C12.85 10.65 10.55 12 8 12C5.45 12 3.15 10.65 1.75 8Z" />
      <circle cx="8" cy="8" r="2" />
    </Icon>
  )
}
