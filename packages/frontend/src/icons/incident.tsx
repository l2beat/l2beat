import type { SvgIconProps } from './svg-icon'

export function IncidentIcon(props: SvgIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="Incident icon"
      {...props}
    >
      <path
        className="fill-red-800 stroke-red-700"
        d="M2.11842 14.4966L9.13637 2.46527C9.52224 1.80374 10.4781 1.80375 10.864 2.46528L17.882 14.497C18.2708 15.1637 17.7899 16.0008 17.0182 16.0008L10.0003 16.0008L10.0002 16.0008L2.98214 16.0004C2.21039 16.0004 1.72956 15.1632 2.11842 14.4966Z"
        strokeWidth="2"
      />
    </svg>
  )
}
