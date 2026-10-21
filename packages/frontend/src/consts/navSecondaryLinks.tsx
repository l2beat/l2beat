import compact from 'lodash/compact'
import { HiringBadge } from '~/components/badge/HiringBadge'
import type { NavLink } from '~/components/nav/types'
import { externalLinks } from '~/consts/externalLinks'
import { env } from '~/env'

export const navSecondaryLinks: NavLink[] = compact([
  {
    title: 'About Us',
    href: '/about-us',
  },
  {
    title: 'Publications',
    href: '/publications',
  },
  {
    title: 'Changelog',
    href: '/changelog',
  },
  {
    title: 'Forum',
    href: externalLinks.forum,
  },
  {
    title: 'Donate',
    href: '/donate',
  },
  {
    title: 'Governance',
    href: '/governance',
  },
  {
    title: 'Native Rollups',
    href: '/native-rollups',
  },
  {
    title: 'Tools',
    href: externalLinks.tools,
  },
  {
    title: 'Glossary',
    href: '/glossary',
  },
  {
    title: 'Jobs',
    href: externalLinks.jobs,
    accessory: env.CLIENT_SIDE_SHOW_HIRING_BADGE ? <HiringBadge /> : undefined,
  },
  {
    title: 'Brand Kit',
    href: '/brand-kit',
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
])
