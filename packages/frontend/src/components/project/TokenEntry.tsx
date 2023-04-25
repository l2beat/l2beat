import cx from 'classnames'
import React from 'react'

import { BulletIcon } from '../icons/symbols/BulletIcon'
import { Callout } from './Callout'

export interface TokenEntryProps {
  l2Tokens: string[]
  className?: string
}

export function TokenEntry({ className, l2Tokens }: TokenEntryProps) {
  return (
    <Callout
      className={cx('px-4', className)}
      icon={<BulletIcon className="h-6 md:h-[27px]" />}
      body={
        <>
          <div className="flex flex-wrap gap-x-2">
            <strong>Tokens:</strong> {l2Tokens.join(', ')}
          </div>
        </>
      }
    />
  )
}
