import React, { useEffect } from 'react'

import { configureHoverableDropdown } from '../../scripts/configureHoverableDropdown'
import { hoverOver } from '../../utils/storybook/hoverOver'
import { ProjectLink } from '../icons'
import { DesktopProjectLinks as DesktopProjectLinksComponent } from './DesktopProjectLinks'

export default {
  title: 'Components/DesktopProjectLinks',
}

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

export const DesktopProjectLinks = () => {
  useEffect(() => {
    configureHoverableDropdown()
    hoverOver('.HoverableDropdownToggle')
  }, [])

  return <DesktopProjectLinksComponent projectLinks={links} />
}
