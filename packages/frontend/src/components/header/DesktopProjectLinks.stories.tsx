import { Meta, StoryObj } from '@storybook/react'

import { allModes } from '../../../.storybook/modes'
import { ProjectLink } from '../icons'
import { DesktopProjectLinks as DesktopProjectLinksComponent } from './DesktopProjectLinks'

const meta: Meta<typeof DesktopProjectLinksComponent> = {
  component: DesktopProjectLinksComponent,
  parameters: {
    chromatic: {
      modes: {
        'light desktop': allModes['light desktop'],
        'dark desktop': allModes['dark desktop'],
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof DesktopProjectLinksComponent>

const links: ProjectLink[] = [
  { name: 'Website', links: ['https://bridge.gnosischain.com/'] },
  { name: 'App', links: ['https://bridge.gnosischain.com/'] },
  {
    name: 'Documentation',
    links: ['https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge'],
  },
  {
    name: 'Explorer',
    links: [
      'https://blockscout.com/xdai/mainnet',
      'https://gnosisscan.io/',
      'https://explorer.anyblock.tools/ethereum/poa/xdai/',
      'https://beacon.gnosischain.com/',
      'https://xdai.tokenview.io/',
    ],
  },
  { name: 'Repository', links: ['https://github.com/gnosischain'] },
  {
    name: 'Social',
    links: [
      'https://twitter.com/gnosischain',
      'https://discord.gg/VQb3WzsywU',
      'https://t.me/gnosischain',
    ],
  },
]

export const DesktopProjectLinks: Story = {
  args: {
    projectLinks: links,
  },
}
