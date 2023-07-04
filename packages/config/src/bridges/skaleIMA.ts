import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('skale-ima')

export const skaleIMA: Bridge = {
  type: 'bridge',
  id: ProjectId('skale-ima'),
  display: {
    name: 'SKALE IMA Bridge',
    slug: 'skale-ima',
    links: {
      websites: ['https://skale.space'],
      apps: ['https://bridge.skale.network'],
      socialMedia: [
        'https://twitter.com/SkaleNetwork',
        'https://t.me/skaleofficial',
        'https://youtube.com/channel/UCpUk0eMmD00C7RXLT0g8SuA',
        'https://reddit.com/r/skalenetwork/',
        'https://www.linkedin.com/company/skale-labs/',
      ],
      documentation: [
        'https://docs.skale.network/ima/1.4.x/',
        'https://mainnet.skalenodes.com',
      ],
      repositories: ['https://github.com/skalenetwork/IMA'],
      explorers: ['https://elated-tan-skat.explorer.mainnet.skalenodes.com'],
    },
    description:
      'SKALE IMA Bridge is a part of SKALE Network ecosystem. It is a cross-chain BLS threshold bridge that allows users to transfer tokens and arbitrary messages between supported blockchains.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['SKL'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x49F583d263e4Ef938b9E09772D3394c71605Df94'),
        sinceTimestamp: new UnixTime(1626719733),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669'),
        sinceTimestamp: new UnixTime(1626719900),
        tokens: [
          'RAZOR',
          'USDP',
          'USDC',
          'SKL',
          'DAI',
          'USDT',
          'WBTC',
          // 'HMT',
          'LINK',
        ],
      }),
    ],
  },
  technology: {
    destination: ['Ethereum', 'SKALE'],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        'It is a cross-chain BLS threshold bridge that allows users to transfer Eth, ERC20, ERC721, ERC1155 and arbitrary messages between Ethereum and SKALE chains without fees and between SKALE chains without gas fees. Locks/Unlocks on main chain (Ethereum or SKALE chain which is origin of the asset), Burns/Mints on target chain.',
      references: [
        {
          text: 'Bridging transactions',
          href: 'https://bridge-docs.orbitchain.io/bridging-transaction',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation',
      description:
        'SKALE IMA Bridge operates on SKALE Network nodes for connected SKALE chain. Messages are signed by BLS secret key with a 11 out of 16 threshold, then sent and validated on Ethereum. The validator set signing the message is the same one that is used for the consensus of the SKALE chain, making the bridge as secure as the chain itself. Since the state root is not sent to L1, the bridge and the chain state can diverge.',
      references: [
        {
          text: 'SKALE IMA Bridge - Overview',
          href: 'https://docs.skale.network/ima/1.4.x/',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'There are 16 randomly selected validator nodes of the destination chain, 11 of them needs to sign and verify messages',
      sentiment: 'warning',
      sources: [
        {
          contract: 'MessageProxyForMainnet',
          references: [
            'https://etherscan.io/address/0x64e4cd4Fe42eAB98AcD15fddaC657B1537aa5190#code#F1#L508',
            'https://etherscan.io/tx/0xb463ae9bacd3b0ba41eea25bdb51b115858bd9997d631bc26ccbb8a4fc3774c7',
          ],
        },
      ],
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The bridge can be upgraded by the' +
        discovery.getMultisigStats('ProxyAdminOwner') +
        'Multisig. There is no delay on the upgrade.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'MessageProxyForMainnet',
        'Contract responsible for sending and receiving messages. It is used internally by the DepositBox contracts to transfer value between chains. It supports gas reimbursement from the CommunityPool.',
      ),
      discovery.getContractDetails(
        'DepositBoxEth',
        'Bridge contract to transfer ETH to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      ),
      discovery.getContractDetails(
        'DepositBoxERC721WithMetadata',
        'Bridge contract to transfer ERC721 tokens with metadata to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      ),
      discovery.getContractDetails(
        'DepositBoxERC20',
        'Bridge contract to transfer ERC20 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      ),
      discovery.getContractDetails(
        'DepositBoxERC721',
        'Bridge contract to transfer ERC721 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      ),
      discovery.getContractDetails(
        'DepositBoxERC1155',
        'Bridge contract to transfer ERC1155 tokens to Skale chains, Proxy, Source code of implementation is verified on Etherscan.',
      ),
      discovery.getContractDetails(
        'CommunityPool',
        'CommunityPool is Gas Wallet contract, where users need to deposit Eth, to be able to transfer their assets(Eth, ERC20, NFTs) or messages from SKALE chain to Ethereum. Deposited amount will be spend for gas reimbursement to Agent which will deliver message on Ethereum.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'ProxyAdminOwner',
      'This is an owner of DepositBox contracts proxies, can upgrade the implementation of those contracts, which potentially can introduce bug or introduce malicious behaviors.',
    ),
  ],
}
