import React from 'react'

import { MenuOpenIcon } from '../icons/symbols/MenuOpenIcon'
import { Logo } from '../Logo'
import { Banner } from './Banner'
import { DarkThemeToggle } from './DarkThemeToggle'
import { OtherLinks } from './OtherLinks'
import { SidebarMenu } from './SidebarMenu'
import { SocialLinks } from './SocialLinks'

export function Navbar() {
  return (
    <>
      <SidebarMenu />
      <nav className="relative flex justify-between items-center h-[68px] py-2">
        <button id="sidebar-menu-open" className="block md:hidden">
          <MenuOpenIcon className="block" aria-label="Open menu" />
        </button>
        <ul className="hidden md:flex gap-4 items-center">
          <SocialLinks />
        </ul>
        <a
          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          href="/"
        >
          <Logo />
        </a>
        <div className="flex gap-4 items-center">
          <ul className="hidden md:flex gap-4 items-center">
            <OtherLinks />
          </ul>
          <DarkThemeToggle />
        </div>
      </nav>
      <Banner />
    </>
  )
}
