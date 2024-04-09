import React from 'react'

import { ConfigFeatures } from '../../build/config/Config'
import {
  getScalingNavigationPages,
  NavigationPage,
} from '../../utils/getNavigationPages'
import { NewItemBadge } from '../badge/NewItemBadge'
import { RiskIcon, SummaryIcon } from '../icons'
import { MenuCloseIcon } from '../icons/symbols/MenuCloseIcon'
import { Logo } from '../Logo'
import { PlainLink } from '../PlainLink'
import { DarkThemeToggle } from './DarkThemeToggle'
import { HiringBadge } from './HiringBadge'
import { SocialLinks, SocialLinksProps } from './SocialLinks'
import { NavbarPage } from './types'

export interface SidebarMenuProps {
  selectedPage: NavbarPage
  features: ConfigFeatures
  forumLink: string
  socialLinks: SocialLinksProps
}

interface Section {
  title: string
  items: NavigationPage[]
}

function getSections(props: SidebarMenuProps): Section[] {
  return [
    {
      title: 'Scaling',
      items: getScalingNavigationPages(props.features),
    },
    {
      title: 'Bridges',
      items: [
        {
          fullTitle: 'Summary',
          link: '/bridges/summary',
          icon: SummaryIcon,
        },
        {
          fullTitle: 'Risks',
          link: '/bridges/risk',
          icon: RiskIcon,
        },
      ],
    },
  ]
}

export function SidebarMenu(props: SidebarMenuProps) {
  const sections = getSections(props)

  return (
    <div
      id="sidebar-menu"
      className="fixed inset-y-0 left-0 z-999 flex w-full translate-x-full flex-col bg-white text-base transition-transform duration-300 dark:bg-black lg:hidden"
    >
      <div className="mt-[11.5px] flex items-center justify-between px-4">
        <a href={props.selectedPage === 'bridges' ? '/bridges/summary' : '/'}>
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
        <Sections sections={sections} />
        <hr className="mb-6 mt-8 w-full border-gray-200 dark:border-gray-850" />
        <AdditionalSections {...props} />
        <hr className="my-6 w-full border-gray-200 dark:border-gray-850" />
        <ul className="mb-12 flex gap-4 px-6">
          <SocialLinks {...props.socialLinks} />
        </ul>
      </div>
    </div>
  )
}

function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <div className="mt-8 px-6" key={section.title}>
          <div className="mb-4 text-sm font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200">
            {section.title}
          </div>
          <ul className="ml-4 flex flex-col gap-4">
            {section.items.map((item) => (
              <li key={item.fullTitle}>
                <PlainLink
                  href={item.link}
                  className="flex items-center gap-2 font-medium"
                >
                  <item.icon className="h-auto w-4" />
                  {item.fullTitle}
                  {item.new && <NewItemBadge />}
                </PlainLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

interface AdditionalSectionProps {
  forumLink: string
  features: ConfigFeatures
}
function AdditionalSections(props: AdditionalSectionProps) {
  return (
    <ul className="flex flex-col gap-4 px-6 text-sm font-medium">
      <li>
        <PlainLink href={props.forumLink}>Forum</PlainLink>
      </li>
      <li>
        <PlainLink href="/donate">Donate</PlainLink>
      </li>
      <li>
        {props.features.governancePage ? (
          <PlainLink href="/governance">Governance</PlainLink>
        ) : (
          <PlainLink href="https://l2beat.notion.site/Delegate-your-votes-to-L2BEAT-8ffc452bed9a431cb158d1e4e19839e3">
            Governance
          </PlainLink>
        )}
      </li>
      <li>
        <PlainLink href="/glossary">Glossary</PlainLink>
      </li>
      <li>
        <PlainLink href="/faq">FAQ</PlainLink>
      </li>
      <li>
        <PlainLink
          className="flex items-center"
          href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f"
        >
          Jobs
          {props.features.hiringBadge && <HiringBadge className="ml-2" />}
        </PlainLink>
      </li>
    </ul>
  )
}
