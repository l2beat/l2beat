import cx from 'classnames'
import React from 'react'

import { AnnouncementButtonLink } from './AnnouncementButtonLink'
import { AnnouncementImage } from './AnnouncementImage'
import { AnnouncementNotation } from './AnnouncementNotation'
import { AnnouncementTitle } from './AnnouncementTitle'
import { L2BeatLogo, PolygonLogo } from './logos/AnnouncementLogos'

export function FullAnnouncementBanner() {
  return (
    <div
      className={cx(
        'flex',
        'flex-col-reverse',
        'md:grid',
        'md:grid-cols-2',
        'rounded-md',
        'my-20',
        'overflow-hidden',
        'max-h-fit',
        'bg-gray-100',
        'dark:bg-zinc-800',
      )}
    >
      <div
        className={cx('flex', 'flex-col', 'justify-center', 'm-6', 'md:m-10')}
      >
        <div className={cx('flex', 'space-x-4', 'mb-5 md:mb-8')}>
          <L2BeatLogo />
          <PolygonLogo />
        </div>

        <AnnouncementNotation
          className={cx('text-gray-550', 'dark:text-gray-50', 'mb-1')}
        >
          Just Released
        </AnnouncementNotation>
        <AnnouncementTitle
          className={cx(
            'text-black',
            'dark:text-white',
            'mb-4 md:mb-7',
            'text-2xl',
            'sm:text-4xl',
          )}
        >
          Upgradeability <br /> of Ethereum L2s
        </AnnouncementTitle>
        <AnnouncementButtonLink href="/multisig-report">
          Read now
        </AnnouncementButtonLink>
      </div>
      <AnnouncementImage
        className={cx('h-full')}
        src="/images/announcements/multisig-report.png"
      />
    </div>
  )
}

export function LimitedAnnouncementBanner() {
  return (
    <div
      className={cx(
        'flex',
        'flex-col',
        'md:grid',
        'md:grid-cols-2',
        'rounded-md',
        'my-12',
        'overflow-hidden',
        'max-h-fit',
        'bg-transparent from-gray-250 to-gray-450 md:bg-gradient-to-r',
      )}
    >
      <div
        className={cx(
          'flex',
          'flex-col',
          'justify-center',
          'mx-0',
          'my-8',
          'md:mx-12',
        )}
      >
        <AnnouncementNotation
          className={cx('text-gray-50', 'md:text-black', 'md:text-xl', 'mb-2')}
        >
          Just Released
        </AnnouncementNotation>
        <AnnouncementTitle
          className={cx(
            'text-black',
            'dark:text-white',
            'text-2xl',
            'md:text-black',
            'md:dark:text-black',
            'md:text-5xl',
          )}
        >
          Upgradeability of Ethereum L2s
        </AnnouncementTitle>
      </div>
      <AnnouncementImage
        src="/images/announcements/multisig-report.png"
        className={cx('h-full', 'rounded-md', 'md:rounded-none')}
      />
    </div>
  )
}
