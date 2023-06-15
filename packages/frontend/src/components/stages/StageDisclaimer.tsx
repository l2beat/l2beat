import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'
import { Callout } from '../project/Callout'

export function StageDisclaimer({
  text,
  small,
  className,
}: {
  text: string
  small?: boolean
  className?: string
}) {
  return (
    <Callout
      color="blue"
      icon={
        <InfoIcon
          className={cx(' fill-blue-500', small ? 'h-4 w-4' : 'h-5 w-5')}
        />
      }
      body={text}
      className={cx('p-4 font-medium', className)}
    />
  )
}
