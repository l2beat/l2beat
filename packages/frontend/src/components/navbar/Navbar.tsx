import React from 'react'

import { Config } from '../../build/config'
import { MenuOpenIcon } from '../icons'
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
import { NavbarPage } from './types'
import { VerticalBar } from './VerticalBar'

export interface NavbarProps {
  showBanner: boolean
  showActivity: boolean
  showHiring: boolean
  showDefinitions: boolean
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
    showActivity: config.features.activity,
    showDefinitions: config.features.maturity,
    socialLinks: getSocialLinksProps(config),
    selectedPage,
  }
}

export function Navbar(props: NavbarProps) {
  return (
    <>
      <SidebarMenu
        selectedPage={props.selectedPage}
        showActivity={props.showActivity}
        showHiring={props.showHiring}
        forumLink={props.forumLink}
        socialLinks={props.socialLinks}
      />
      {props.showBanner && <Banner />}
      <div className="h-14 border-b border-gray-200 text-base dark:border-gray-850 lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-12">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <a href={props.selectedPage === 'bridges' ? '/bridges/tvl' : '/'}>
                <Logo className="h-8 w-auto" />
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
          <button id="sidebar-menu-open" className="block lg:hidden">
            <MenuOpenIcon className="block" aria-label="Open menu" />
          </button>
          <div className="hidden h-full items-center gap-5 lg:flex">
            <ul className="flex items-center gap-4">
              <SocialLinks {...props.socialLinks} />
            </ul>
            <VerticalBar />
            <ul className="flex h-full items-center gap-1.5">
              <li className="h-full">
                <OutLink
                  className="flex h-full items-center px-2 font-medium"
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
              {props.showDefinitions && (
                <li className="h-full">
                  <PageLink
                    selected={props.selectedPage === 'definitions'}
                    href="/definitions"
                  >
                    Definitions
                  </PageLink>
                </li>
              )}
              {props.showHiring && (
                <li className="h-full">
                  <OutLink
                    className="flex h-full items-center px-2 font-medium"
                    href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
                  >
                    Jobs
                    <HiringBadge className="ml-1" />
                  </OutLink>
                </li>
              )}
            </ul>
            <VerticalBar />
            <DarkThemeToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
