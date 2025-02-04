import type { SvgIconProps } from './svg-icon'

export function MilestoneIcon(props: SvgIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="Milestone icon"
      {...props}
    >
      <rect
        className="fill-green-700 stroke-green-500"
        x="9.89941"
        y="1.41421"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45 9.89941 1.41421)"
        strokeWidth="2"
      />
    </svg>
  )
}
