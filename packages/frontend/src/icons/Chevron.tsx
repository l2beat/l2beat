import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ChevronIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-label="Chevron icon"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.485 4.551a1.2 1.2 0 011.697 0L8 10.37l5.818-5.819a1.2 1.2 0 011.697 1.698L8.943 12.82c-.52.52-1.365.52-1.886 0L.485 6.249a1.2 1.2 0 010-1.698"
      />
    </SvgIcon>
  )
}
