import { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

export function ArrowIcon({ className }: { className?: ClassNameValue }) {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path d="M6.00052 2.41351L9.56629 5.97928C9.95264 6.36563 10.5798 6.36563 10.9661 5.97928C11.3524 5.59294 11.3524 4.96582 10.9661 4.57948L6.6603 0.273677C6.29542 -0.0912056 5.7047 -0.0912056 5.34075 0.273677L1.03495 4.57948C0.648604 4.96582 0.648603 5.59294 1.03495 5.97928C1.4213 6.36563 2.04841 6.36563 2.43475 5.97928L6.00052 2.41351Z" />
    </svg>
  )
}
