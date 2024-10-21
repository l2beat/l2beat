import { SvgIcon, type SvgIconProps } from './svg-icon'

export function SearchIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Search icon"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M12.48 12.48L17.8 17.8"
        strokeWidth="2.88"
        strokeMiterlimit="10"
      />
      <circle cx="8" cy="8" r="5.8" strokeWidth="2.4" fill="none" />
    </SvgIcon>
  )
}
