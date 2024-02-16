import React, { SVGAttributes } from 'react'

import { cn } from '../../../utils/cn'
import { Icon } from '../Icon'

/*  IMPORTANT
  If you change this file you need to update POINT_CLASS_NAMES.yellowTriangle in the following file too:
  * packages/frontend/src/scripts/charts/styles.ts
*/
export function ExternalIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      aria-label="External asset icon"
      {...props}
      className={cn('size-3 stroke-black dark:stroke-white', props.className)}
      height="12"
      width="12"
      viewBox="0 0 12 12"
    >
      <path
        d="m1.4167 10.234 4.5833-7.9386 4.5833 7.9386z"
        fill="#ef8f00"
        strokeWidth="1.0585"
      />
    </Icon>
  )
}
