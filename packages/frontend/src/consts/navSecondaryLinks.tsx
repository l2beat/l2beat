import compact from 'lodash/compact'
import { HiringBadge } from '~/components/badge/HiringBadge'
import { ChangelogUnreadBadge } from '~/components/changelog/ChangelogUnreadBadge'
import type { NavLink } from '~/components/nav/types'
import { externalLinks } from '~/consts/externalLinks'
import { env } from '~/env'

export const navSecondaryLinks: NavLink[] = compact([
  {
    title: 'Publications',
    href: '/publications',
  },
  {
    title: 'Changelog',
    href: '/changelog',
    accessory: <ChangelogUnreadBadge />,
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
    accessory: env.CLIENT_SIDE_SHOW_HIRING_BADGE ? <HiringBadge /> : undefined,
  },
  {
    title: 'FAQ',
    href: '/faq',
  },
])
