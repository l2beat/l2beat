import classNames from 'classnames'
import React from 'react'

import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { OtherLinks } from './OtherLinks'
import { SocialLinks, SocialLinksProps } from './SocialLinks'

export interface SidebarMenuProps {
  showBanner: boolean
  forumLink: string
  socialLinks: SocialLinksProps
}

export function SidebarMenu(props: SidebarMenuProps) {
  return (
    <>
      <div
        id="sidebar-menu"
        className={classNames(
          'hidden fixed left-0 z-50',
          props.showBanner ? 'top-8' : 'top-0',
          'w-3/4 min-w-[240px] h-full',
          'p-4 pt-[22px] bg-white dark:bg-black',
        )}
      >
        <button id="sidebar-menu-close" className="block">
          <MenuCloseIcon className="block" aria-label="Close menu" />
        </button>
        <ul className="flex flex-col gap-4 mt-4">
          <li>
            <a className="font-bold" href="/">
              Scaling
            </a>
            <ul className="flex flex-col gap-4 mt-4 pl-4">
              <li>
                <a href="/scaling/tvl">Total Value Locked</a>
              </li>
              <li>
                <a href="/scaling/risk">Risks</a>
              </li>
            </ul>
          </li>
          <OtherLinks forumLink={props.forumLink} />
          <li>
            <ul className="flex gap-4">
              <SocialLinks {...props.socialLinks} />
            </ul>
          </li>
        </ul>
      </div>
      <div
        id="sidebar-menu-shadow"
        className={classNames(
          'hidden fixed top-0 left-0 z-40',
          'bg-black opacity-30 w-full h-full',
        )}
      ></div>
    </>
  )
}
