import type { SvgIconProps } from './SvgIcon'

export function PlusIcon(props: SvgIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        className="fill-icon-secondary stroke-2 stroke-icon-secondary"
      />
      <path
        d="M7 12h10Z"
        className="stroke-2 stroke-surface-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v10Z"
        className="stroke-2 stroke-surface-primary"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
