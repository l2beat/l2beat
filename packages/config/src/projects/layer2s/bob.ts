import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('bob')

export const bob: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'BOB',
    slug: 'bob',
    description:
      'BOB ("Build on Bitcoin") is an OP Stack rollup that aims to natively support the Bitcoin stack. The current implementation includes the tBTC-v2 LightRelay smart contract for verifying Bitcoin transaction proofs and block headers onchain and a variety of supported bridges for BTC-related assets.',
    purposes: ['Bitcoin DApps'],
    links: {
      websites: ['https://gobob.xyz'],
      apps: ['https://app.gobob.xyz'],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://explorer.gobob.xyz?'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: ['https://twitter.com/build_on_bob'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'RollupOwnerMultisig',
      "Owner of the ProxyAdmin and the rollup system. It can upgrade the main bridge's implementation potentially gaining access to the funds therein, and change any rollup system component.",
    ),
    ...discovery.getMultisigPermission(
      'UsdcBridgeOwnerMultisig',
      "Owner of the ProxyAdmin and the rollup system. It can upgrade the main bridge's implementation potentially gaining access to the funds therein, and change any rollup system component.",
    ),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x091dF5E1284E49fA682407096aD34cfD42B95B72'),
      tokens: ['wstETH'],
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb'),
      tokens: ['USDC'],
      description: 'USDC Vault.',
      upgradableBy: ['UsdcBridgeOwnerMultisig'],
      upgradeDelay: 'instant',
    }),
  ],
  usesBlobs: true,
  genesisTimestamp: new UnixTime(1712861989),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      name: 'Phase 1: Optimistic BOB',
      link: 'https://docs.gobob.xyz/docs/learn/bob-stack/op-stack',
      date: '2024-05-01T00:00:00Z',
      description: 'BOB bootstrapping as an Optimistic Rollup on Ethereum.',
    },
  ],
  rpcUrl: 'https://rpc.gobob.xyz/',
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    explorerUrl: 'https://explorer.gobob.xyz',
    explorerApi: {
      url: 'https://explorer.gobob.xyz/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1712861989),
  },
})
