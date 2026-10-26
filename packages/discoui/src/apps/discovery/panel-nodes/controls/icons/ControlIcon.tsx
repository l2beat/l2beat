import type { ReactNode, SVGProps } from 'react'
import { Icon } from '../../../../../icons/Icon'

export function ControlIcon(
  props: { children: ReactNode; className?: string } & SVGProps<SVGSVGElement>,
) {
  return (
    <Icon
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  )
}
