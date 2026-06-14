import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function ZkCatalogIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="ZK Catalog icon"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <path
        d="m9.81 2.808.269.088.268-.092c2.539-.867 5.128-.934 7.733-.198.026.007.07.041.07.115v14.892c0 .048-.02.095-.075.137a.26.26 0 01-.216.044 14.44 14.44 0 00-7.792.313c-2.666-.822-5.287-.935-7.928-.314l.195.828-.195-.828a.26.26 0 01-.214-.044c-.055-.041-.075-.088-.075-.136V2.72c0-.074.044-.108.07-.115 2.602-.735 5.206-.671 7.89.202"
        strokeWidth="1.7"
      />
      <path
        d="M5 6.5h3.5l-3.5 7h3.5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 13.5V10m0 0V6.5m0 3.5 3.5 3.5M11.5 10 15 6.5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
