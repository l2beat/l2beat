import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const myshell: ScalingProject = upcomingL2({
  id: 'myshell',
  capability: 'universal',
  addedAt: UnixTime(1716981396), // 2024-05-29T11:16:36Z
  display: {
    name: 'MyShell L2',
    slug: 'myshell',
    description:
      'MyShell announced new L2 aimed to connect users, creators, and open-source AI model researchers, powered by EigenDA and OP Stack.',
    purposes: ['AI'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://myshell.ai/'],
      documentation: ['https://docs.myshell.ai/'],
      socialMedia: [
        'https://twitter.com/myshell_ai',
        'https://discord.com/invite/myshell',
      ],
      bridges: ['https://bridge.myshell.ai/'],
      explorers: ['https://myshell-testnet-explorer.alt.technology'],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
