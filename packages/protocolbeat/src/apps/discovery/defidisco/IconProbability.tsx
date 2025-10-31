import { Icon } from '../../../icons/Icon'

export function IconProbability(props: { className?: string }) {
  return (
    <Icon {...props}>
      {/* Top circle */}
      <circle
        cx="5"
        cy="4"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Diagonal line */}
      <path
        d="M4 13L12 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Bottom circle */}
      <circle
        cx="11"
        cy="12"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </Icon>
  )
}
