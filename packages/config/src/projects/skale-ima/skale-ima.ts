import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('skale-ima')

export const skaleIMA: Bridge = {
  type: 'bridge',
  id: ProjectId('skale-ima'),
  addedAt: UnixTime(1684437883), // 2023-05-18T19:24:43Z
  display: {
    name: 'SKALE IMA Bridge',
    slug: 'skale-ima',
    links: {
      websites: ['https://skale.space'],
      bridges: ['https://bridge.skale.network'],
      socialMedia: [
        'https://twitter.com/SkaleNetwork',
        'https://t.me/skaleofficial',
        'https://youtube.com/channel/UCpUk0eMmD00C7RXLT0g8SuA',
        'https://reddit.com/r/skalenetwork/',
        'https://linkedin.com/company/skale-labs/',
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
        address: ChainSpecificAddress(
          'eth:0x49F583d263e4Ef938b9E09772D3394c71605Df94',
        ),
        sinceTimestamp: UnixTime(1626719733),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x8fB1A35bB6fB9c47Fb5065BE5062cB8dC1687669',
        ),
        sinceTimestamp: UnixTime(1626719900),
        tokens: '*',
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
          title: 'Bridging transactions',
          url: 'https://bridge-docs.orbitchain.io/bridging-transaction',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation',
      description:
        'SKALE IMA Bridge operates on SKALE Network nodes for connected SKALE chain. Messages are signed by BLS secret key with an 11 out of 16 threshold, then sent and validated on Ethereum. The validator set signing the message is the same one that is used for the consensus of the SKALE chain, making the bridge as secure as the chain itself. Since the state root is not sent to L1, the bridge and the chain state can diverge.',
      references: [
        {
          title: 'SKALE IMA Bridge - Overview',
          url: 'https://docs.skale.network/ima/1.4.x/',
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
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED,
    },
  },
  contracts: {
    addresses: {
      ethereum: [
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
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'ProxyAdminOwner',
          'This is an owner of DepositBox contracts proxies, can upgrade the implementation of those contracts, which potentially can introduce bug or introduce malicious behaviors.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
