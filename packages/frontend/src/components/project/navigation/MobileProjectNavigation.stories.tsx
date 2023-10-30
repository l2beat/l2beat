import { Meta, StoryObj } from '@storybook/react'
import range from 'lodash/range'
import React, { useEffect } from 'react'

import { allModes } from '../../../../.storybook/modes'
import { ScalingDetailsSection } from '../../../pages/scaling/projects/props/getProjectDetails'
import { configureMobileProjectNavigation } from '../../../scripts/section-navigation/configureMobileProjectNavigation'
import { MOBILE_PROJECT_NAVIGATION_IDS } from './ids'
import { MobileProjectNavigation } from './MobileProjectNavigation'

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

const meta: Meta<typeof MobileProjectNavigation> = {
  component: MobileProjectNavigation,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureMobileProjectNavigation()
      }, [])
      return <Story />
    },
  ],
  args: {
    sections,
  },
  parameters: {
    chromatic: {
      modes: {
        'light mobile': allModes['light mobile'],
        'dark mobile': allModes['dark mobile'],
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof MobileProjectNavigation>

export const ScrolledToStart: Story = {}

export const ScrolledToMiddle: Story = {
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const list = document.querySelector(
      `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
    )
    list?.scrollTo(list.scrollWidth / 2, 0)
  },
  parameters: {
    chromatic: {
      delay: 400,
    },
  },
}

export const ScrolledToEnd: Story = {
  play: () => {
    const list = document.querySelector(
      `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
    )
    list?.scrollTo(list.scrollWidth, 0)
  },
}
