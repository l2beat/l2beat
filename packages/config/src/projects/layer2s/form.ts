import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const form: Layer2 = upcomingL2({
  id: 'form',
  capability: 'universal',
  addedAt: new UnixTime(1717490033), // 2024-06-04T08:33:53Z
  display: {
    name: 'Form',
    slug: 'form',
    description:
      'Form is an Optimistic Rollup utilizing the OP Stack. The Form L2 is focused on bringing mass adoption and interoperability to the SocialFi category.',
    purposes: ['Universal', 'Social'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://form.network'],
      apps: ['https://bridge.form.network'],
      documentation: ['https://docs.form.network'],
      explorers: ['https://explorer.form.network'],
      socialMedia: [
        'https://x.com/0xform',
        'https://discord.com/invite/formnetwork',
        'https://t.me/formnetwork',
      ],
    },
  },
})
