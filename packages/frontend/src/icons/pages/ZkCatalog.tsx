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
        d="M9.80944 2.80811L10.079 2.89583L10.3472 2.80421C12.8859 1.93715 15.4746 1.87041 18.08 2.60597C18.1057 2.61322 18.15 2.64709 18.15 2.72081V17.6126C18.15 17.6606 18.1301 17.7082 18.0746 17.7495C18.0154 17.7935 17.9364 17.8123 17.8589 17.7942C15.2544 17.1857 12.6246 17.2852 10.0666 18.1066C7.40065 17.2853 4.78015 17.1716 2.13947 17.7931L2.3342 18.6205L2.13947 17.7931C2.06232 17.8113 1.98381 17.7927 1.92503 17.749C1.86987 17.708 1.85 17.6606 1.85 17.6126V2.72081C1.85 2.64706 1.8943 2.61323 1.9199 2.60601C4.5224 1.87146 7.12592 1.93481 9.80944 2.80811Z"
        strokeWidth="1.7"
      />
      <path
        d="M5 6.5H8.5L5 13.5H8.5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 13.5V10M11.5 10V6.5M11.5 10L15 13.5M11.5 10L15 6.5"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
