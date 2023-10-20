import cx from 'classnames'
import React, { SVGAttributes } from 'react'

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
      className={cx(
        props.className,
        'h-2.5 w-2.5 stroke-black dark:stroke-white',
      )}
      height="9"
      width="9"
      viewBox="0 0 9 9"
    >
      <circle cx="4.5" cy="4.5" r="3.5" fill="#A64EFF" />
    </Icon>
  )
}
