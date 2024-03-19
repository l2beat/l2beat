import React from 'react'

import { cn } from '../../utils/cn'
import { ShieldIcon } from '../icons'
import { Callout } from './Callout'

export function ContractsUpdated() {
  return (
    <Callout
      className={'p-4'}
      color={'red'}
      icon={<ShieldIcon className={cn('fill-red-700 dark:fill-red-300')} />}
      body={
        <div>
          <strong>Note:</strong> Contracts presented in this section had their
          implementaions updated since the last time our team looked at this
          project. The information presented may be inaccurate.
        </div>
      }
    />
  )
}
