import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { zamaCwAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('zama-cw')

// Flows are the underlying token transfers into and out of each wrapper. The
// wrappers' own events changed when the ones deployed before block 25077611
// (2026-05-12) were upgraded in it: before, wraps emitted no Wrap event and
// UnwrapFinalized had a different signature. Underlying transfers cover both
// implementations and match every nonzero wrap and finalized unwrap. They also
// include a few hundred dust transfers into cUSDT and cUSDC (address
// poisoning, under 2 USD in total) that wrapped nothing.
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const WRAPPER_NAMES = [
  'ConfidentialUSDCWrapper',
  'ConfidentialUSDTWrapper',
  'ConfidentialWETHWrapper',
  'ConfidentialBRONWrapper',
  'ConfidentialZAMAWrapper',
  'ConfidentialTGBPWrapper',
  'ConfidentialXAUTWrapper',
  'ConfidentialBbqTGBPWrapper',
  'ConfidentialSteakcUSDCWrapper',
  'ConfidentialWBTCWrapper',
  'ConfidentialAUSDWrapper',
  'ConfidentialPENDLEWrapper',
  'ConfidentialSteakUSDTWrapper',
  'ConfidentialBbqUSDTWrapper',
  'ConfidentialBbqUSDCWrapper',
  'ConfidentialArmcWBTCWrapper',
  'ConfidentialArmUSDTsWrapper',
  'ConfidentialArmUSDCsWrapper',
  'ConfidentialArmUSDTpWrapper',
  'ConfidentialArmUSDCpWrapper',
  'ConfidentialPendleUSDCWrapper',
  'ConfidentialFAUSDeWrapper',
  'ConfidentialFcUSDTWrapper',
  'ConfidentialRoxcUSDCWrapper',
  'ConfidentialRoxUSDCyWrapper',
  'ConfidentialPAPYWrapper',
]

const trackedWrappers = WRAPPER_NAMES.flatMap((name) => {
  if (!discovery.hasContract(name)) {
    return []
  }

  const wrapper = discovery.getContract(name)
  const underlyingAddress = EthereumAddress(
    ChainSpecificAddress.address(
      discovery.getContractValue<ChainSpecificAddress>(name, 'underlying'),
    ),
  )

  try {
    const underlyingToken = getTokenByAddress(underlyingAddress.toString())
    return [
      {
        wrapper,
        wrapperSymbol: discovery.getContractValue<string>(name, 'symbol'),
        wrapperSinceTimestamp: UnixTime(wrapper.sinceTimestamp ?? 0),
        underlyingAddress,
        underlyingToken,
      },
    ]
  } catch {
    return []
  }
})

// The privacy and risk texts state that no wrapper has observers (wildcard
// decryption grantees) or an active pauser. Update them if this changes.
for (const name of WRAPPER_NAMES) {
  if (!discovery.hasContract(name)) {
    continue
  }
  const observers = discovery.getContractValue<string[]>(name, 'observers')
  assert(
    observers.length === 0,
    `${name} has observers configured: update the privacy and risk texts.`,
  )
  const pauser = discovery.getContractValue<ChainSpecificAddress>(
    name,
    'pauser',
  )
  assert(
    ChainSpecificAddress.address(pauser) === EthereumAddress.ZERO,
    `${name} has a pauser configured: update the privacy and risk texts.`,
  )
}

const kmsThreshold = discovery.getContractValue<number>(
  'KMSVerifier',
  'getThreshold',
)
const kmsSignerCount = discovery.getContractValue<string[]>(
  'KMSVerifier',
  'getKmsSigners',
).length
const coprocessorThreshold = discovery.getContractValue<number>(
  'InputVerifier',
  'getThreshold',
)
const coprocessorSignerCount = discovery.getContractValue<string[]>(
  'InputVerifier',
  'getCoprocessorSigners',
).length
const gatewayCoprocessorThreshold = discovery.getContractValue<number>(
  'GatewayConfig',
  'getCoprocessorMajorityThreshold',
)
const gatewayCoprocessorCount = discovery.getContractValue<string[]>(
  'GatewayConfig',
  'getCoprocessorTxSenders',
).length
const priorityCoprocessorTxSender =
  discovery.getContractValue<ChainSpecificAddress>(
    'GatewayConfig',
    'getPriorityCoprocessorTxSender',
  )
const priorityCoprocessorMode =
  ChainSpecificAddress.address(priorityCoprocessorTxSender) ===
  EthereumAddress.ZERO
    ? 'off'
    : 'on'
// Shamir sharing of degree t: t + 1 operators reconstruct the FHE key.
const kmsKeyThreshold =
  discovery.getContractValue<number>('ProtocolConfig', 'getMpcThreshold') + 1
const multisigAStats = discovery.getMultisigStats('ZamaGovMultisigA')
const multisigBStats = discovery.getMultisigStats('ZamaGovMultisigB')
const gatewaySafeStats = discovery.getMultisigStats('SafeL2')
const aclPauserCount = discovery.getContractValue<string[]>(
  'PauserSet',
  'pausers',
).length
const gatewayPauserCount = discovery.getContractValue<string[]>(
  'GatewayPauserSet',
  'pausers',
).length

function formatZama(wei: string): string {
  return (Number(BigInt(wei) / 10n ** 14n) / 10_000).toString()
}
const inputPrice = formatZama(
  discovery.getContractValue<string>(
    'ProtocolPayment',
    'getInputVerificationPrice',
  ),
)
const decryptionPrice = formatZama(
  discovery.getContractValue<string>(
    'ProtocolPayment',
    'getPublicDecryptionPrice',
  ),
)
assert(
  decryptionPrice ===
    formatZama(
      discovery.getContractValue<string>(
        'ProtocolPayment',
        'getUserDecryptionPrice',
      ),
    ),
  'Public and user decryption prices differ: update the fees text.',
)

const privacyTokens: ProjectPrivacyToken[] = trackedWrappers.map(
  ({
    wrapper,
    wrapperSymbol,
    wrapperSinceTimestamp,
    underlyingAddress,
    underlyingToken,
  }) => ({
    token: {
      address: underlyingAddress,
      iconUrl: underlyingToken.iconUrl,
      symbol: underlyingToken.symbol,
      decimals: underlyingToken.decimals,
      priceId: underlyingToken.coingeckoId,
      sinceTimestamp: wrapperSinceTimestamp,
    },
    buckets: [
      {
        id: `zama-cw-${wrapperSymbol}`,
        type: 'pool',
        label: `${wrapperSymbol} token`,
        address: wrapper.address,
        sinceTimestamp: wrapperSinceTimestamp,
        deposit: {
          event: ERC20_TRANSFER_EVENT,
          extractor: 'erc20Transfer',
          params: {
            to: EthereumAddress(ChainSpecificAddress.address(wrapper.address)),
          },
        },
        withdrawal: {
          event: ERC20_TRANSFER_EVENT,
          extractor: 'erc20Transfer',
          params: {
            from: EthereumAddress(
              ChainSpecificAddress.address(wrapper.address),
            ),
          },
        },
      },
    ],
  }),
)

export const zamaCw: BaseProject = {
  id: ProjectId('zama-cw'),
  slug: 'zama-confidential-tokens',
  name: 'Zama Confidential Tokens',
  shortName: 'Zama Conf. Tokens',
  addedAt: UnixTime.fromDate(new Date('2026-06-24')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Confidential amounts for ERC-20 tokens on Ethereum: wrappers that encrypt balances and transfer amounts with FHE, decrypted by a committee of KMS operators.',
    detailedDescription: readProjectMarkdown('zama-cw', 'detailedDescription', {
      kmsThreshold,
      kmsSignerCount,
      kmsKeyThreshold,
      coprocessorThreshold,
      coprocessorSignerCount,
      gatewayCoprocessorThreshold,
      gatewayCoprocessorCount,
      priorityCoprocessorMode,
      inputPrice,
      decryptionPrice,
    }),
    links: {
      websites: ['https://www.zama.org'],
      documentation: ['https://docs.zama.org/protocol'],
      repositories: ['https://github.com/zama-ai'],
    },
    badges: [],
  },
  milestones: [
    {
      title: 'Zama Protocol live on Ethereum',
      url: 'https://cryptoast.fr/?p=199633',
      date: '2025-12-30T00:00:00Z',
      description:
        'Zama launches its mainnet with a first confidential stablecoin transfer, in cUSDT.',
      type: 'general',
    },
    {
      // ACL 0xcA2E…ffb6: Paused by 0x9436…d827 at 14:17:59 UTC (tx
      // 0x1fe5bf2c…), Unpaused by 0xb6d6…1ef3 at 15:41:47 UTC (tx
      // 0x2a4de4df…). No public explanation found.
      title: 'ACL paused, every token halted',
      url: 'https://etherscan.io/tx/0x1fe5bf2c4c59b4c0034167e8eea979e3a8fa700d590c73ca7587712bb43359b2',
      date: '2026-01-06T00:00:00Z',
      description:
        'A pauser halts the ACL, and with it every confidential token, for 84 minutes.',
      type: 'incident',
    },
    {
      // USDC Blacklisted(ConfidentialUSDCWrapper 0xe978…72B2) at 2026-05-30
      // 01:08 UTC, UnBlacklisted 2026-06-01 18:58 UTC. Zama: a temporary
      // restraining order (N.D. Cal., Overnight Finance dispute, Zama not a
      // party) targeted one deposit of about $12.5M, over 99% of the wrapper.
      // The deposit had passed Zama's sanctions screening. The court lifted
      // the order at its June 1 review. Press names the case Newton AC/DC Fund
      // v. Ermilov.
      title: 'Circle freezes the cUSDC escrow',
      url: 'https://www.zama.org/post/the-freeze-on-zamas-cusdc-contract-has-been-lifted-and-all-systems-are-back-to-normal',
      date: '2026-05-30T00:00:00Z',
      description:
        'A court order makes Circle blacklist the cUSDC wrapper for almost three days, blocking every unwrap.',
      type: 'incident',
    },
  ],
  escrows: trackedWrappers.map(
    ({ wrapper, wrapperSinceTimestamp, underlyingToken }) => ({
      address: ChainSpecificAddress.address(wrapper.address),
      chain: ChainSpecificAddress.longChain(wrapper.address),
      sinceTimestamp: wrapperSinceTimestamp,
      tokens: [underlyingToken.symbol],
    }),
  ),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.confidentialAmounts,
    trackedOn: ['ethereum'],
    tokens: privacyTokens,
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Only amounts are hidden. Every transfer names its sender and recipient.',
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The governance multisigs upgrade the contracts instantly, before users can leave.',
      walkawayTest: {
        passed: false,
        reason: `Every unwrap needs a decryption signed by ${kmsThreshold} of ${kmsSignerCount} KMS operators, and every input needs Zama's coprocessor.`,
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        "The contracts, the SDK and the KMS and coprocessor sources are public. Zama's app source is unpublished.",
    },
    attributes: [
      PRIVACY_ATTRIBUTES.fhe,
      PRIVACY_ATTRIBUTES.privateAmounts,
      PRIVACY_ATTRIBUTES.anyAmount,
      {
        ...PRIVACY_ATTRIBUTES.defi,
        description:
          'Interop with DeFi vaults from within the confidential token.',
      },
    ],
    adversaries: zamaCwAdversaries(kmsKeyThreshold, kmsSignerCount),
    quantumResistant: true,
    riskSummary: readProjectMarkdown('zama-cw', 'riskSummary', {
      kmsSignerCount,
      kmsKeyThreshold,
      coprocessorThreshold,
      coprocessorSignerCount,
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('zama-cw', 'upgradesAndGovernance', {
        multisigAStats,
        multisigBStats,
        gatewaySafeStats,
        aclPauserCount,
        gatewayPauserCount,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
