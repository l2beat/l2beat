import cx from 'classnames'
import React from 'react'

import { ActivityIcon, RiskIcon, TvlIcon } from '../icons'
import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { OutLink } from '../OutLink'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HorizontalBar } from './HorizontalBar'
import { SocialLinks, SocialLinksProps } from './SocialLinks'

export interface SidebarMenuProps {
  showBanner: boolean
  showActivity: boolean
  showBridges: boolean
  forumLink: string
  socialLinks: SocialLinksProps
}

export function SidebarMenu(props: SidebarMenuProps) {
  return (
    <>
      <div
        id="sidebar-menu"
        className={cx(
          'hidden fixed left-0 bottom-0 z-50 text-base',
          props.showBanner ? 'top-8' : 'top-0',
          'w-3/4 min-w-[240px]',
          'bg-white dark:bg-black flex flex-col',
        )}
      >
        <button id="sidebar-menu-close" className="block ml-4 mt-4">
          <MenuCloseIcon className="block" aria-label="Close menu" />
        </button>
        <div className="p-4 flex-1 relative overflow-y-auto overflow-x-visible">
          <ul className="mt-8">
            <li>
              <div className="uppercase text-xs mb-4 font-medium text-gray-700 dark:text-gray-300">
                Scaling
              </div>
              <ul className="flex flex-col gap-4">
                <li className="font-medium flex gap-2">
                  <TvlIcon className="w-5 h-auto" />
                  <a href="/scaling/tvl">Total Value Locked</a>
                </li>
                <li className="font-medium flex gap-2">
                  <RiskIcon className="w-5 h-auto" />
                  <a href="/scaling/risk">Risks</a>
                </li>
                {props.showActivity && (
                  <li className="font-medium flex gap-2">
                    <ActivityIcon className="w-5 h-auto" />
                    <a href="/scaling/activity">Activity</a>
                  </li>
                )}
              </ul>
            </li>
          </ul>
          {props.showBridges && (
            <ul className="mt-8">
              <li>
                <div className="uppercase text-xs mb-4 font-medium text-gray-700 dark:text-gray-300">
                  Bridges
                </div>
                <ul className="flex flex-col gap-4">
                  <li className="font-medium flex gap-2">
                    <TvlIcon className="w-5 h-auto" />
                    <a href="/bridges/tvl">Total Value Locked</a>
                  </li>
                  <li className="font-medium flex gap-2">
                    <RiskIcon className="w-5 h-auto" />
                    <a href="/bridges/risk">Risks</a>
                  </li>
                </ul>
              </li>
            </ul>
          )}
          <HorizontalBar />
          <ul className="font-medium flex flex-col gap-4">
            <li>
              <OutLink href={props.forumLink}>Forum</OutLink>
            </li>
            <li>
              <a href="/donate">Donate</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
          </ul>
          <HorizontalBar />
          <ul className="flex gap-4 mb-12">
            <SocialLinks {...props.socialLinks} />
          </ul>
          <div className="flex gap-4 mb-8">
            <DarkThemeToggle withText />
          </div>
        </div>
      </div>
      <div
        id="sidebar-menu-shadow"
        className={cx(
          'hidden fixed top-0 left-0 z-40',
          'bg-black opacity-30 w-full h-full',
        )}
      />
    </>
  )
}
