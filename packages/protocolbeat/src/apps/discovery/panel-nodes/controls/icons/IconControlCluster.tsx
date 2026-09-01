import { Icon } from '../../../../../icons/Icon'

export function IconControlCluster(props: { className?: string }) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 5.25L8 7.15L11 5.25" />
      <path d="M5 10.75L8 8.85L11 10.75" />
      <circle cx="4" cy="4.5" r="1.5" />
      <circle cx="12" cy="4.5" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="4" cy="11.5" r="1.5" />
      <circle cx="12" cy="11.5" r="1.5" />
    </Icon>
  )
}
