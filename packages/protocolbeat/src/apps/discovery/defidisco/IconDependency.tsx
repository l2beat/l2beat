import { Icon } from '../../../icons/Icon'

export function IconDependency(props: { className?: string }) {
  return (
    <Icon {...props}>
      {/* Two interlocking chain links */}
      <path
        d="M6 7H4a2 2 0 1 1 0-4h2M10 7h2a2 2 0 1 0 0-4h-2M5 5h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M6 13H4a2 2 0 1 1 0-4h2M10 13h2a2 2 0 1 0 0-4h-2M5 11h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  )
}
