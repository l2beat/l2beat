import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CopyIcon(props: SvgIconProps) {
  return (
    <SvgIcon width={24} height={24} viewBox="0 0 16 16" {...props}>
      <path d="M5.6.2a1.2 1.2 0 00-1.2 1.2V11a1.2 1.2 0 001.2 1.2h7.8a1.2 1.2 0 001.2-1.2V4.1a.6.6 0 00-.176-.424l-3.3-3.3A.6.6 0 0010.7.2zm4.8 1.143L13.457 4.4H11a.6.6 0 01-.6-.6zM2.6 3.2a1.2 1.2 0 00-1.2 1.2V14a1.2 1.2 0 001.2 1.2h7.8a1.2 1.2 0 001.2-1.2v-.6h-6A2.4 2.4 0 013.2 11V3.2z" />
    </SvgIcon>
  )
}
