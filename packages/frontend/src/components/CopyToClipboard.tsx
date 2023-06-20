import cx from 'classnames'
import React from 'react'

import { ClipboardIcon } from './icons/symbols/ClipboardIcon'

export interface CopyToClipboardProps {
  valueToCopy: string
  className?: string
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  return (
    <div>
      <ClipboardIcon
        data-value-to-copy={props.valueToCopy}
        className={cx(
          'CopyToClipboard',
          ' fill-gray-800 opacity-80 dark:fill-white',
          'cursor-pointer hover:opacity-100 dark:hover:opacity-100',
          'active:opacity-50 dark:active:opacity-50',
          props.className,
        )}
      />
    </div>
  )
}
