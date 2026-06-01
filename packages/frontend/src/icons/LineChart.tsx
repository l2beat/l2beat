import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function LineChartIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" {...props}>
      <path
        d="M1.773 1a.777.777 0 00-.764.787v11.651c0 .85.704 1.554 1.553 1.554h11.651a.778.778 0 100-1.554H2.563V1.788A.777.777 0 001.772 1m11.648 3.11a.78.78 0 00-.534.235l-2.57 2.57-1.78-1.704a.777.777 0 00-1.078.003L4.352 8.22a.777.777 0 101.08 1.116l2.57-2.486 1.79 1.712a.777.777 0 001.087-.012l3.107-3.107a.777.777 0 00-.565-1.333"
        fill="currentColor"
      />
    </SvgIcon>
  )
}
