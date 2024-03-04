import React from 'react'

import { cn } from '../../utils/cn'
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
          className={cn('fill-blue-500', small ? 'size-4' : 'size-5')}
        />
      }
      body={text}
      className={cn('p-4 font-medium', className)}
    />
  )
}
