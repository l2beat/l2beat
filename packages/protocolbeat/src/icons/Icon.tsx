import { clsx } from 'clsx'
import type { ReactNode, SVGProps } from 'react'

export function Icon(
  props: { children: ReactNode; className?: string } & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      {...props}
      className={clsx('size-4', props.className)}
    >
      {props.children}
    </svg>
  )
}
