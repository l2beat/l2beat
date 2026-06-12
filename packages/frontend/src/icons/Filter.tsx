import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'

export function FilterIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn('fill-icon-secondary', className)}
      {...props}
    >
      <path d="M13.778 1H2.222c-.4 0-.722.324-.722.722v1.445c0 .172.061.34.174.47l4.16 4.852v4.067c0 .273.154.523.399.646l2.889 1.444a.73.73 0 00.702-.031.72.72 0 00.343-.615V8.49l4.159-4.853a.72.72 0 00.174-.47V1.722A.72.72 0 0013.778 1" />
    </svg>
  )
}
