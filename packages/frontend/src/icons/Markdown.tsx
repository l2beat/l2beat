import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

/** The Markdown mark (github.com/dcurtis/markdown-mark). */
export function MarkdownIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      aria-label="Markdown icon"
      width="16"
      height="16"
      viewBox="0 0 208 128"
      {...props}
    >
      <path
        d="M15 10h178a5 5 0 0 1 5 5v98a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
      />
      <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0-30-33h20V30h20v35h20z" />
    </SvgIcon>
  )
}
