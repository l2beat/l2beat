import cx from 'classnames'
import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function NativeIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      aria-label="Native asset icon"
      {...props}
      className={cx(props.className, 'h-2 w-2 stroke-black dark:stroke-white')}
      height="9"
      width="9"
      viewBox="0 0 9 9"
    >
      <rect x="0" y="0" width="9" height="9" fill="#FF46C0" strokeWidth="2" />
    </Icon>
  )
}
