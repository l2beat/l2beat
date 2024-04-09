import React from 'react'

import { Config } from '../../build/config'
import { ConfigFeatures } from '../../build/config/Config'
import { MenuOpenIcon } from '../icons'
import { Logo } from '../Logo'
import { PlainLink } from '../PlainLink'
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
  features: ConfigFeatures
  forumLink: string
  socialLinks: SocialLinksProps
  selectedPage: NavbarPage
}

export function getNavbarProps(
  config: Config,
  selectedPage: NavbarPage,
): NavbarProps {
  return {
    features: config.features,
    forumLink: config.links.forum,
    socialLinks: getSocialLinksProps(config),
    selectedPage,
  }
}

export function Navbar(props: NavbarProps) {
  return (
    <>
      <SidebarMenu
        selectedPage={props.selectedPage}
        features={props.features}
        forumLink={props.forumLink}
        socialLinks={props.socialLinks}
      />
      {props.features.banner && <Banner />}
      <div className="h-14 border-b border-gray-200 text-base dark:border-gray-850 lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-12">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <a
                href={
                  props.selectedPage === 'bridges' ? '/bridges/summary' : '/'
                }
              >
                <Logo className="h-8 w-auto" />
              </a>
            </li>
            <li className="h-full">
              <PageLink
                selected={props.selectedPage === 'scaling'}
                large
                href="/scaling/summary"
              >
                Scaling
              </PageLink>
            </li>
            <li className="h-full">
              <PageLink
                selected={props.selectedPage === 'bridges'}
                large
                href="/bridges/summary"
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
                <PlainLink
                  className="flex h-full items-center px-2 font-medium"
                  href={props.forumLink}
                >
                  Forum
                </PlainLink>
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
                {props.features.governancePage ? (
                  <PageLink
                    selected={props.selectedPage === 'governance'}
                    href="/governance"
                  >
                    Governance
                  </PageLink>
                ) : (
                  <PageLink href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3">
                    Governance
                  </PageLink>
                )}
              </li>
              <li className="h-full">
                <PageLink
                  selected={props.selectedPage === 'glossary'}
                  href="/glossary"
                >
                  Glossary
                </PageLink>
              </li>
              <li className="h-full">
                <PageLink selected={props.selectedPage === 'faq'} href="/faq">
                  FAQ
                </PageLink>
              </li>
              <li className="h-full">
                <PlainLink
                  className="flex h-full items-center px-2 font-medium"
                  href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
                >
                  Jobs
                  {props.features.hiringBadge && (
                    <HiringBadge className="ml-1" />
                  )}
                </PlainLink>
              </li>
            </ul>
            <VerticalBar />
            <DarkThemeToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
