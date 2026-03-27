import { useId } from 'react'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function CartesiIcon(props: SvgIconProps) {
  const uid = useId()
  const clipId = `${uid}-cartesi-clip`
  const maskId = `${uid}-cartesi-mask`

  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 220 220"
      fill="none"
      aria-label="Cartesi icon"
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="220" height="220" rx="110" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M110 220C170.751 220 220 170.751 220 110C220 49.2487 170.751 0 110 0C49.2487 0 0 49.2487 0 110C0 170.751 49.2487 220 110 220Z"
          fill="#00F6FF"
        />
        <mask
          id={maskId}
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="84"
          y="118"
          width="72"
          height="79"
        >
          <path
            d="M84.4691 118.691H155.63V196.839H84.4691V118.691Z"
            fill="white"
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M84.5572 143.201L106.52 196.72L155.394 146.883H118.334L108.438 118.838L84.5572 143.201Z"
            fill="black"
          />
        </g>
        <path
          d="M143.933 82.6709L115.911 111.221L125.1 137.249H198.815L179.579 82.6709H143.933Z"
          fill="black"
        />
        <path
          d="M22 82.6709L41.2362 137.249H76.8822L104.853 108.749L95.6644 82.6709H22Z"
          fill="black"
        />
        <path
          d="M114.295 23.1992L65.4207 73.0366H102.481L112.376 101.082L136.258 76.7691L114.295 23.1992Z"
          fill="black"
        />
      </g>
    </SvgIcon>
  )
}
