import type { SvgIconProps } from './svg-icon'

export function PlusIcon(props: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="fill-icon-secondary stroke-icon-secondary stroke-2"
      />
      <path
        d="M7 12H17Z"
        className="stroke-surface-primary stroke-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V17Z"
        className="stroke-surface-primary stroke-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
