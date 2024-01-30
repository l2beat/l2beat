import { Meta, StoryObj } from '@storybook/react'
import range from 'lodash/range'
import React, { useEffect } from 'react'

import { onlyMobileModes } from '../../../../.storybook/modes'
import { ScalingDetailsSection } from '../../../pages/scaling/projects/props/getProjectDetails'
import { configureMobileProjectNavigation } from '../../../scripts/section-navigation/configureMobileProjectNavigation'
import { MobileProjectNavigation } from './MobileProjectNavigation'

const sections: ScalingDetailsSection[] = range(10).map(() => ({
  type: 'DetailedDescriptionSection',
  props: {
    id: 'detailed-description',
    title: 'Example',
    sectionOrder: 1,
    issueLink:
      'https://github.com/l2beat/l2beat/issues/new?title=Problem: zkSync Era project page&labels=website',
    editLink:
      'https://github.com/l2beat/l2beat/edit/main/packages/config/src/layer2s/zksync-era.ts',
    description:
      'zkSync Era is a general-purpose zk-rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.',
    detailedDescription:
      'It implements standard Web3 API and it preserves key EVM features such as smart contract composability while introducing some new concept such as native account abstraction.',
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
      modes: onlyMobileModes,
    },
  },
}
export default meta
type Story = StoryObj<typeof MobileProjectNavigation>

export const Primary: Story = {}
