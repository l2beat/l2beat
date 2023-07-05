import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../components/PageContent'
import { Tooltip } from '../../components/Tooltip'
import { configureCanonicalBridgesFilter } from '../../scripts/configureCanonicalBridgesFilter'
import { configureTableIndexRerender } from '../../scripts/configureTableIndexRerender'
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
        type: 'layer2',
        name: 'ZKSwap 1.0',
        slug: 'zkswap',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
        category: 'ZK Rollup',
        destination: {
          value: 'ZKSwap 1.0',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: '8 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
      },
      {
        type: 'layer2',
        name: 'Polygon Hermez',
        slug: 'hermez',
        warning:
          'Hermez and Polygon have recently merged. Hermez and Polygon Hermez are two names for the same rollup.',
        isArchived: true,
        isVerified: true,
        category: 'ZK Rollup',
        destination: {
          value: 'Polygon Hermez',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Canonical',
          description:
            'Tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: '7 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
      },
      {
        type: 'bridge',
        name: 'Wormhole V1',
        slug: 'wormholev1',
        warning: undefined,
        isArchived: true,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Various',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description:
            'Transfers need to be signed offchain by a set of 2/3 of Guardians and then in a permissionless way relayed to the destination chain.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'No',
          description: '',
          sentiment: 'good',
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
        name: 'ZKSwap 2.0',
        slug: 'zkswap2',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
        category: 'ZK Rollup',
        destination: {
          value: 'ZKSwap 2.0',
          description: '',
          sentiment: 'good',
        },
        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: '8 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
      },
      {
        type: 'layer2',
        name: 'Gluon',
        slug: 'gluon',
        warning:
          'LeverJ trading platform appears to be in a maintenance mode as the team moved to build NFT trading platform. Social medias associated with the project are silent since mid 2021.',
        isArchived: true,
        isVerified: true,
        category: 'Plasma',
        destination: { value: 'Gluon', description: '', sentiment: 'neutral' },

        destinationToken: {
          value: 'Canonical',
          description:
            'Tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'OMG Network',
        slug: 'omgnetwork',
        warning: undefined,
        isArchived: true,
        isVerified: false,
        category: 'Plasma',
        destination: {
          value: 'OMG Network',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'OMG transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
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
        name: 'Connext (Legacy)',
        slug: 'connext-legacy',
        warning: undefined,
        isArchived: true,
        isVerified: true,
        category: 'Liquidity Network',
        destination: {
          value: 'Various',
          description:
            'Avalanche,\n' +
            'BNB Chain,\n' +
            'Polygon,\n' +
            'Avalanche,\n' +
            'Fantom,\n' +
            'Gnosis Chain,\n' +
            'Arbitrum One,\n' +
            'Arbitrum Nova',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'User',
          description: 'Transfer is done via peer-to-peer atomic swap',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: 'No',
          description: '',
          sentiment: 'good',
        },
        destinationToken: {
          value: 'Canonical',
          description:
            'Tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
      },
      {
        type: 'bridge',
        name: 'Nomad',
        slug: 'nomad',
        warning:
          'The Nomad token bridge contract has recently been exploited and currently is not operational.',
        isArchived: true,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Various',
          description: 'Avalanche,\nEvmos,\nMilkomedia C1,\nMoonbeam',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Optimistically',
          description:
            'Messages are relayed to the destination chain and assumed to be correct unless challenged within the 20 min fraud proof window.',
          sentiment: 'warning',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description: 'Bridge can be upgraded by 3/5 MultiSig.',
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
        name: 'L2.Finance-zk',
        slug: 'layer2financezk',
        warning:
          'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
        isArchived: true,
        isVerified: false,
        category: 'Validium',
        destination: {
          value: 'L2.Finance-zk',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Canonical',
          description:
            'Tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
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
        name: 'Sollet',
        slug: 'sollet',
        warning:
          'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
        isArchived: true,
        isVerified: true,
        category: 'Token Bridge',
        destination: { value: 'Solana', description: '', sentiment: 'neutral' },
        validatedBy: {
          value: 'Third Party',
          description: 'Withdrawals need to be signed by an EOA account.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'No',
          description: 'Source code is not upgradeable',
          sentiment: 'good',
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
        name: 'Arbitrum One',
        slug: 'arbitrum',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        isArchived: undefined,
        isVerified: true,
        category: 'Optimistic Rollup',
        destination: {
          value: 'Arbitrum One',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: '13d or no delay',
          description:
            'There is a 13 days delay for upgrades initiated by the DAO that can be canceled by the 9/12 Security Council multisig. This multisig can also upgrade with no delay',
          sentiment: 'warning',
        },
      },
      {
        type: 'bridge',
        name: 'Polygon PoS',
        slug: 'polygon-pos',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Polygon',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Destination Chain',
          description:
            'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
          sentiment: 'warning',
        },
        sourceUpgradeability: {
          value: '48 hours delay',
          description:
            'The bridge can be upgraded by 5/9 MSig after 48 hour delay.',
          sentiment: 'warning',
        },
        destinationToken: {
          value: 'Canonical or Wrapped',
          description:
            'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading. Tokens transferred end up as ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
          sentiment: 'warning',
        },
      },
      {
        type: 'layer2',
        name: 'Optimism',
        slug: 'optimism',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        isArchived: undefined,
        isVerified: true,
        category: 'Optimistic Rollup',
        destination: {
          value: 'Optimism',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
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
        name: 'Polygon "Plasma"',
        slug: 'polygon-plasma',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Polygon',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Destination Chain',
          description:
            'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
          sentiment: 'warning',
        },
        sourceUpgradeability: {
          value: '48 hours delay',
          description:
            'The bridge can be upgraded by 5/9 MSig after 48 hour delay.',
          sentiment: 'warning',
        },
        destinationToken: {
          value: 'Native & Canonical',
          description:
            'MATIC transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
      },
      {
        type: 'bridge',
        name: 'Ronin V2',
        slug: 'ronin',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Axie Infinity Chain',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description: '2/3 MultiSig',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description: 'Gateway Proxy can be upgraded by a 2/3 MultiSig.',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Canonical',
          description:
            'Tokens transferred are considered canonical on the destination chain. The Ronin explorer does not show contract source code!',
          sentiment: 'warning',
        },
      },
      {
        type: 'bridge',
        name: 'Avalanche Bridge',
        slug: 'avalanche',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Avalanche',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description: '6/8 Intel SGX',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'EOA',
          description: 'Avalanche Bridge uses EOA for Escrow',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Wrapped',
          description:
            'Tokens transferred end up as wrapped ERC20 proxies, the contract is named BridgeToken',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'dYdX',
        slug: 'dydx',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'ZK Rollup',
        destination: { value: 'dYdX', description: '', sentiment: 'neutral' },

        destinationToken: {
          value: 'Canonical',
          description:
            'USDC transferred is considered canonical as it is the basis of the perpetual protocol on the chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
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
        name: 'Multichain',
        slug: 'multichain',
        warning:
          'In July 2021 millions of dollars of user funds from the Multichain escrow addresses were taken out by validators to supply liquidity to Any tokens on various chains.       Multichain declares it as a shared liquidity managed by SMPC tool to promote the routing paths between chains and help reduce bridge fee for users.      As a result there is more tokens minted (e.g. DAI on Fantom) than there are tokens directly backing them in escrow.',
        isArchived: undefined,
        isVerified: true,
        category: 'Hybrid',
        destination: {
          value: 'Various',
          description:
            'Optimism,\n' +
            'Gnosis,\n' +
            'Smart Bitcoin Cash,\n' +
            'ETHPoW,\n' +
            'CLV Parachain,\n' +
            'Conflux eSpace,\n' +
            'Velas EVM,\n' +
            'ThunderCore,\n' +
            'Metis Andromeda,\n' +
            'Fuse,\n' +
            'Huobi ECO Chain,\n' +
            'Moonbeam,\n' +
            'Moonriver,\n' +
            'Boba Network Bobabeam,\n' +
            'Polygon,\n' +
            'Harmony Shard 0,\n' +
            'BitTorrent Chain,\n' +
            'Dogechain,\n' +
            'Milkomeda C1,\n' +
            'Rangers Protocol,\n' +
            'Kava EVM,\n' +
            'Dithereum,\n' +
            'MintMe.com,\n' +
            'Cronos Mainnet Beta,\n' +
            'Fantom,\n' +
            'CMP,\n' +
            'Boba Network,\n' +
            'RSK,\n' +
            'KCC,\n' +
            'Fusion,\n' +
            'Shiden,\n' +
            'Telos EVM,\n' +
            'Arbitrum One,\n' +
            'Arbitrum Nova,\n' +
            'Celo,\n' +
            'Oasis Emerald ParaTime,\n' +
            'Avalanche C-Chain,\n' +
            'IoTeX Network,\n' +
            'REI,\n' +
            'Goerli,\n' +
            'Binance Smart Chain,\n' +
            'Syscoin,\n' +
            'Ontology,\n' +
            'Astar,\n' +
            'Ethereum Classic,\n' +
            'OKXChain,\n' +
            'Godwoken,\n' +
            'Klaytn Mainnet Cypress,\n' +
            'GateChain,\n' +
            'TomoChain,\n' +
            'Evmos,\n' +
            'Near,\n' +
            'XRP',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description: '2/3rd of MPC.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'No / EOA',
          description:
            'Depending on the router configuration escrow contracts are EOAs or Any tokens which cannot be upgraded.',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Canonical or Wrapped',
          description:
            'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading. Depending on the router configuration either Multichain tokens or Any tokens are minted.',
          sentiment: 'warning',
        },
      },
      {
        type: 'bridge',
        name: 'Rainbow Bridge',
        slug: 'near',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Near, Aurora',
          description: '',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Destination Chain',
          description:
            'Transfers out of the bridge are validated using Optimistic Light Client of Near Chain on Ethereum. Transfers into NEAR are validated by Ethereum light client on NEAR side.',
          sentiment: 'warning',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'Bridge cannot be upgraded but 3/6 Admin Multisig can move all funds out of the bridge via admin functions with no warning.',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Canonical or Wrapped',
          description:
            'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading. Tokens minted on AURORA do not appear to be verified on aurorascan.dev.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'zkSync Era',
        slug: 'zksync-era',
        warning:
          'Withdrawals are delayed by 1d. The length of the delay can be arbitrarily set by a MultiSig.',
        isArchived: undefined,
        isVerified: true,
        category: 'ZK Rollup',
        destination: {
          value: 'zkSync Era',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'ETH transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice by the governor, that currently is a 4 / 7 Multisig.',
          sentiment: 'bad',
        },
      },
      {
        type: 'bridge',
        name: 'Portal (Wormhole)',
        slug: 'portal',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Various',
          description:
            'Acala,\n' +
            'Algorand,\n' +
            'Aurora,\n' +
            'Avalanche,\n' +
            'Binance Smart Chain,\n' +
            'Celo,\n' +
            'Ethereum,\n' +
            'Fantom,\n' +
            'Karura,\n' +
            'Klaytn,\n' +
            'Moonbeam,\n' +
            'Near,\n' +
            'Oasis,\n' +
            'Polygon',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description:
            'Transfers need to be signed offchain by a set of 2/3 of Guardians and then relayed to the destination chain.',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Canonical or Wrapped',
          description:
            'Some tokens transferred are considered canonical but some tokens are not. Users who wish to obtain the canonical counterparts need to do so by trading.',
          sentiment: 'warning',
        },
      },
      {
        type: 'bridge',
        name: 'Orbit Bridge',
        slug: 'orbit',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'Token Bridge',
        destination: {
          value: 'Various',
          description:
            'Orbit,\n' +
            'Klaytn,\n' +
            'BNB,\n' +
            'Avalanche,\n' +
            'Celo,\n' +
            'Fantom,\n' +
            'destination,\n' +
            'HECO,\n' +
            'ICON,\n' +
            'OKC,\n' +
            'Polygon',
          sentiment: 'neutral',
        },
        validatedBy: {
          value: 'Third Party',
          description: 'MultiSig, quorum depends on destination',
          sentiment: 'bad',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'Contract can be upgraded by 6/9 MultiSig. Bridge proxied implementation is not verified on Etherscan.',
          sentiment: 'bad',
        },
        destinationToken: {
          value: 'Wrapped',
          description:
            'Tokens transferred by the bridge are not canonical. Users who wish to obtain the canonical counterparts need to do so by trading. Tokens are minted as Orbit Bridge specific oTokens.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'Metis Andromeda',
        slug: 'metis',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.       Since April 2022 the transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system.       The optimistic challenge mechanism that allows Validators to force Sequencer to post missing data is not fully implemented yet.',
        isArchived: undefined,
        isVerified: true,
        category: 'Optimistic Chain',
        destination: {
          value: 'Metis Andromeda',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'METIS transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        sourceUpgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
      },
      {
        type: 'layer2',
        name: 'Loopring',
        slug: 'loopring',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        category: 'ZK Rollup',
        destination: {
          value: 'Loopring',
          description: '',
          sentiment: 'neutral',
        },

        destinationToken: {
          value: 'Native & Canonical',
          description:
            'LRC transferred via this bridge is used to pay for gas and other tokens transferred are considered canonical on the destination chain.',
          sentiment: 'good',
        },
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
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
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
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
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#active')
        click('#combined-bridges-checkbox')
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
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
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
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#archived')
        click('#combined-bridges-checkbox')
      }, [])
      return <Story />
    },
  ],
}
