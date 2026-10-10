import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { zkApiAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('zkapi')
const vault = discovery.getContract('ZkApiVault')
const verifier = discovery.getContract('Groth16ProofAdapter')
const verifierHash = verifier.sourceHashes?.[0]
assert(verifierHash !== undefined, 'zkapi verifier needs a source hash')
assert(vault.sinceTimestamp !== undefined, 'zkapi vault needs sinceTimestamp')
const sinceTimestamp = UnixTime(vault.sinceTimestamp)

// Bind descriptions of the exit paths and proof system to reviewed sources.
for (const [name, hash] of [
  [
    'ZkApiVault',
    '0x72d737baab9b8413b0fce1575c05db16b36d72e1b15637e9490b0525432f051b',
  ],
  [
    'Groth16ProofAdapter',
    '0xd31acf861825869e6a84b6b0025cb6940077f5981a10e73d2e4e8e5d7417c853',
  ],
  [
    'Bn254Poseidon',
    '0xcc6ce4b93fa5762203bd23bc698617f85f28ae603c8d3c8e43159432900256c5',
  ],
] as const) {
  assert(
    discovery.getContract(name).sourceHashes?.includes(hash),
    `${name} source changed, review zkapi research`,
  )
}
assert(
  discovery.getContractValue<ChainSpecificAddress>(
    'ZkApiVault',
    'proofAdapter',
  ) === verifier.address,
  'zkapi proof adapter changed, review the circuit and setup',
)
assert(
  discovery.getContractValue<ChainSpecificAddress>(
    'ZkApiVault',
    'billingToken',
  ) === ChainSpecificAddress('eth:0x0000000000000000000000000000000000000000'),
  'zkapi billing asset changed',
)

const weiPerUnit = discovery.getContractValueBigInt(
  'ZkApiVault',
  'nativeAssetWeiPerUnit',
)
const challengeSeconds = discovery.getContractValue<number>(
  'ZkApiVault',
  'challengePeriod',
)
const requestChargeCap =
  discovery.getContractValueBigInt('ZkApiVault', 'requestChargeCap') *
  weiPerUnit
const values = {
  challengePeriod: formatSeconds(challengeSeconds, { fullUnit: true }),
  noteTtl: formatSeconds(
    discovery.getContractValue<number>('ZkApiVault', 'noteTtl'),
    { fullUnit: true },
  ),
  expiryBucket: formatSeconds(
    discovery.getContractValue<number>('ZkApiVault', 'EXPIRY_BUCKET'),
    { fullUnit: true },
  ),
  requestChargeCap: utils.formatEther(requestChargeCap),
}
const eth = getTokenByAddress(
  EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'),
)
const params = { weiPerUnit: weiPerUnit.toString() }
const source =
  'https://github.com/ethereum/zkapi/blob/045b444ea1b52538d1b40273c7cb6ed09468a052/'

export const zkapi: BaseProject = {
  id: ProjectId('zkapi'),
  slug: 'zkapi',
  name: 'zkAPI',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-10-02')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: {
      text: 'The vault owner can block withdrawals until deposits expire and become sweepable to the treasury. The proofs rely on a single-party trusted setup.',
      detailAnchor: 'permissions',
    },
    emergencyWarning: discovery.getContractValue<boolean>(
      'ZkApiVault',
      'paused',
    )
      ? 'The vault is paused. Cooperative closes and the start of escapes are blocked.'
      : undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Anonymous access to AI models, prepaid with ETH, that hides which deposit pays for which request.',
    detailedDescription: readProjectMarkdown(
      'zkapi',
      'detailedDescription',
      values,
    ),
    links: {
      websites: ['https://chat.openanonymity.ai'],
      documentation: ['https://zkapi.openanonymity.ai'],
      repositories: ['https://github.com/ethereum/zkapi'],
    },
    badges: [],
  },
  escrows: [
    {
      address: ChainSpecificAddress.address(vault.address),
      chain: 'ethereum',
      sinceTimestamp,
      tokens: ['ETH'],
    },
  ],
  tvsInfo: { associatedTokens: [], warnings: [] },
  zkCatalogInfo: {
    creator: 'Open Anonymity',
    techStack: {
      snark: [ZK_CATALOG_TAGS.Groth16.Arkworks, ZK_CATALOG_TAGS.curve.BN254],
    },
    proofSystemInfo:
      'Application-specific request and withdrawal Groth16 circuits over BN254. Poseidon Merkle membership and note-bound Baby-JubJub balance commitments hide the note and balance during authorization. Withdrawals expose the note id and remaining balance.',
    trustedSetups: [
      {
        id: 'ZkApiNoteBoundV1',
        name: 'zkapi-v2-note-bound-v1 single-party setup',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Arkworks,
        participantCount: 1,
        risk: 'red',
        shortDescription:
          'The published request and withdrawal keys were generated by one party. Retained setup secrets can allow forged proofs.',
        longDescription: readProjectMarkdown('zkapi', 'trustedSetup'),
      },
    ],
    projectsForTvs: [{ projectId: ProjectId('zkapi'), sinceTimestamp }],
    verifierHashes: [
      {
        name: 'zkapi note-bound request and withdrawal verifier',
        hash: verifierHash,
        sourceLink: `${source}protocol/rust/crates/zkapi-proof/src/groth16.rs`,
        proofSystem: ZK_CATALOG_TAGS.Groth16.Arkworks,
        knownDeployments: [{ address: verifier.address }],
        // Source/bytecode matching is documented separately. It does not
        // reproduce the circuit-specific setup or certify circuit soundness.
        verificationStatus: 'notVerified',
        verificationSteps: readProjectMarkdown('zkapi', 'verificationSteps'),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.anonymousAccess,
    trackedOn: ['ethereum'],
    tokens: [
      {
        token: {
          address: EthereumAddress(
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          ),
          iconUrl: eth.iconUrl,
          symbol: eth.symbol,
          decimals: eth.decimals,
          priceId: eth.coingeckoId,
          sinceTimestamp,
        },
        buckets: [
          {
            id: 'zkapi-ETH',
            type: 'pool',
            label: 'ETH API balances',
            address: vault.address,
            sinceTimestamp,
            deposit: {
              event: utils.id(
                'NoteDeposited(uint32,bytes32,uint128,uint64,uint256)',
              ),
              extractor: 'zkApiDeposit',
              params,
            },
            withdrawal: {
              event: utils.id('MutualClose(uint32,uint256,uint128,address)'),
              extractor: 'zkApiWithdrawal',
              params,
            },
            additionalWithdrawals: [
              {
                event: utils.id(
                  'EscapeWithdrawalFinalized(uint32,uint256,uint128,address)',
                ),
                extractor: 'zkApiWithdrawal',
                params,
              },
            ],
          },
        ],
      },
    ],
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description: `The owner can immediately pause cooperative closes and the start of escapes. An already pending escape can be finalized after ${values.challengePeriod}, including during a pause. An active note becomes sweepable after its deposit expiry.`,
      walkawayTest: {
        passed: false,
        reason:
          'Starting an escape needs an unpaused vault and your latest signed balance. The operator can cancel it with any request proof it holds for that balance, and only a new operator signature restores normal use.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The browser app and the local daemon have public source and build instructions. The verifier enclave image rebuilds from source and matches its hardware attestation. The hosted frontend, the daemon releases and the key stations remain unreproduced.',
    },
    attributes: [PRIVACY_ATTRIBUTES.zk, PRIVACY_ATTRIBUTES.anyAmount],
    adversaries: zkApiAdversaries,
    riskSummary: readProjectMarkdown('zkapi', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('zkapi', 'upgradesAndGovernance'),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [verifier.address],
  },
}
