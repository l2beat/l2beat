import { formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('fraxtal')

const timelockDelay = formatSeconds(
  discovery.getContractValue('Timelock', 'delay'),
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const fraxtal: Layer2 = opStackL2({
  daProvider: {
    name: 'FraxtalDA',
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Fraxtal uses a separate data availability module developed by the Frax Core Team, and data availability attestations are not published on chain.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is not published on chain, and currently not publicly accessible',
      description:
        'Fraxtal uses a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
      references: [
        {
          text: 'Fraxtal documentation',
          href: 'https://docs.frax.com/fraxtal',
        },
        {
          text: 'On-Chain Inbox',
          href: 'https://etherscan.io/address/0xff000000000000000000000000000000000420fc',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not made available on the external provider.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable or malicious transaction root.',
          isCritical: true,
        },
      ],
    },
    bridge: { type: 'None' },
  },
  discovery,
  display: {
    name: 'Fraxtal',
    slug: 'fraxtal',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Fraxtal is an EVM equivalent Optimium utilizing the OP stack as its smart contract platform and execution environment.',
    purposes: ['Universal', 'DeFi'],
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc.frax.com',
  genesisTimestamp: new UnixTime(1706811599),
  isNodeAvailable: true,
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'FraxtalMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the FraxchainPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power). This address is also the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
    ...discovery.getMultisigPermission(
      'frxETHMultisig',
      'This address is the owner of the gas token contract frxETH, and the frxETHMinter contract. It can pause and unpause ETH deposits, and change how much ETH is withheld from each submit() transaction.',
    ),
    ...discovery.getMultisigPermission(
      'TimelockMultisig',
      'This address is the owner of the timelock smart contract. It can queue, cancel, and execute transactions in the timelock (e.g., adding and removing frxETH whitelisted minters).',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('frxETH', {
      description:
        'Fraxtal uses Frax Ether (frxETH) as the designated gas token, allowing users to utilize frxETH to pay for blockspace.',
    }),
    discovery.getContractDetails('frxETHMinter', {
      description:
        'Authorized minter contract for frxETH, accepts user-supplied ETH and converts it to frxETH.',
    }),
    discovery.getContractDetails('sfrxETH', {
      description:
        'Vault token contract (ERC-4626) for staked frxETH. The smart contract receives frxETH tokens and mints sfrxETH tokens.',
    }),
    discovery.getContractDetails('Timelock', {
      description: `Allows for time-delayed execution of transactions in the FrxETH smart contract, such as adding and removing whitelisted minters. Delay is set to ${timelockDelay}.`,
    }),
    discovery.getContractDetails('SuperchainConfig', {
      description: `Upgradable contract that manages the PAUSED_SLOT, a boolean value indicating whether the Superchain is paused, and GUARDIAN_SLOT, the address of the guardian which can pause and unpause the system. The address of the guardian can only be modified by the ProxyAdmin by upgrading the SuperchainConfig contract. This contract is a fork of Optimism's superchainConfig contract and may not be utilized by other chains.`,
    }),
  ],
  chainConfig: {
    name: 'fraxtal',
    chainId: 252,
    explorerUrl: 'https://fraxscan.com/',
    explorerApi: {
      url: 'https://api.fraxscan.com/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 1
    minTimestampForTvl: new UnixTime(1706810713),
    coingeckoPlatform: 'fraxtal',
  },
  nonTemplateEscrows: [],
  nonTemplateOptimismPortalEscrowTokens: ['frxETH'],
})
