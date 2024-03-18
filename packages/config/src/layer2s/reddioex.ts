import { EthereumAddress, formatSeconds, ProjectId } from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../discovery/starkware'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('reddioex')

const upgradeDelaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)
const upgradeDelay = formatSeconds(upgradeDelaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const committee = getCommittee(discovery)

export const reddioex: Layer2 = {
  type: 'layer2',
  id: ProjectId('reddioex'),
  display: {
    name: 'ReddioEx',
    slug: 'reddioex',
    description:
      'ReddioEx is a Validium based on the StarkEx technology. Its goal is to power the next generation of web3 apps and games by providing developers with the ability to create digital assets (NFTs) and easily integrate them in-game.',
    purposes: ['Exchange', 'NFT', 'Gaming'],
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://reddio.com/'],
      apps: ['https://reddio.com/explore', 'https://dashboard.reddio.com'],
      documentation: ['https://docs.reddio.com/'],
      explorers: ['https://explorer.reddio.com/'],
      repositories: ['https://github.com/reddio-com/starkex-contracts-source'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
        'https://discord.com/invite/SjNAJ4qkK3',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xB62BcD40A24985f560b5a9745d478791d8F1945C'),
        tokens: ['ETH', 'USDC', 'USDT'],
        description: 'Main StarkEx contract, used also as an escrow.',
      }),
    ],
    /*
    transactionApi: {
      type: 'starkex',
      product: ['reddio'],
      sinceTimestamp: new UnixTime(1615389188),
      resyncLastDays: 7,
    },
    */
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['DAC'],
    bridge: {
      type: 'DAC Members',
      membersCount: committee.accounts.length,
      requiredSignatures: committee.minSigners,
    },
    mode: 'State diffs',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: committee.accounts.length,
        requiredSignatures: committee.minSigners,
      }),
      sources: [
        {
          contract: 'StarkExchange',
          references: [
            'https://etherscan.io/address/0x67e198743BC19fa4757720eDd0e769f8291e1F1D#code#F14#L188',
          ],
        },
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x4b2Bf1Cb06CB636e8A14540F76c477E61d8B6669#code#F2#L61',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
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
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(upgradeDelay),
    },
    committee,
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
      name: 'Reddio Announces Mainnet Launch',
      link: 'https://blog.reddio.com/announces-layer2-zkrollup-mainnet-launch/',
      date: '2022-09-29T00:00:00Z',
      description: 'Reddio announces its Validium Mainnet launch.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
