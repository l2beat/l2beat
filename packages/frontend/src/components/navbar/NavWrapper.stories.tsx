import { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import React from 'react'
import { configureThemeToggle } from '../../scripts/configureThemeToggle'
import { NavWrapper } from './NavWrapper'
import { withPageBuildContext } from './navigationContext'

const meta: Meta<typeof NavWrapper> = {
  component: NavWrapper,
  argTypes: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        configureThemeToggle()
      }, [])
      return withPageBuildContext(
        {
          config: {
            features: {
              activity: true,
              liveness: true,
              finality: true,
              banner: true,
              tvlBreakdown: true,
              implementationChange: true,
              gitcoinOption: true,
              hiringBadge: true,
              buildAllProjectPages: true,
              governancePage: true,
              costsPage: true,
              zkCatalog: true,
              tvl2: true,
              glossary: true,
            },
            links: {
              twitter: 'test',
              discord: 'test',
              github: 'test',
              linkedin: 'test',
              youTube: 'test',
              medium: 'test',
              forum: 'test',
              multisigReport: 'test',
            },
            backend: {
              apiUrl: '',
              mock: true,
              skipCache: false,
            },
            layer2s: [],
            layer3s: [],
            bridges: [],
            zkCatalogProjects: [],
            milestones: [],
          },
          path: '',
        },
        () => <Story />,
      )
    },
  ],
  args: {},
}
export default meta
type Story = StoryObj<typeof NavWrapper>

export const Primary: Story = {}
