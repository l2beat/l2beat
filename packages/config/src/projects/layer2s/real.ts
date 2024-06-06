import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('real')

export const real: Layer2 = orbitStackL2({
  discovery,
  display: {
    name: 'Re.al',
    slug: 'real',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'Re.al is an Arbitrum Orbit stack L2 with AnyTrust data availability, focusing on Real World Assets.',
    purposes: ['RWA', 'Universal'],
    links: {
      websites: ['https://re.al'],
      apps: ['https://re.al/bridge', 'https://re.al/app/bridge'],
      documentation: ['https://docs.re.al/'],
      explorers: ['https://explorer.re.al'],
      repositories: ['https://github.com/re-al-Foundation'],
      socialMedia: [
        'https://x.com/real_rwa',
        'https://discord.gg/cKCCCFXvWj',
        'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'real',
    chainId: 111188,
    explorerUrl: 'https://explorer.re.al',
    explorerApi: {
      url: 'https://explorer.re.al/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 695,
        version: '3',
      },
    ],
    minTimestampForTvl: new UnixTime(1710580715),
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  rpcUrl: 'https://real.drpc.org',
  // nativeToken: 'reETH', // not on coingecko yet
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0xfC89B875970122E24C6C5ADd4Dea139443943ea7'),
      tokens: '*',
      description:
        "Default Gateway for non-native tokens. On depositing, a generic 'wrapped' version of the escrowed token is minted on the L2.",
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x679D4C1cC6855C57726BEA1784F578315d6431f6'),
      tokens: ['stETH'],
      description:
        'This contract escrows the stETH that was deposited to mint reETH.',
    }),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('StrategyManager'),
    discovery.getContractDetails(
      'RealVault',
      'This contract is responsible for managing deposit, withdrawal, and settlement processes for the assets backing reETH using the ERC4626 (tokenized vault) standard.',
    ),
    discovery.getContractDetails(
      'AssetsVault',
      'This escrow contract receives ETH that users bridge to Re.al L2. This ETH is then converted to yielding assets using the StrategyManager.',
    ),
    discovery.getContractDetails(
      'Bridger',
      'A Routing contract to the standard orbit stack bridge of the L2.',
    ),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'GelatoMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'RealVault Owner EOA',
      accounts: [discovery.getPermissionedAccount('RealVault', 'owner')],
      description:
        'Can migrate the vault to a new contract, withdraw all ETH in the AssetVault and mint unlimited reETH, potentially stealing all user funds.',
    },
  ],
  milestones: [
    {
      name: 'Re.al Mainnet Launch',
      link: 'https://mirror.xyz/0xBE105a62f39a2E0b09772C49E3EcF6ef21BEd85C/FL4Ewx3CKsFEfMFsU7DZ-cIdhZc05aChfASQ1t-SQ-A',
      date: '2024-05-15T00:00:00Z',
      description:
        'Re.al launches its mainnet with some initial dapps deployed.',
    },
  ],
})
