import { Meta, StoryObj } from '@storybook/react'
import range from 'lodash/range'
import React, { useEffect } from 'react'

import { allModes } from '../../../../.storybook/modes'
import { ScalingDetailsSection } from '../../../pages/scaling/projects/props/getProjectDetails'
import { configureDesktopProjectNavigation } from '../../../scripts/section-navigation/configureDesktopProjectNavigation'
import { DesktopProjectNavigation } from './DesktopProjectNavigation'

const sections: ScalingDetailsSection[] = range(10).map(() => ({
  type: 'DescriptionSection',
  props: {
    id: 'description',
    title: 'Example',
    issueLink:
      'https://github.com/l2beat/l2beat/issues/new?title=Problem: zkSync Era project page&labels=website',
    editLink:
      'https://github.com/l2beat/l2beat/edit/master/packages/config/src/layer2s/zksync-era.ts',
    warning:
      'Withdrawals are delayed by 1d. The length of the delay can be arbitrarily set by a MultiSig.',
    description:
      'zkSync Era is a general-purpose zk-rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.      It implements standard Web3 API and it preserves key EVM features such as smart contract composability while introducing some new concept such as native account abstraction.',
    isVerified: true,
  },
}))

const meta: Meta<typeof DesktopProjectNavigation> = {
  component: DesktopProjectNavigation,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureDesktopProjectNavigation()
      }, [])
      return <Story />
    },
  ],
  args: {
    project: { title: 'Arbitrum One', icon: '/icons/arbitrum.png' },
    sections,
  },
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
type Story = StoryObj<typeof DesktopProjectNavigation>

export const WithoutProjectHeader: Story = {
  decorators: [
    (Story) => (
      <div className="mt-12">
        <Story />
      </div>
    ),
  ],
}
export const WithProjectHeader: Story = {}
