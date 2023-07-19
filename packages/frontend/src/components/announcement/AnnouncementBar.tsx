import cx from 'classnames'
import React, { ReactNode } from 'react'

import { ArrowRightIcon } from '../icons'

export function AnnouncementBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={cx(
        'bg-indigo-500 text-white dark:bg-indigo-500',
        'flex',
        'flex-col',
        'md:flex-row',
        'justify-center',
        'text-center',
        'items-center',
        'space-x-5',
        'p-2',
      )}
    >
      {children}
    </div>
  )
}

export function MultisigReportAnnouncementBar() {
  return (
    <AnnouncementBar>
      <p>Just released ⸱ Upgradeability of Ethereum L2s</p>
      <a href="/multisig-report">
        <span className={cx('underline decoration-solid underline-offset-2')}>
          Download now
        </span>
        <ArrowRightIcon className="ml-1 inline-block fill-current" />
      </a>
    </AnnouncementBar>
  )
}
