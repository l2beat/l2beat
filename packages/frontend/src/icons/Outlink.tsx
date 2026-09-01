import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CustomLinkIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path d="m13.856 1.595-.06.005h-3.13a.533.533 0 100 1.067h1.913l-5.49 5.49a.533.533 0 10.755.753l5.49-5.49v1.913a.533.533 0 101.066 0V2.201a.533.533 0 00-.544-.606M3.2 3.733c-.583 0-1.067.484-1.067 1.067v8c0 .583.484 1.067 1.067 1.067h8c.583 0 1.067-.484 1.067-1.067V6.092L11.2 7.158V12.8h-8v-8h5.642l1.066-1.067H3.2" />
    </SvgIcon>
  )
}
