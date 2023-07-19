import cx from 'classnames'
import React, { ReactNode } from 'react'

import { DownloadArrow } from './DownloadArrow'

interface DownloadButtonProps {
  fileUrl: string
  children: ReactNode
  className?: string
}

export function DownloadButton({
  fileUrl,
  children,
  className,
}: DownloadButtonProps) {
  return (
    <a
      className={cx(
        'text-white',
        'flex',
        'flex-center',
        'justify-center',
        'py-4',
        'md:py-5',
        'rounded-md',
        'bg-pink-900',
        'font-medium',
        'md:w-1/3',
        className,
      )}
      href={fileUrl}
    >
      <DownloadArrow className="mr-3" />
      {children}
    </a>
  )
}
