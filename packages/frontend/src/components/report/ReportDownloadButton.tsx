import cx from 'classnames'
import React from 'react'

import { DownloadArrow } from '../icons/DownloadArrow'

interface ReportDownloadButtonProps {
  fileUrl: string
  className?: string
}

export function ReportDownloadButton({
  fileUrl,
  className,
}: ReportDownloadButtonProps) {
  return (
    <a
      className={cx(
        'flex items-center justify-center rounded-md bg-pink-900 py-4 font-medium text-white transition-colors hover:bg-pink-800 md:w-1/3 md:py-5',
        className,
      )}
      href={fileUrl}
      target="_blank"
    >
      <DownloadArrow className="mr-3" />
      Download the report
    </a>
  )
}
