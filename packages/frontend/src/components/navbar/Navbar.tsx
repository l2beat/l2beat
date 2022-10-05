import cx from 'classnames'
import React from 'react'

import { Config } from '../../build/config'
import { MenuOpenIcon } from '../icons/symbols/MenuOpenIcon'
import { Logo } from '../Logo'
import { OutLink } from '../OutLink'
import { Banner } from './Banner'
import { DarkThemeToggle } from './DarkThemeToggle'
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
        forumLink={props.forumLink}
        socialLinks={props.socialLinks}
      />
      {props.showBanner && <Banner />}
      <nav
        className={cx(
          'text-base relative flex md:justify-between items-center h-14 md:h-16 px-4 md:px-12',
          'border-gray-100 dark:border-gray-900 border-b',
        )}
      >
        <button id="sidebar-menu-open" className="block md:hidden">
          <MenuOpenIcon className="block" aria-label="Open menu" />
        </button>
        <ul className="flex h-full items-center">
          <li
            className={cx(
              props.showBridges
                ? 'mx-4 md:ml-0 md:mr-8'
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
                </PageLink>
              </li>
            </>
          )}
        </ul>
        <div className="h-full hidden md:flex gap-5 items-center">
          <ul
            className={cx(
              'flex gap-4 items-center',
              !props.showBridges && 'absolute left-4 md:left-12',
            )}
          >
            <SocialLinks {...props.socialLinks} />
          </ul>
          {props.showBridges && <VerticalBar />}
          <ul className="h-full flex items-center">
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
          </ul>
          <VerticalBar />
          <DarkThemeToggle />
        </div>
      </nav>
    </>
  )
}
