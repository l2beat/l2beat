import type { NavLink } from '~/components/nav/types'
import { externalLinks } from '~/consts/externalLinks'

export const navSecondaryLinks: NavLink[] = [
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
    title: 'Native Rollups',
    href: '/native-rollups',
  },
  {
    title: 'Jobs',
    href: externalLinks.jobs,
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
]
