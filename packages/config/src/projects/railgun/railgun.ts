import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatBasisPoints } from '../../common/formatBasisPoints'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import {
  getTokenByAddress,
  getTokenBySymbol,
} from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { railgunAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('railgun')

const RAILGUN_DEPOSIT_EVENT =
  '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b'
const RAILGUN_WITHDRAWAL_EVENT =
  '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284'

/** A tracked token, by symbol, with an address when the symbol is ambiguous on the chain. */
type RailgunTokenRef = string | { symbol: string; address: string }

interface RailgunDeployment {
  chain: string
  chainId: number
  /** Tokens the pool holds in meaningful amounts, researched from its balances. */
  tokens: RailgunTokenRef[]
}

// The primary chain comes first. Bucket ids on Ethereum predate the other
// chains and stay as they are, so no Ethereum data resyncs.
const DEPLOYMENTS: RailgunDeployment[] = [
  {
    chain: 'ethereum',
    chainId: 1,
    tokens: [
      'WETH',
      'USDT',
      'USDC',
      'DAI',
      'WBTC',
      // Rainbow-bridged NEAR, not the native one of the same symbol.
      { symbol: 'NEAR', address: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4' },
      'FLUID',
      'RAIL',
    ],
  },
  {
    chain: 'arbitrum',
    chainId: 42161,
    // The token list spells Arbitrum's wrapped BTC "wBTC".
    tokens: ['WETH', 'USDC', 'USDC.e', 'USDT', 'wBTC', 'DAI', 'ARB'],
  },
  {
    chain: 'bsc',
    chainId: 56,
    tokens: ['WBNB', 'USDT', 'BUSD', 'USDC'],
  },
  {
    chain: 'polygonpos',
    chainId: 137,
    tokens: [
      // Native USDC. The PoS-bridged USDC.e shares the symbol in the token list,
      // so tvs.json keeps it apart as the custom token railgun-polygonpos-USDC.e:
      // both at one escrow in one token would collide in the escrow value table.
      { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' },
      'USDT0',
      'WPOL',
      'TEL',
      'DAI',
      'WETH',
    ],
  },
]

const RAIL_TOKEN = getTokenBySymbol('RAIL')

// Governance and fee parameters in the descriptions come from Ethereum, the
// primary chain. Contract names repeat across chains, so lookups name the chain.
const railgunCore = discovery.getContract('RailgunSmartWallet', 'ethereum')
const ethereumContract = (name: string) =>
  discovery.getContract(name, 'ethereum').address.toString()
const shieldFee = discovery.getContractValue<number>(
  railgunCore.address,
  'shieldFee',
)
const unshieldFee = discovery.getContractValue<number>(
  railgunCore.address,
  'unshieldFee',
)
const nftFee = discovery.getContractValue<number>(railgunCore.address, 'nftFee')
const ethereumStaking = ethereumContract('Staking')
const ethereumVoting = ethereumContract('Voting')
const stakeLocktime = discovery.getContractValue<number>(
  ethereumStaking,
  'STAKE_LOCKTIME',
)
const proposalSponsorThreshold = discovery.getContractValueBigInt(
  ethereumVoting,
  'PROPOSAL_SPONSOR_THRESHOLD',
)
const sponsorWindow = discovery.getContractValue<number>(
  ethereumVoting,
  'SPONSOR_WINDOW',
)
const votingStartOffset = discovery.getContractValue<number>(
  ethereumVoting,
  'VOTING_START_OFFSET',
)
const votingYayEndOffset = discovery.getContractValue<number>(
  ethereumVoting,
  'VOTING_YAY_END_OFFSET',
)
const votingNayEndOffset = discovery.getContractValue<number>(
  ethereumVoting,
  'VOTING_NAY_END_OFFSET',
)
const executionStartOffset = discovery.getContractValue<number>(
  ethereumVoting,
  'EXECUTION_START_OFFSET',
)
const executionEndOffset = discovery.getContractValue<number>(
  ethereumVoting,
  'EXECUTION_END_OFFSET',
)
const quorum = discovery.getContractValueBigInt(ethereumVoting, 'QUORUM')
const railTotalSupply = discovery.getContractValueBigInt(
  'Rail Token',
  'totalSupply',
)
const railTreasuryBalance = Number(
  discovery
    .getContractValue<string>(ethereumContract('Treasury'), 'RAILBalance')
    .replaceAll(',', ''),
)
const railStaked = Number(
  discovery
    .getContractValue<string>(ethereumStaking, 'RAILStaked')
    .replaceAll(',', ''),
)
const RAILGUN_SINCE_TIMESTAMP = UnixTime(railgunCore.sinceTimestamp ?? 0)

/**
 * The shared thresholds are in the base units of the Ethereum token of that
 * symbol. The same token elsewhere may use other decimals (USDT and USDC on
 * BSC have 18), so the thresholds are rescaled to the chain's decimals.
 */
function scaleMinimumAmounts(
  symbol: string,
  decimals: number,
): string[] | undefined {
  const amounts = PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[symbol]
  if (amounts === undefined) return undefined
  const shift = decimals - getTokenBySymbol(symbol).decimals
  if (shift === 0) return amounts
  assert(shift > 0, `Railgun: ${symbol} has fewer decimals than on Ethereum`)
  return amounts.map((amount) => `${amount}${'0'.repeat(shift)}`)
}

const privacyTokens: ProjectPrivacyToken[] = DEPLOYMENTS.flatMap(
  (deployment) => {
    const pool = discovery.getContract('RailgunSmartWallet', deployment.chain)
    return deployment.tokens.map((ref) => {
      const resolved =
        typeof ref === 'string'
          ? getTokenBySymbol(ref, deployment.chainId)
          : getTokenByAddress(ref.address, deployment.chainId)
      const address = resolved.address
      assert(address, `Railgun: ${resolved.symbol} has no address`)
      const minimumAmounts = scaleMinimumAmounts(
        resolved.symbol,
        resolved.decimals,
      )
      const bucketId =
        deployment.chain === 'ethereum'
          ? `railgun-${resolved.symbol}`
          : `railgun-${deployment.chain}-${resolved.symbol}`

      return {
        token: {
          chain: deployment.chain,
          address: EthereumAddress(address),
          iconUrl: resolved.iconUrl,
          symbol: resolved.symbol,
          decimals: resolved.decimals,
          priceId: resolved.coingeckoId,
          sinceTimestamp: resolved.coingeckoListingTimestamp,
        },
        buckets: [
          {
            id: bucketId,
            type: 'pool',
            label: resolved.symbol,
            address: pool.address,
            sinceTimestamp: Math.max(
              pool.sinceTimestamp ?? 0,
              resolved.coingeckoListingTimestamp,
            ),
            anonymitySet:
              minimumAmounts === undefined ? undefined : { minimumAmounts },
            deposit: {
              event: RAILGUN_DEPOSIT_EVENT,
              extractor: 'railgunShield',
              params: {
                tokenAddress: EthereumAddress(address),
              },
            },
            withdrawal: {
              event: RAILGUN_WITHDRAWAL_EVENT,
              extractor: 'railgunUnshield',
              params: {
                tokenAddress: EthereumAddress(address),
              },
            },
          },
        ],
      }
    })
  },
)

export const railgun: BaseProject = {
  id: ProjectId('railgun'),
  slug: 'railgun',
  name: 'Railgun',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-05-12')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger for ERC-20 tokens on Ethereum, Arbitrum, BSC and Polygon PoS, with private transfers and DeFi calls, run by no operator and governed by RAIL stakers.',
    detailedDescription: readProjectMarkdown('railgun', 'detailedDescription', {
      shieldFee: formatBasisPoints(shieldFee),
      unshieldFee: formatBasisPoints(unshieldFee),
      nftFee,
      executionDelay: formatSeconds(executionStartOffset, { fullUnit: true }),
    }),
    links: {
      websites: ['https://railgun.org'],
    },
    badges: [],
  },
  milestones: [
    {
      // ProxyUpgrade and ProxyUnpause in tx 0x2bd98cd1…, implementation
      // RailgunLogic 0xbcfa4de7…
      title: 'Current pool goes live on Ethereum',
      url: 'https://etherscan.io/tx/0x2bd98cd135e2eaf7b7239bb4951a043f655629b5d0f0ca12334ce05718512361',
      date: '2022-05-08T00:00:00Z',
      description:
        "The proxy that holds today's pool is unpaused with the RailgunLogic implementation.",
      type: 'general',
    },
  ],
  // One escrow per token and chain, from the pool's deployment, as before.
  escrows: privacyTokens.map((token) => {
    const pool = discovery.getContract('RailgunSmartWallet', token.token.chain)
    return {
      address: ChainSpecificAddress.address(pool.address),
      chain: token.token.chain,
      sinceTimestamp: pool.sinceTimestamp ?? 0,
      tokens: [token.token.symbol],
    }
  }),
  tvsInfo: {
    associatedTokens: [{ symbol: RAIL_TOKEN.symbol, icon: RAIL_TOKEN.iconUrl }],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Railgun',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Railgun,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('railgun'),
        sinceTimestamp: RAILGUN_SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Railgun 91 circuit verifier 03.07.2026',
        name: 'Railgun verifier',
        sourceLink:
          'https://github.com/Railgun-Privacy/circuits-v2/tree/0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb/src/library',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'railgun',
          'verificationSteps-03.07.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: {
      name: 'RailOxide',
      icon: 'railoxide',
      url: 'https://github.com/triamazikamno/railoxide',
      since: '2026-10-08',
      version: '0.2.0-beta.10',
      source: {
        repository: 'https://github.com/triamazikamno/railoxide',
        commit: '7981f35afe8fe5a198a450e0cad66d37f159556e',
      },
      checkedApps: [
        {
          name: 'Railway',
          icon: 'railway',
          finding:
            "Asks a PPoI node about the user's notes in batches without Tor, so the node can tie them together and to the user's IP.",
          fix: 'Build PPoI from a local copy of the lists, as RailOxide does.',
          source:
            'https://github.com/Railgun-Community/wallet/blob/5c9d04c844879b8377d91775052e88c836b48730/src/services/poi/wallet-poi-node-interface.ts#L140-L176',
        },
        {
          name: 'Anon Wallet',
          icon: 'anon-wallet',
          finding:
            "Sends the user's public and 0zk addresses to Anon's server at setup, even without a username, so Anon can link them.",
          fix: "Create wallets without registering the user's addresses with Anon's server.",
          source:
            'https://chromewebstore.google.com/detail/anon-wallet-private-evm-w/gnkbgepgknkbhnnbaihklcfkjhbclajk',
          checked: '2026-10-27',
        },
        {
          name: 'Terminal Wallet',
          icon: 'terminal-wallet',
          finding:
            "Asks a PPoI node about the user's notes in batches without Tor, so the node can tie them together and to the user's IP.",
          fix: 'Build PPoI from a local copy of the lists, as RailOxide does.',
          source:
            'https://github.com/Terminal-Wallet/terminal-wallet-cli/blob/503d322dda11da81b47178bbd514dc258825a2bc/src/railgun/engine/engine.ts#L144-L155',
        },
        {
          name: 'Faceless',
          icon: 'faceless',
          finding:
            "Asks a PPoI node about the user's notes in batches, so the node can tie them together.",
          fix: 'Build PPoI from a local copy of the lists, as RailOxide does.',
          source: 'https://facelessprivacy.eth.limo',
          checked: '2026-10-27',
        },
      ],
    },
    deployedOn: DEPLOYMENTS.map((deployment) => deployment.chain),
    trackedOn: DEPLOYMENTS.map((deployment) => deployment.chain),
    tokens: privacyTokens,
    relayerTracking: {
      type: 'railgunWaku',
      // Every Waku broadcaster serves one chain id. Sampling observes the
      // current network state, so there is no history to backfill before the
      // first deployment of each sampler.
      sources: [
        { chainId: 1, sinceTimestamp: UnixTime(1788134400) }, // 2026-08-31
        { chainId: 42161, sinceTimestamp: UnixTime(1793577600) }, // 2026-11-02
        { chainId: 56, sinceTimestamp: UnixTime(1793577600) }, // 2026-11-02
        { chainId: 137, sinceTimestamp: UnixTime(1793577600) }, // 2026-11-02
      ],
    },
    exitWindow: {
      value: formatSeconds(executionStartOffset),
      sentiment: 'warning',
      orderHint: executionStartOffset,
      description: `DAO-approved upgrades wait ${formatSeconds(executionStartOffset)} before execution, so users can unshield before a change they reject.`,
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, circuits, and supporting software needed to participate in the protocol are publicly available and can be run locally.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: railgunAdversaries(
      formatSeconds(executionStartOffset, { fullUnit: true }),
    ),
    riskSummary: readProjectMarkdown('railgun', 'riskSummary', {
      executionDelay: formatSeconds(executionStartOffset, { fullUnit: true }),
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('railgun', 'upgradesAndGovernance'),
      governanceInfo: {
        upgrades: {
          'Normal upgrade path': {
            steps: [
              {
                description:
                  'Create a proposal with an IPFS link and onchain calldata in the [Voting contract](https://etherscan.io/address/0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC)',
              },
              {
                description: `Collect **${formatNumber(Number(proposalSponsorThreshold / 10n ** 18n))} RAIL** sponsorship within ${formatSeconds(sponsorWindow)}`,
              },
              {
                description: `Wait ${formatSeconds(votingStartOffset)}`,
                isWait: true,
              },
              {
                description: `Cast Yay votes within ${formatSeconds(votingYayEndOffset)} and Nay votes within ${formatSeconds(votingNayEndOffset)}`,
              },
              {
                description: `Pass with a simple majority and **${formatNumber(Number(quorum / 10n ** 18n))} RAIL** quorum`,
              },
              {
                description: `Wait ${formatSeconds(executionStartOffset)}`,
                isWait: true,
              },
              {
                description: `Permissionless execution through the Delegator within ${formatSeconds(executionEndOffset)}`,
              },
            ],
          },
          'Exit window': `**${formatSeconds(executionStartOffset)}** — a passed proposal must wait this long before it can be executed, giving users time to unshield funds.`,
        },
        tokenGovernance: {
          'Governance token': `\`RAIL\` 1 token = 1 vote, delegated. Total supply: **${formatNumber(Number(railTotalSupply / 10n ** 18n))} RAIL**, DAO-owned treasury (unavailable for voting): **${formatNumber(railTreasuryBalance)} RAIL**, staked for voting: **${formatNumber(railStaked)} RAIL**, the rest is circulating supply.`,
          'Stake lock': `Unstaking has **${formatSeconds(stakeLocktime)}** delay.`,
          'Voting venue':
            '[Voting contract](https://etherscan.io/address/0xc480F68A3dcC3EdD82134FAB45C14A0FcF1dA3CC) on Ethereum. Proposal text is distributed over IPFS, its CID is available as a parameter of `createPropsal()` call on the voting contract.',
          'Proposal threshold': `**No threshold to create a proposal.** A proposal must receive sponsorship from **${formatNumber(Number(proposalSponsorThreshold / 10n ** 18n))} RAIL** stake within ${formatSeconds(sponsorWindow)}.`,
          Quorum: `**${formatNumber(Number(quorum / 10n ** 18n))} RAIL**, with a simple majority required for acceptance.`,
          'Execution model': `**Onchain calldata · Permissionless execution through the Delegator.** A passed proposal waits ${formatSeconds(executionStartOffset)}, after which anyone can execute it through the [Delegator contract](https://etherscan.io/address/0xB6d513f6222Ee92Fff975E901bd792E2513fB53B) within ${formatSeconds(executionEndOffset)}.`,
        },
      },
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [railgunCore.address],
  },
}
