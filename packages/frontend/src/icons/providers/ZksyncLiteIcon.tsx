import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function ZkSyncLiteIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="ZKsync Lite logo"
      {...props}
    >
      <path
        d="m17.489 10.374.203-.15V6.207l5.6 5.58-5.6 5.58V14.45h-.5l-5.238-.004z"
        className="fill-none stroke-[#8B8CFB] dark:stroke-current"
      />
      <path
        d="m6.51 13.238-.202.15v3.976l-5.6-5.58 5.6-5.58v2.917h.5l5.248.003z"
        className="fill-none stroke-[#4E5299] dark:stroke-current"
      />
    </SvgIcon>
  )
}
