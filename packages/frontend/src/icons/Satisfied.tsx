import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SatisfiedIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width={24}
      height={24}
      viewBox="0 0 16 16"
      fill="#65E04D"
      {...props}
    >
      <path d="M7 13a1.32 1.32 0 01-.845-.302L1.612 8.792a.503.503 0 01-.06-.696l1.054-1.29a.5.5 0 01.715-.062l3.545 3.078 5.7-6.257a.5.5 0 01.703-.037l1.243 1.115a.5.5 0 01.037.708l-6.556 7.207A1.35 1.35 0 017 13" />
    </SvgIcon>
  )
}
