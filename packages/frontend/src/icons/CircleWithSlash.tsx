import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CircleWithSlashIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path d="M4.49 18.09 18.09 4.49l1.42 1.42L5.91 19.51z" />
      <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0m0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
    </SvgIcon>
  )
}
