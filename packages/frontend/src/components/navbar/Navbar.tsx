import cx from 'classnames'
import React from 'react'

import { Config } from '../../build/config'
import { NewItemBadge } from '../badge/NewItemBadge'
import { MenuOpenIcon } from '../icons/symbols/MenuOpenIcon'
import { Logo } from '../Logo'
import { OutLink } from '../OutLink'
import { Banner } from './Banner'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { PageLink } from './PageLink'
import { SidebarMenu } from './SidebarMenu'
import {
  getSocialLinksProps,
  SocialLinks,
  SocialLinksProps,
} from './SocialLinks'
import { VerticalBar } from './VerticalBar'

export type NavbarPage = 'scaling' | 'bridges' | 'donate' | 'faq'

export interface NavbarProps {
  showBanner: boolean
  showActivity: boolean
  showBridges: boolean
  showHiring: boolean
  forumLink: string
  socialLinks: SocialLinksProps
  selectedPage: NavbarPage
}

export function getNavbarProps(
  config: Config,
  selectedPage: NavbarPage,
): NavbarProps {
  return {
    showBanner: config.features.banner,
    forumLink: config.links.forum,
    showHiring: config.features.hiring,
    showBridges: config.features.bridges,
    showActivity: config.features.activity,
    socialLinks: getSocialLinksProps(config),
    selectedPage,
  }
}

export function Navbar(props: NavbarProps) {
  return (
    <>
      <SidebarMenu
        showBanner={props.showBanner}
        showActivity={props.showActivity}
        showBridges={props.showBridges}
        showHiring={props.showHiring}
        forumLink={props.forumLink}
        socialLinks={props.socialLinks}
      />
      {props.showBanner && <Banner />}
      <nav
        className={cx(
          'text-base relative flex lg:justify-between items-center h-14 lg:h-16 px-4 lg:px-12',
          'border-gray-200 dark:border-gray-850 border-b',
        )}
      >
        <button id="sidebar-menu-open" className="block lg:hidden">
          <MenuOpenIcon className="block" aria-label="Open menu" />
        </button>
        <ul className="flex h-full items-center">
          <li
            className={cx(
              props.showBridges
                ? 'mx-4 lg:ml-0 lg:mr-8'
                : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            )}
          >
            <a href={props.selectedPage === 'bridges' ? '/bridges/tvl' : '/'}>
              <Logo className="h-8 w-auto" />
            </a>
          </li>
          {props.showBridges && (
            <>
              <li className="h-full">
                <PageLink
                  selected={props.selectedPage === 'scaling'}
                  large
                  href="/scaling/tvl"
                >
                  Scaling
                </PageLink>
              </li>
              <li className="h-full">
                <PageLink
                  selected={props.selectedPage === 'bridges'}
                  large
                  href="/bridges/tvl"
                >
                  Bridges
                  <NewItemBadge className="ml-2" />
                </PageLink>
              </li>
            </>
          )}
        </ul>
        <div className="h-full hidden lg:flex gap-5 items-center">
          <ul
            className={cx(
              'flex gap-4 items-center',
              !props.showBridges && 'absolute left-4 lg:left-12',
            )}
          >
            <SocialLinks {...props.socialLinks} />
          </ul>
          {props.showBridges && <VerticalBar />}
          <ul className="h-full flex items-center gap-1.5">
            <li className="h-full">
              <OutLink
                className="flex items-center h-full px-2 font-medium"
                href={props.forumLink}
              >
                Forum
              </OutLink>
            </li>
            <li className="h-full">
              <PageLink
                selected={props.selectedPage === 'donate'}
                href="/donate"
              >
                Donate
              </PageLink>
            </li>
            <li className="h-full">
              <PageLink selected={props.selectedPage === 'faq'} href="/faq">
                FAQ
              </PageLink>
            </li>
            {props.showHiring && (
              <li className="h-full">
                <OutLink
                  className="flex items-center h-full px-2 font-medium"
                  href="https://www.notion.so/native/l2beat/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
                >
                  Jobs
                  <HiringBadge className="ml-2" />
                </OutLink>
              </li>
            )}
          </ul>
          <VerticalBar />
          <DarkThemeToggle />
        </div>
      </nav>
    </>
  )
}
