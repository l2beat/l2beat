import cx from 'classnames'
import React from 'react'

import { ClipboardIcon } from './icons/symbols/ClipboardIcon'

export interface CopyToClipboardProps {
  valueToCopy: string
  className?: string
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  return (
    <ClipboardIcon
      data-value-to-copy={props.valueToCopy}
      className={cx(
        'CopyToClipboard fill-gray-800 dark:fill-white',
        props.className,
      )}
    />
  )
}
