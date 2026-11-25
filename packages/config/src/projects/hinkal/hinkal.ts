import {
  assert,
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import {
  CIRCUITS_COMMIT,
  CIRCUITS_REPOSITORY,
  hinkalAdversaries,
  REFERENCE_APP,
} from './adversaries'
import { hinkalRiskSummary } from './riskSummary'

const discovery = new ProjectDiscovery('hinkal')

const HINKAL = discovery.getContract('Hinkal')
assert(HINKAL.sinceTimestamp !== undefined, 'Hinkal must have a sinceTimestamp')
const SINCE_TIMESTAMP = UnixTime(HINKAL.sinceTimestamp)

// The 15 Groth16 verifiers the Hinkal contract reaches today. The six older
// verifiers named Swap* in discovery are registered only for cleared external
// action ids, so no transaction reaches them.
const VERIFIERS = discovery
  .getContracts()
  .filter((contract) => contract.template === 'hinkal/Groth16VerifierEVM')
assert(VERIFIERS.length === 15, 'Expected the 15 reviewed verifiers')

const TIMELOCK = discovery.getContract('TimelockController')
const timelockDelay = discovery.getContractValue<number>(
  'TimelockController',
  'getMinDelay',
)
const multisigStats = discovery.getMultisigStats('Safe')

// The governance text and the privileged insider cell rest on the timelock
// holding every role that can change the pool.
for (const [contract, field] of [
  ['Hinkal', 'owner'],
  ['HinkalHelper', 'owner'],
  ['ProxyAdmin', 'owner'],
  ['Emporium', 'owner'],
] as const) {
  assert(
    discovery.getContractValue<string>(contract, field) === TIMELOCK.address,
    'The timelock must hold every role that changes the pool',
    { contract, field },
  )
}
assert(
  discovery
    .getContractValue<string[]>('Hinkal', 'helperManagers')
    .every((manager) => manager === TIMELOCK.address),
  'Only the timelock can replace the Hinkal helper',
)
// The factory keeps DEFAULT_ADMIN_ROLE but has no code path that uses it.
const HINKAL_FACTORY = discovery.getContract('HinkalFactory')
assert(
  discovery
    .getContractValue<string[]>('Hinkal', 'defaultAdmins')
    .every(
      (admin) => admin === TIMELOCK.address || admin === HINKAL_FACTORY.address,
    ),
  'Only the timelock can register external actions',
)

// The governance text names one Safe signer that controls the periphery
// without delay.
const PERIPHERY_EOA = discovery.getContractValue<string>(
  'HinkalWrapper',
  'owner',
)
assert(
  discovery
    .getContractValue<string[]>('Safe', '$members')
    .includes(PERIPHERY_EOA),
  'The periphery owner must be a Safe signer',
)
for (const [contract, field] of [
  ['LifiExternalAction', 'owner'],
  ['DepositOnChainUtxosExternalAction', 'owner'],
  ['ReceiveVaultFactory', '$admin'],
] as const) {
  assert(
    discovery.getContractValue<string>(contract, field) === PERIPHERY_EOA,
    'One Safe signer controls the periphery',
    { contract, field },
  )
}

export const hinkal: BaseProject = {
  id: ProjectId('hinkal'),
  slug: 'hinkal',
  name: 'Hinkal',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-11-20')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(SINCE_TIMESTAMP),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger for ERC-20 tokens and ETH with private transfers and swaps, run by Hinkal, which can read every note.',
    detailedDescription: readProjectMarkdown('hinkal', 'detailedDescription', {
      multisigStats,
      timelockDelay: formatSeconds(timelockDelay, { fullUnit: true }),
    }),
    links: {
      websites: ['https://hinkal.io'],
      documentation: ['https://hinkal-team.gitbook.io/hinkal'],
      repositories: [CIRCUITS_REPOSITORY],
      socialMedia: [
        'https://x.com/hinkal_protocol',
        'https://t.me/hinkal_protocol',
      ],
      other: ['https://app.hinkal.io', REFERENCE_APP.url],
    },
    badges: [],
  },
  milestones: [
    {
      // The Safe's timelock accepted ownership at 07:17 UTC. Its delay was
      // 180 s until 2026-09-10 (0x406f2509…), 6 h since. The EOA kept the
      // helper manager role until 2026-09-10 (0xa735da2a…).
      title: 'Pool ownership moves to a timelock',
      url: 'https://etherscan.io/tx/0x3edad43af4d9d5e3d18e116ecacd5e43ae94e7a9403465d75bb11467b942fdaa',
      date: '2026-08-25T00:00:00Z',
      description:
        "An EOA hands the pool to a timelock behind Hinkal's 2/3 Safe.",
      type: 'general',
    },
    {
      // Tx 0x53c7a449… sets the helper of the v1 pool 0x2ea81946… to the
      // zero address. Its transact calls the helper first, so every spend reverts.
      // The pool held about 6,213 USDT, 3.34 ETH and 228 USDC on 2026-11-20.
      title: '2023 Hinkal pool frozen',
      url: 'https://etherscan.io/tx/0x53c7a4490fe7beab196b44365edd991ed9497d308bbc0843adda15aa50919195',
      date: '2026-07-24T00:00:00Z',
      description:
        "Hinkal's owner removes the 2023 pool's helper, so the deposits still in it cannot leave.",
      type: 'incident',
    },
    {
      // Deployed in block 25543753, 07:32 UTC. The first user transaction
      // followed at 08:30 UTC.
      title: 'Current pool goes live',
      url: 'https://etherscan.io/tx/0x85f1ad3bc33e75b4ad2f487f3976012c288343bbba7ff19c504546cc2c433284',
      date: '2026-07-16T00:00:00Z',
      description:
        'Hinkal deploys a new pool without access tokens, and its app moves users to it.',
      type: 'general',
    },
    {
      // Five attacker EOAs took 800,200 USDC from the 2025 pool 0x25e5e82f…
      // between 19:56 UTC on 2 July and 00:20 UTC on 3 July, against 27,900
      // USDC they deposited. The pool's USDC fell by 772,300. The owner set
      // its helper to 0x0 at 04:46 UTC on 3 July (0x05c1f7ca…).
      title: '2025 Hinkal pool drained',
      url: 'https://blocksec.com/blog/web3-security-hinkal-double-spend',
      date: '2026-07-02T00:00:00Z',
      description:
        'An attacker withdraws about 800K USDC they never deposited from the previous pool.',
      type: 'incident',
    },
  ],
  escrows: [
    {
      address: ChainSpecificAddress.address(HINKAL.address),
      chain: ChainSpecificAddress.longChain(HINKAL.address),
      sinceTimestamp: SINCE_TIMESTAMP,
      tokens: ['ETH', 'USDC', 'USDT', 'DAI'],
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Hinkal',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Hinkal,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('hinkal'),
        sinceTimestamp: SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Hinkal 15 circuit verifiers 20.11.2026',
        name: 'Hinkal verifiers v4',
        sourceLink: `${CIRCUITS_REPOSITORY}/tree/${CIRCUITS_COMMIT}/circuits`,
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: VERIFIERS.map((verifier) => ({
          address: verifier.address,
        })),
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'hinkal',
          'verificationSteps-20.11.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: REFERENCE_APP,
    trackedOn: ['ethereum'],
    // Scaling projects where the extension 0.0.64 serves the pool (its chain
    // list). BNB Chain, Arc and Solana are served too but are not projects
    // here. The SDK still lists an Optimism pool, which the extension does not
    // serve.
    runsOn: [
      ProjectId('arbitrum'),
      ProjectId('base'),
      ProjectId('polygon-pos'),
      ProjectId('robinhood'),
    ],
    // Not tracked: Hinkal emits no event with token, amount and depositor.
    // Deposits reach the pool from public accounts through the Emporium,
    // directly, and from deposit addresses through the ReceiveVaultFactory,
    // so tracking would need a trace-based extractor.
    tokens: [],
    anonymitySet: { type: 'too-small' },
    exitWindow: {
      value: formatSeconds(timelockDelay),
      sentiment: 'bad',
      orderHint: timelockDelay,
      description: `Changes to the verifiers, the helper and the Emporium wait ${formatSeconds(timelockDelay, { fullUnit: true })} in a timelock, which is short for users to withdraw before a change they reject.`,
      walkawayTest: {
        passed: false,
        reason:
          "No released app withdraws without Hinkal's relayers and servers. Only the SDK can submit a withdrawal from the user's own wallet.",
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The Hinkal contract and circuits are public, and every reachable verifier rebuilds from the circuits and the published proving keys. The helper that builds the public inputs of each proof, the Emporium implementation, the apps and the enclave are closed.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: hinkalAdversaries(
      formatSeconds(timelockDelay, { fullUnit: true }),
    ),
    compliance: {
      tradeoff:
        'Hinkal screens at its own relayers, and the contracts enforce no list. To judge a spend the relayers learn which notes it uses, and the extension has no path around them.',
      gatekeeper: {
        type: 'relayer',
        detail:
          "Hinkal's allowlisted relayers, which submit every transaction the extension sends",
      },
      rules: {
        type: 'closed',
        detail:
          "Hinkal's relayers check the notes of each spend against deposit addresses Hinkal has flagged. Its [documentation](https://hinkal-team.gitbook.io/hinkal/security-and-compliance/compliance) names Merkle Science and Chainalysis as sources, and the flagged addresses are not public.",
      },
      timing: {
        type: 'anytime',
        detail:
          'The relayers decide again at each spend, so a deposit accepted once can be refused later.',
      },
      consequence: {
        type: 'funds',
        detail:
          "Refused funds stay in the pool, since the extension sends only through the relayers. The contracts accept a spend the user submits from their own address, which takes Hinkal's SDK and publishes that address.",
      },
      voluntaryDisclosure: {
        type: 'none',
        detail:
          "The extension only exports the account's transactions of a chosen timeframe as an unsigned CSV file. It offers no proof for a single payment.",
      },
      content: readProjectMarkdown('hinkal', 'compliance'),
    },
    riskSummary: hinkalRiskSummary({
      multisigStats,
      timelockDelay: formatSeconds(timelockDelay, { fullUnit: true }),
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('hinkal', 'upgradesAndGovernance', {
        multisigStats,
        timelockDelay: formatSeconds(timelockDelay, { fullUnit: true }),
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: VERIFIERS.map((verifier) => verifier.address),
  },
}
