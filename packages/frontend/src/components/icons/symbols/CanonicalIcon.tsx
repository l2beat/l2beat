import React, { SVGAttributes } from 'react'

import { cn } from '../../../utils/cn'
import { Icon } from '../Icon'

/*  IMPORTANT
  If you change this file you need to update POINT_CLASS_NAMES.purpleCircle in the following file too:
  * packages/frontend/src/scripts/charts/styles.ts
*/
export function CanonicalIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      aria-label="Bridged asset icon"
      {...props}
      className={cn('size-2.5 stroke-black dark:stroke-white', props.className)}
      height="9"
      width="9"
      viewBox="0 0 9 9"
    >
      <circle cx="4.5" cy="4.5" r="3.5" fill="#A64EFF" />
    </Icon>
  )
}
