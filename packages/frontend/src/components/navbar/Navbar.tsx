import React from 'react'

import { Config } from '../../build/config'
import { MenuOpenIcon } from '../icons/symbols/MenuOpenIcon'
import { Logo } from '../Logo'
import { Banner } from './Banner'
import { DarkThemeToggle } from './DarkThemeToggle'
import { OtherLinks } from './OtherLinks'
import { SidebarMenu } from './SidebarMenu'
import {
  getSocialLinksProps,
  SocialLinks,
  SocialLinksProps,
} from './SocialLinks'

export interface NavbarProps {
  showBanner: boolean
  forumLink: string
  socialLinks: SocialLinksProps
}

export function getNavbarProps(config: Config): NavbarProps {
  return {
    showBanner: config.features.banner,
    forumLink: config.links.forum,
    socialLinks: getSocialLinksProps(config),
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
      <nav className="relative flex justify-between items-center h-[62px] py-2 px-4 md:px-12 border-b-bg-2 border-b-[1px]">
        <button id="sidebar-menu-open" className="block md:hidden">
          <MenuOpenIcon className="block" aria-label="Open menu" />
        </button>
        <ul className="hidden md:flex gap-5 items-center">
          <SocialLinks {...props.socialLinks} />
        </ul>
        <a
          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          href="/"
        >
          <Logo />
        </a>
        <div className="flex gap-6 items-center">
          <ul className="hidden md:flex gap-6 items-center">
            <OtherLinks forumLink={props.forumLink} />
          </ul>
          <div className="w-[1px] h-[32px] bg-bg-3 hidden md:block"></div>
          <DarkThemeToggle />
        </div>
      </nav>
    </>
  )
}
