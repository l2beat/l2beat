import { type SVGAttributes } from 'react'

export function Icon({ className, ...rest }: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      {...rest}
    />
  )
}
