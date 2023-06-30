import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('immutablex')

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

export const immutablex: Layer2 = {
  type: 'layer2',
  id: ProjectId('immutablex'),
  display: {
    name: 'Immutable X',
    slug: 'immutablex',
    description:
      'Immutable X claims to be the first Layer 2 for NFTs on Ethereum. It promises zero gas fees, instant trades and scalability for games, applications, marketplaces, without compromise.',
    purpose: 'NFT, Exchange',
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://www.immutable.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: ['https://immutascan.io/'],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@immutablex',
        'https://twitter.com/Immutable',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    associatedTokens: ['IMX'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5FDCCA53617f4d2b9134B29090C87D01058e27e9'),
        sinceTimestamp: new UnixTime(1615389188),
        tokens: ['ETH', 'IMX', 'USDC', 'OMI'],
        description: 'Main StarkEx contract, used also as an escrow.',
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: 'immutable',
      sinceTimestamp: new UnixTime(1615389188),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC,
      sources: [
        {
          contract: 'StarkExchange',
          references: [
            'https://etherscan.io/address/0x86d8f977C9cEC503ad4E6805802cEf62Cde13773#code#F34#L180',
          ],
        },
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295#code#F1#L63',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(delaySeconds),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('StarkExchange'),
      discovery.getContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(delaySeconds)],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(delay),
    },
    getCommittee(discovery),
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
      description:
        'Allowed to update the state. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Trading is live on Immutable X Marketplace',
      link: 'https://twitter.com/immutable/status/1380269810525872131?s=21&t=kyMdE6ORI9f76e8aqizlpg',
      date: '2021-04-08T00:00:00Z',
      description:
        'Immutable has launched the first phase of its Layer 2 scaling protocol.',
    },
    {
      name: 'IMX Token introduced',
      link: 'https://www.immutable.com/blog/introducing-imx-to-power-ethereums-first-layer-2-for-nfts',
      date: '2022-06-29T00:00:00Z',
      description:
        'Immutable announce IMX, the native ERC-20 utility token of Immutable X.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
