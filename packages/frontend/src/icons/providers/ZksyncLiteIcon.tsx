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
        d="M17.4885 10.3736L17.6921 10.2237V9.9709V6.20669L23.2917 11.7867L17.6921 17.3666V14.95V14.4503L17.1924 14.45L11.9541 14.4464L17.4885 10.3736Z"
        className="fill-none stroke-[#8B8CFB] dark:stroke-current"
      />
      <path
        d="M6.51001 13.2382L6.3079 13.3882V13.6398V17.364L0.708351 11.7841L6.3079 6.20412V8.62066V9.12032L6.80756 9.12066L12.0558 9.12427L6.51001 13.2382Z"
        className="fill-none stroke-[#4E5299] dark:stroke-current"
      />
    </SvgIcon>
  )
}
