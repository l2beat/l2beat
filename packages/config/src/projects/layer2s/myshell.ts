import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const myshell: Layer2 = upcomingL2({
  id: 'myshell',
  display: {
    name: 'MyShell L2',
    slug: 'myshell',
    description:
      'MyShell announced new L2 aimed to connect users, creators, and open-source AI model researchers, powered by EigenDA and OP Stack.',
    purposes: ['AI'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://myshell.ai/'],
      apps: [''],
      documentation: ['https://docs.myshell.ai/'],
      explorers: [''],
      repositories: [],
      socialMedia: [
        'https://twitter.com/myshell_ai',
        'https://discord.com/invite/myshell',
      ],
    },
  },
})
