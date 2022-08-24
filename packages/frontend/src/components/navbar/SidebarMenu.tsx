import classNames from 'classnames'
import React from 'react'

import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { OtherLinks } from './OtherLinks'
import { SocialLinks } from './SocialLinks'

export function SidebarMenu() {
  return (
    <>
      <div
        id="sidebar-menu"
        className={classNames(
          'hidden fixed top-0 left-0 z-50',
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
                <a href="/">Total Value Locked</a>
              </li>
              <li>
                <a href="/?view=risk">Risks</a>
              </li>
            </ul>
          </li>
          <OtherLinks />
          <li>
            <ul className="flex gap-4">
              <SocialLinks />
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
