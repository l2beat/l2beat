import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function CartesiIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="Cartesi icon"
      {...props}
    >
      <polygon
        fill="#00f6ff"
        points="123.9 237.9 167.4 344 264.2 245.2 190.8 245.2 171.2 189.6 123.9 237.9"
      />
      <polygon
        fill="#00f6ff"
        points="241.5 117.9 186 174.5 204.2 226.1 350.2 226.1 312.1 117.9 241.5 117.9"
      />
      <polygon
        fill="#00f6ff"
        points="0 117.9 38.1 226.1 108.7 226.1 164.1 169.6 145.9 117.9 0 117.9"
      />
      <polygon
        fill="#00f6ff"
        points="182.8 0 86 98.8 159.4 98.8 179 154.4 226.3 106.2 182.8 0"
      />
    </SvgIcon>
  )
}
