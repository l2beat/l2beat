import classNames from 'classnames'
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
    socialLinks: getSocialLinksProps(config),
    selectedPage,
  }
}

export function Navbar(props: NavbarProps) {
  return (
    <>
      <SidebarMenu
        showBanner={props.showBanner}
        forumLink={props.forumLink}
        socialLinks={props.socialLinks}
      />
      {props.showBanner && <Banner />}
      <nav
        className={classNames(
          'text-base relative flex justify-between items-center h-16 px-12',
          'border-gray-100 dark:border-gray-900 border-b',
        )}
      >
        <button id="sidebar-menu-open" className="block md:hidden">
          <MenuOpenIcon className="block" aria-label="Open menu" />
        </button>
        <ul className="flex h-full items-center">
          <li className="mr-8">
            <a href="/">
              <Logo />
            </a>
          </li>
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
        </ul>
        <div className="h-full flex gap-5 items-center">
          <ul className="hidden md:flex gap-4 items-center">
            <SocialLinks {...props.socialLinks} />
          </ul>
          <VerticalBar />
          <ul className="h-full hidden md:flex items-center">
            <li className="h-full">
              <OutLink
                className="flex items-center h-full px-2"
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
