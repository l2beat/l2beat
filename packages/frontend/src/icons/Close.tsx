import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-label="Close icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.31 9.31a.975.975 0 01-1.38 0L.69 2.07A.975.975 0 112.068.69l7.24 7.24c.381.382.381 1 0 1.38"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.31.69c.381.381.381.999 0 1.38L2.07 9.31A.975.975 0 11.69 7.931L7.932.691a.975.975 0 011.38 0"
      />
    </SvgIcon>
  )
}
