import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../components/PageContent'
import { Tooltip } from '../../components/Tooltip'
import { configureTabs } from '../../scripts/configureTabs'
import { configureTooltips } from '../../scripts/configureTooltips'
import { click } from '../../utils/storybook/click'
import { BridgesRiskView } from './BridgesRiskView'

const meta = {
  title: 'Pages/Bridges/RiskView',
  component: BridgesRiskView,
  decorators: [
    (Story) => {
      return (
        <>
          <PageContent>
            <Story />
          </PageContent>
          <Tooltip />
        </>
      )
    },
  ],
  args: {
    items: [
      {
        type: 'bridge',
        name: 'Sollet',
        slug: 'sollet',
        warning:
          'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
        isArchived: true,
        isVerified: true,
        category: 'Token Bridge',
        destination: { value: 'Solana', description: '' },
        validatedBy: {
          value: 'Third Party',
          description: 'Withdrawals need to be signed by an EOA account.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'No',
          description: 'Source code is not upgradeable',
        },
        destinationToken: {
          value: 'Wrapped',
          description:
            'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading. Sollet Bridge and its wrapped asset are deprecated in favor of assets bridged via Wormhole.',
          sentiment: 'bad',
        },
      },
      {
        type: 'bridge',
        name: 'Sollet.unverfied',
        slug: 'sollet',
        warning:
          'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
        isArchived: true,
        isVerified: false,
        category: 'Token Bridge',
        destination: { value: 'Solana', description: '' },
        validatedBy: {
          value: 'Third Party',
          description: 'Withdrawals need to be signed by an EOA account.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'No',
          description: 'Source code is not upgradeable',
        },
        destinationToken: {
          value: 'Wrapped',
          description:
            'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading. Sollet Bridge and its wrapped asset are deprecated in favor of assets bridged via Wormhole.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'L2.Finance-zk',
        slug: 'layer2financezk',
        warning:
          'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
        isArchived: true,
        isVerified: false,
        category: 'Validium',
        destination: { value: 'L2.Finance-zk', description: '' },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
      },
      {
        type: 'bridge',
        name: 'pNetwork',
        slug: 'pnetwork',
        warning:
          'TVL of the bridge does not take into the account pTokens minted on Ethereum. These are wrapped tokens that should be backed 1:1 with their native counterparts on    other chains, for example pBTC being backed by BTC on  Bitcoin or pFTM backed by FTM on Fantom.',
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Various',
          description:
            'Algorand,\n' +
            'Polygon,\n' +
            'Arbitrum,\n' +
            'Bitcoin,\n' +
            'BSC,\n' +
            'EOS,\n' +
            'Telos,\n' +
            'xDAI,\n' +
            'Ultra,\n' +
            'Fio,\n' +
            'Fantom,\n' +
            'Phoenix',
        },
      },
      {
        type: 'bridge',
        name: 'Poly Bridge',
        slug: 'polynetwork',
        warning: undefined,
        isArchived: undefined,
        isVerified: false,
        category: 'Token Bridge',
        destination: { value: 'Various', description: '' },
        validatedBy: {
          value: 'Third Party',
          description: '3/4 MultiSig of PolyNetwork Keepers',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description: 'Contracts can be upgraded',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Wrapped',
          description:
            'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'Boba Network',
        slug: 'bobanetwork',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        isArchived: undefined,
        isVerified: true,
        category: 'Optimistic Rollup',
        destination: { value: 'Boba Network', description: '' },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
        },
        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH and BOBA transferred via this bridge are used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
      },
    ],
  },
} satisfies Meta<typeof BridgesRiskView>
export default meta

type Story = StoryObj<typeof BridgesRiskView>

export const Active: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#active')
      }, [])
      return <Story />
    },
  ],
}

export const ActiveWithCanonicalBridges: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#active')
        click('#combined-bridges')
      }, [])
      return <Story />
    },
  ],
}

export const Archived: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#archived')
      }, [])
      return <Story />
    },
  ],
}

export const ArchivedWithCanonicalBridges: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#archived')
        click('#combined-bridges')
      }, [])
      return <Story />
    },
  ],
}
