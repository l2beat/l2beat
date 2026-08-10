import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function BidirectionalArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" {...props}>
      <path d="M.86 7.994c0-.442.337-.8.753-.8h10.98L9.806 4.176a.837.837 0 010-1.131.72.72 0 011.064 0l4.057 4.383a.835.835 0 010 1.131l-4.057 4.383a.72.72 0 01-1.064 0 .836.836 0 010-1.13l2.785-3.018H1.612c-.415 0-.752-.359-.752-.8" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.202 3.044a.836.836 0 010 1.132L2.677 7.993l3.525 3.818a.836.836 0 010 1.131.72.72 0 01-1.065 0L1.08 8.559a.836.836 0 010-1.131l4.057-4.384a.72.72 0 011.065 0"
      />
    </SvgIcon>
  )
}
