import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('zama')

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
        id: `zama-${wrapperSymbol}`,
        type: 'pool',
        label: `${wrapperSymbol} wrapper`,
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

export const zama: BaseProject = {
  id: ProjectId('zama'),
  slug: 'zama',
  name: 'Zama',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-06-24')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning:
      'Privacy depends on an offchain FHE coprocessor and threshold KMS signer set; Ethereum only verifies their signatures.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'An Ethereum confidential token system that wraps ERC-20 assets and hides balances and transfer amounts using Zama FHEVM.',
    detailedDescription: readProjectMarkdown('zama', 'detailedDescription', {
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
  chainConfig: {
    name: 'zama',
    chainId: 261131,
    explorerUrl: 'https://explorer.mainnet.zama.org',
    apis: [
      { type: 'rpc', url: 'https://rpc.mainnet.zama.org', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://explorer.mainnet.zama.org/api' },
      {
        type: 'blockscoutV2',
        url: 'https://explorer.mainnet.zama.org/api/v2',
      },
    ],
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
    trustedSetup: TRUSTED_SETUPS.TransparentSetup,
    tokens: privacyTokens,
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The wrapper and system contracts are upgradeable without an onchain delay, so users do not get a guaranteed withdrawal window before changes take effect.',
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The smart contracts are source-available, but users also rely on offchain FHE execution and threshold decryption services whose outputs are accepted onchain through signature verification.',
    },
    adminViewingKey: {
      value: `${kmsThreshold}/${kmsSignerCount} KMS threshold`,
      sentiment: 'warning',
      description:
        'There is no simple single-address viewing key, but public decryptions are accepted when enough KMS signers attest to them. Privacy assumes fewer than the KMS threshold collude or are compromised.',
    },
    attributes: [
      {
        ...PRIVACY_ATTRIBUTES.upgradeable,
        description:
          'The wrapper, ACL, FHE executor, KMS verifier, input verifier, and DAO components are upgradeable.',
      },
      {
        ...PRIVACY_ATTRIBUTES.enforcedCompliance,
        description:
          'Wrapper owners can block users and wrappers can enforce configured underlying-token denylist hooks during deposits, transfers, unwrap requests, and unwrap finalization.',
      },
      {
        ...PRIVACY_ATTRIBUTES.transfers,
        description:
          'Privacy is limited to transfer amounts and balances, sender and recipient are public.',
      },
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.closedSource,
    ],
    riskSummary: readProjectMarkdown('zama', 'riskSummary', {
      kmsThreshold,
      kmsSignerCount,
      coprocessorThreshold,
      coprocessorSignerCount,
    }),
    upgradesAndGovernance: readProjectMarkdown(
      'zama',
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
