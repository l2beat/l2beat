import React from 'react'

import { ActivityIcon, RiskIcon, TvlIcon } from '../icons'
import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { Logo } from '../Logo'
import { OutLink } from '../OutLink'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { SocialLinks, SocialLinksProps } from './SocialLinks'
import { NavbarPage } from './types'

export interface SidebarMenuProps {
  selectedPage: NavbarPage
  showActivity: boolean
  showHiring: boolean
  forumLink: string
  socialLinks: SocialLinksProps
}

export function SidebarMenu(props: SidebarMenuProps) {
  return (
    <div
      id="sidebar-menu"
      className="fixed left-0 bottom-0 top-0 z-999 flex w-full translate-x-full flex-col bg-white text-base transition-transform duration-300 dark:bg-black lg:hidden"
    >
      <div className="mt-[11.5px] flex items-center justify-between px-4">
        <a href={props.selectedPage === 'bridges' ? '/bridges/tvl' : '/'}>
          <Logo className="h-8 w-auto" />
        </a>
        <div className="flex gap-4">
          <DarkThemeToggle />
          <button id="sidebar-menu-close">
            <MenuCloseIcon className="block" aria-label="Close menu" />
          </button>
        </div>
      </div>
      <div className="relative mt-2 flex-1 overflow-y-auto overflow-x-visible">
        <ul className="mt-8 px-6">
          <li>
            <div className="mb-4 text-sm font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200">
              <a href="/scaling/tvl">Scaling</a>
            </div>
            <ul className="ml-4 flex flex-col gap-4">
              <li className="flex gap-2 font-medium">
                <TvlIcon className="h-auto w-4" />
                <a href="/scaling/tvl">Total Value Locked</a>
              </li>
              <li className="flex gap-2 font-medium">
                <RiskIcon className="h-auto w-4" />
                <a href="/scaling/risk">Risks</a>
              </li>
              {props.showActivity && (
                <li className="flex items-center gap-2 font-medium">
                  <ActivityIcon className="h-auto w-4" />
                  <a href="/scaling/activity">Activity</a>
                </li>
              )}
            </ul>
          </li>
        </ul>
        <ul className="mt-8 px-6">
          <li>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200">
                <a href="/bridges/tvl">Bridges</a>
              </span>
            </div>
            <ul className="ml-4 flex flex-col gap-4">
              <li className="flex items-center gap-2 font-medium">
                <TvlIcon className="h-auto w-4" />
                <a href="/bridges/tvl">Total Value Locked</a>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <RiskIcon className="h-auto w-4" />
                <a href="/bridges/risk">Risks</a>
              </li>
            </ul>
          </li>
        </ul>
        <hr className="mt-8 mb-6 w-full border-gray-200 dark:border-gray-850" />
        <ul className="flex flex-col gap-4 px-6 text-sm font-medium">
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
        <hr className="my-6 w-full border-gray-200 dark:border-gray-850" />
        <ul className="mb-12 flex gap-4 px-6">
          <SocialLinks {...props.socialLinks} />
        </ul>
      </div>
    </div>
  )
}
