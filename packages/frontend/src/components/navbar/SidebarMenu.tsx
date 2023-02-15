import cx from 'classnames'
import React from 'react'

import { NewItemBadge } from '../badge/NewItemBadge'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { ActivityIcon, RiskIcon, TvlIcon } from '../icons'
import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { OutLink } from '../OutLink'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { SocialLinks, SocialLinksProps } from './SocialLinks'

export interface SidebarMenuProps {
  showBanner: boolean
  showActivity: boolean
  showHiring: boolean
  forumLink: string
  socialLinks: SocialLinksProps
}

export function SidebarMenu(props: SidebarMenuProps) {
  return (
    <>
      <div
        id="sidebar-menu"
        className={cx(
          'fixed left-0 bottom-0 z-50 hidden text-base',
          props.showBanner ? 'top-8' : 'top-0',
          'w-3/4 min-w-[240px]',
          'flex flex-col bg-white dark:bg-black',
        )}
      >
        <button id="sidebar-menu-close" className="ml-4 mt-4 block">
          <MenuCloseIcon className="block" aria-label="Close menu" />
        </button>
        <div className="relative flex-1 overflow-y-auto overflow-x-visible p-4">
          <ul className="mt-8">
            <li>
              <div className="mb-4 text-xs font-medium uppercase text-gray-700 dark:text-gray-300">
                Scaling
              </div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-2 font-medium">
                  <TvlIcon className="h-auto w-5" />
                  <a href="/scaling/tvl">Total Value Locked</a>
                </li>
                <li className="flex gap-2 font-medium">
                  <RiskIcon className="h-auto w-5" />
                  <a href="/scaling/risk">Risks</a>
                </li>
                {props.showActivity && (
                  <li className="flex items-center gap-2 font-medium">
                    <ActivityIcon className="h-auto w-5" />
                    <a href="/scaling/activity">Activity</a>
                    <NewItemBadge />
                  </li>
                )}
              </ul>
            </li>
          </ul>
          <ul className="mt-8">
            <li>
              <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-xs font-medium uppercase">Bridges</span>
                <NewItemBadge />
              </div>
              <ul className="flex flex-col gap-4 ">
                <li className="flex items-center gap-2 font-medium">
                  <TvlIcon className="h-auto w-5" />
                  <a href="/bridges/tvl">Total Value Locked</a>
                  <NewItemBadge />
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <RiskIcon className="h-auto w-5" />
                  <a href="/bridges/risk">Risks</a>
                  <NewItemBadge />
                </li>
              </ul>
            </li>
          </ul>

          <HorizontalSeparator className="my-6" />
          <ul className="flex flex-col gap-4 font-medium">
            <li>
              <OutLink href={props.forumLink}>Forum</OutLink>
            </li>
            <li>
              <a href="/donate">Donate</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            {props.showHiring && (
              <li>
                <OutLink
                  className="flex items-center"
                  href="https://www.notion.so/native/l2beat/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
                >
                  Jobs
                  <HiringBadge className="ml-2" />
                </OutLink>
              </li>
            )}
          </ul>
          <HorizontalSeparator className="my-6" />
          <ul className="mb-12 flex gap-4">
            <SocialLinks {...props.socialLinks} />
          </ul>
          <div className="mb-8 flex gap-4">
            <DarkThemeToggle withText />
          </div>
        </div>
      </div>
      <div
        id="sidebar-menu-shadow"
        className={cx(
          'fixed top-0 left-0 z-40 hidden',
          'h-full w-full bg-black opacity-30',
        )}
      />
    </>
  )
}
