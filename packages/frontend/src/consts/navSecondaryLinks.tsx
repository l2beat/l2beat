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
    title: 'Native rollups',
    href: '/native-rollups',
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
]
