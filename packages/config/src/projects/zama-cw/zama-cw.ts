import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('zama-cw')

const ZAMA_WRAP_EVENT =
  '0xcda691c81d2fd787d8c209adb4ae8b138f857d7575adf7669195ed05482e701b'
const ZAMA_UNWRAP_FINALIZED_EVENT =
  '0x87061fd1a5b3714805472c94c9eb8a6b8491992ee77791aa2594be67b92fd962'

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
        wrapperRate: discovery.getContractValue<number>(name, 'rate'),
        wrapperSinceTimestamp: UnixTime(wrapper.sinceTimestamp ?? 0),
        underlyingAddress,
        underlyingToken,
      },
    ]
  } catch {
    return []
  }
})

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
    wrapperRate,
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
          event: ZAMA_WRAP_EVENT,
          extractor: 'zamaWrap',
          params: {},
        },
        withdrawal: {
          event: ZAMA_UNWRAP_FINALIZED_EVENT,
          extractor: 'zamaUnwrap',
          params: {
            rate: wrapperRate.toString(),
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
    tokens: privacyTokens,
    summaryTrackedItemName: 'token',
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
    privacy: {
      value: 'Threshold FHE view key',
      sentiment: 'warning',
      description: `The ${kmsThreshold}/${kmsSignerCount} threshold covers only the current Ethereum verifier context. A threshold with usable KMS key shares can decrypt current and past private balances. Zama states that KMS nodes run inside TEEs, but this is not verified onchain. Compliance can be enforced by confidential token owners blocking users and by configured underlying-token denylist hooks during deposits, transfers, unwrap requests, and unwrap finalization.`,
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
    quantumResistant: true,
    riskSummary: readProjectMarkdown('zama-cw', 'riskSummary', {
      kmsThreshold,
      kmsSignerCount,
      coprocessorThreshold,
      coprocessorSignerCount,
    }),
    upgradesAndGovernance: readProjectMarkdown(
      'zama-cw',
      'upgradesAndGovernance',
      {
        multisigAStats,
        multisigBStats,
      },
    ),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
