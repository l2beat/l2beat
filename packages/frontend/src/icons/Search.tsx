import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SearchIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="Search icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.919 9.6a8.153 8.153 0 018.16-8.16 8.153 8.153 0 018.16 8.16 8.13 8.13 0 01-1.663 4.941l5.8 5.8-2.036 2.037-5.886-5.886a8.13 8.13 0 01-4.375 1.268 8.153 8.153 0 01-8.16-8.16m1.92 0a6.23 6.23 0 006.24 6.24 6.23 6.23 0 006.24-6.24 6.23 6.23 0 00-6.24-6.24 6.23 6.23 0 00-6.24 6.24"
      />
    </SvgIcon>
  )
}
