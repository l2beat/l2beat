import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="black"
      aria-label="Close icon"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.30936 9.31015C8.9285 9.69101 8.31101 9.69101 7.93015 9.31015L0.689301 2.0693C0.308443 1.68844 0.308443 1.07095 0.689301 0.690093C1.07016 0.309235 1.68765 0.309234 2.06851 0.690092L9.30936 7.93094C9.69022 8.3118 9.69022 8.9293 9.30936 9.31015Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.31064 0.69015C9.6915 1.07101 9.6915 1.6885 9.31064 2.06936L2.06979 9.31021C1.68893 9.69107 1.07144 9.69107 0.690581 9.31021C0.309723 8.92935 0.309722 8.31186 0.690581 7.931L7.93143 0.69015C8.31229 0.309292 8.92978 0.309292 9.31064 0.69015Z"
      />
    </SvgIcon>
  )
}
