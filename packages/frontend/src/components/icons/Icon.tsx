import React, { SVGAttributes } from 'react'

import { cn } from '../../utils/cn'

export function Icon({ className, ...rest }: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={cn('fill-black dark:fill-white', className)}
      role="img"
      {...rest}
    />
  )
}
