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
const multisigAStats = discovery.getMultisigStats('ZamaGovMultisigA')
const multisigBStats = discovery.getMultisigStats('ZamaGovMultisigB')

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
      'Zama Confidential Tokens is an app that wraps ERC-20 assets into confidential tokens and hides balances and transfer amounts using Zama FHEVM on Ethereum.',
    detailedDescription: readProjectMarkdown('zama-cw', 'detailedDescription', {
      kmsThreshold,
      kmsSignerCount,
      coprocessorThreshold,
      coprocessorSignerCount,
    }),
    links: {
      websites: ['https://www.zama.org'],
      documentation: ['https://docs.zama.org/protocol'],
      repositories: ['https://github.com/zama-ai'],
    },
    badges: [],
  },
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
        'Zama confidential tokens hide amounts, but sender and receiver addresses remain public and are not mixed in a shared anonymity set.',
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The confidential token contracts and system contracts are upgradeable without an onchain delay, so users do not get a guaranteed withdrawal window before changes take effect.',
      walkawayTest: {
        passed: false,
        reason: `Only KMS ${kmsThreshold}/${kmsSignerCount} multisig members can decrypt FHE ciphertext. Also, FHE coprocessor operator is currently essential for protocol liveness.`,
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The smart contracts are source-available, but users also rely on offchain FHE execution and threshold decryption services whose outputs are accepted onchain through signature verification. The offchain data cannot currently be fully reproduced from Ethereum DA.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.fhe,
      PRIVACY_ATTRIBUTES.privateAmounts,
      PRIVACY_ATTRIBUTES.anyAmount,
      {
        ...PRIVACY_ATTRIBUTES.defi,
        description:
          'Interop with DeFi (swaps, vaults) from within the confidential token.',
      },
    ],
    adversaries: zamaCwAdversaries,
    riskSummary: readProjectMarkdown('zama-cw', 'riskSummary', {
      kmsThreshold,
      kmsSignerCount,
      coprocessorThreshold,
      coprocessorSignerCount,
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('zama-cw', 'upgradesAndGovernance', {
        multisigAStats,
        multisigBStats,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
