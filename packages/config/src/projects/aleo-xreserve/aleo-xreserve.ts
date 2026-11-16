import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { aleoXreserveAdversaries, REFERENCE_APP } from './adversaries'

// Discovery covers the Ethereum side: xReserve, Circle's Gateway contracts and
// the depositor contract that holds the USDC backing USDCx on Aleo. The Aleo
// programs are outside discovery; their roles and multisig were read on
// 2026-11-16 and are recorded in the research ledger.
const discovery = new ProjectDiscovery('aleo-xreserve')

const ALEO_DEPOSITOR = discovery.getContract('AleoDepositor')
assert(
  discovery.getContractValue<string>('xReserve', 'aleoDepositor') ===
    ALEO_DEPOSITOR.address,
  'xReserve must credit Aleo deposits to the AleoDepositor',
)
assert(
  discovery.getContractValue<string>('xReserve', 'aleoRemoteToken') ===
    '0x11ea7dab1d29d5f61500582c63e98c42e1165f9ba050ea9d0c6af9f871987711',
  'xReserve must map USDC to usdcx_stablecoin.aleo',
)

const ATTESTER_THRESHOLD = discovery.getContractValue<number>(
  'AleoDepositor',
  'signatureThreshold',
)
const ATTESTER_COUNT = discovery.getContractValue<number>(
  'AleoDepositor',
  'numPersistentEnabledAttesters',
)
const ATTESTER_DELAY_BLOCKS = discovery.getContractValue<number>(
  'AleoDepositor',
  'persistentSignatureBufferDelayBlocks',
)
assert(
  ATTESTER_DELAY_BLOCKS === 50_400,
  'The attester delay text assumes 50,400 blocks, about 7 days',
)

export const aleoXreserve: BaseProject = {
  id: ProjectId('aleo-xreserve'),
  slug: 'aleo-xreserve',
  name: 'Aleo via xReserve',
  shortName: undefined,
  aliases: ['USDCx', 'Shield', 'Shield Swap'],
  addedAt: UnixTime.fromDate(new Date('2026-11-16')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning:
      'The Aleo programs are outside real-time monitoring. Their roles and upgrade keys were read on November 16, 2026.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A shielded ledger round trip: Ethereum USDC becomes private USDCx on Aleo through Circle's xReserve and comes back, with every private action readable by a compliance key.",
    detailedDescription: readProjectMarkdown(
      'aleo-xreserve',
      'detailedDescription',
    ),
    links: {
      websites: [
        'https://aleo.org/usdcx',
        'https://swap.shield.fi',
        'https://shield.app',
      ],
      documentation: [
        'https://docs.aleo.org/build/common-uses/usdcx_bridge',
        'https://developers.circle.com/xreserve',
      ],
      explorers: [
        'https://explorer.provable.com/program/usdcx_stablecoin.aleo',
        'https://explorer.provable.com/program/shielded_usdcx_wrapper.aleo',
        'https://etherscan.io/address/0x8888888199b2Df864bf678259607d6D5EBb4e3Ce',
      ],
      repositories: [
        'https://github.com/ProvableHQ/compliant-stablecoin',
        'https://github.com/ProvableHQ/veil',
      ],
      socialMedia: ['https://x.com/AleoHQ'],
    },
    badges: [],
  },
  milestones: [
    {
      // usdcx_bridge_v2.aleo and shielded_usdcx_wrapper.aleo were deployed in
      // Aleo blocks 19336608 and 19336720, the wrapper's multisig wallet in
      // tx at1x8m8303zf7rgvtv5tdkjjrj60fry0slhfraj6cnzc323dzx08qxs5qcfkj.
      title: 'Private mint and burn go live',
      url: 'https://explorer.provable.com/program/shielded_usdcx_wrapper.aleo',
      date: '2026-06-15T00:00:00Z',
      description:
        'A wrapper program lets a deposit hide its Aleo recipient and a withdrawal its Aleo sender.',
      type: 'general',
    },
    {
      // Circle's xReserve release notes, entry 2026.01.27.
      title: 'USDCx launches on Aleo mainnet',
      url: 'https://developers.circle.com/release-notes/xreserve-2026',
      date: '2026-01-27T00:00:00Z',
      description:
        "Circle's xReserve starts minting USDCx on Aleo against USDC deposited on Ethereum.",
      type: 'general',
    },
  ],
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: REFERENCE_APP,
    trackedOn: ['ethereum'],
    // The backing USDC is an internal GatewayWallet balance of the
    // AleoDepositor, not a token balance at an address, so no escrow.
    tokens: [],
    anonymitySet: {
      type: 'not-applicable',
      description:
        'The set is every account holding private USDCx on Aleo, a chain ETHBEAT does not index.',
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'A 2/3 multisig upgrades the USDCx programs on Aleo at once, and an EOA upgrades xReserve on Ethereum at once.',
      walkawayTest: {
        passed: false,
        reason:
          "Every mint needs a signature from Circle's attester, and every withdrawal needs the Aleo depositor's attesters and Circle's Gateway.",
      },
    },
    reproducibility: {
      value: 'Not reproducible',
      sentiment: 'bad',
      description:
        'The Aleo programs can be read onchain, but the published Leo source names a different compliance address than the deployed token. Shield Swap and the Shield wallet are closed.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: aleoXreserveAdversaries,
    riskSummary: readProjectMarkdown('aleo-xreserve', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('aleo-xreserve', 'upgradesAndGovernance', {
        attesterThreshold: ATTESTER_THRESHOLD,
        attesterCount: ATTESTER_COUNT,
        attesterDelay: 'about 7 days',
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
