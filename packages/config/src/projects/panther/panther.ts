import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatBasisPoints } from '../../common/formatBasisPoints'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { pantherAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('panther')

const POLYGON = {
  pool: 'matic:0x008DeCe35c2920F08961f493ad7F543Fb796F4de',
  feeMaster: 'matic:0x7aF2a1b6f0C1358624D3047264cFB883FddADF01',
  daoSafe: 'matic:0x208Fb9169BBec5915722e0AfF8B0eeEdaBf8a6f0',
}

const protocolFee = discovery.getContractValue<{
  protocolFeePercentage: number
}>(POLYGON.feeMaster, 'feeParams').protocolFeePercentage

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

interface ZAsset {
  // Token address on the deployment's chain.
  address: string
  // Token list entry for price and icon metadata. Bridged tokens reuse the
  // entry of the same coin on another chain when they are not listed on the
  // deployment's chain.
  metadata: { address: string; chainId: number }
}

const zAsset = (address: string, chainId: number, metadata = address) => ({
  address,
  metadata: { address: metadata, chainId },
})

// zAssets per deployment, from the Panther dApp configuration. ZKP, QUICK and
// the native assets are not tracked: ZKP and QUICK are not in the token list
// yet, and native deposits are not ERC-20 transfers.
const DEPLOYMENTS: { name: string; vault: string; zAssets: ZAsset[] }[] = [
  {
    name: 'polygon',
    vault: 'matic:0xDD1fD1a7b4482Dce1287aFFE6Ca8EA128C7a9046',
    zAssets: [
      zAsset('0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', 137), // USDC
      zAsset(
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH
        1,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ),
      zAsset(
        '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', // WBTC
        1,
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      ),
      zAsset(
        '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', // LINK
        1,
        '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      ),
      zAsset(
        '0xb33EaAd8d922B1083446DC23f610c2567fB5180f', // UNI
        1,
        '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      ),
      zAsset(
        '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', // AAVE
        1,
        '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      ),
      zAsset(
        '0x5fe2B58c013d7601147DcdD68C143A77499f5531', // GRT
        1,
        '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
      ),
    ],
  },
  {
    name: 'base',
    vault: 'base:0x70c69bB8501b30cf112403139a383BF978f4A31e',
    zAssets: [
      zAsset('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 8453), // USDC
      zAsset('0x4200000000000000000000000000000000000006', 8453), // WETH
      zAsset('0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', 8453), // cbBTC
      zAsset('0x940181a94A35A4569E4529A3CDfB74e38FD98631', 8453), // AERO
      zAsset('0x1111111111166b7FE7bd91427724B487980aFc69', 8453), // ZORA
      zAsset(
        '0x63706e401c06ac8513145b7687A14804d17f814b', // AAVE
        1,
        '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      ),
      zAsset(
        '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b', // VIRTUAL
        1,
        '0x44ff8620b8cA30902395A7bD3F2407e1A091BF73',
      ),
      zAsset(
        '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842', // MORPHO
        1,
        '0x58D97B57BB95320F9a05dC918Aef65434969c2B2',
      ),
    ],
  },
  {
    name: 'ethereum',
    vault: 'eth:0x70c69bB8501b30cf112403139a383BF978f4A31e',
    zAssets: [
      zAsset('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 1), // USDC
      zAsset('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 1), // WETH
    ],
  },
]

// Deposits and withdrawals are tracked as ERC-20 transfers into and out of
// each deployment's Vault, which holds every asset of its pool.
const privacyTokens: ProjectPrivacyToken[] = DEPLOYMENTS.flatMap(
  (deployment) => {
    const vault = discovery.getContract(deployment.vault)
    const vaultAddress = ChainSpecificAddress.address(vault.address)
    const deployedAt = UnixTime(vault.sinceTimestamp ?? 0)

    return deployment.zAssets.map(({ address, metadata }) => {
      const info = getTokenByAddress(metadata.address, metadata.chainId)
      // Prices must cover the whole bucket range, so never start before listing.
      const sinceTimestamp = Math.max(
        deployedAt,
        info.coingeckoListingTimestamp,
      )
      return {
        token: {
          address: EthereumAddress(address),
          iconUrl: info.iconUrl,
          symbol: info.symbol,
          decimals: info.decimals,
          priceId: info.coingeckoId,
          sinceTimestamp,
        },
        buckets: [
          {
            id: `panther-${deployment.name}-${info.symbol}`,
            type: 'pool',
            label: info.symbol,
            address: vault.address,
            sinceTimestamp,
            deposit: {
              event: ERC20_TRANSFER_EVENT,
              extractor: 'erc20Transfer',
              params: { to: vaultAddress },
            },
            withdrawal: {
              event: ERC20_TRANSFER_EVENT,
              extractor: 'erc20Transfer',
              params: { from: vaultAddress },
            },
          },
        ],
      }
    })
  },
)

const AUDITS_REPO = 'https://github.com/pantherfoundation/audits'

export const panther: BaseProject = {
  id: ProjectId('panther'),
  slug: 'panther',
  name: 'Panther Protocol',
  shortName: 'Panther',
  addedAt: UnixTime.fromDate(new Date('2026-09-29')),
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
      'A multichain, compliance-oriented shielded pool with private transfers and in-pool swaps. Users must pass KYC to open a zAccount, and every transaction is escrow-encrypted to designated operators.',
    detailedDescription: readProjectMarkdown('panther', 'detailedDescription', {
      protocolFee: formatBasisPoints(protocolFee),
    }),
    links: {
      websites: [
        'https://panther.org',
        'https://pantherprotocol.io',
        'https://pantherdao.app',
      ],
      documentation: [
        'https://docs.pantherprotocol.io',
        'https://blog.pantherprotocol.io',
      ],
      repositories: [
        'https://github.com/pantherfoundation/panther-core',
        'https://github.com/pantherfoundation/trusted-setup-ceremony',
      ],
      socialMedia: [
        'https://x.com/ZKPanther',
        'https://t.me/pantherprotocol',
        'https://discord.gg/EST99KpuGX',
      ],
      other: ['https://snapshot.org/#/s:pantherprotocol.eth', AUDITS_REPO],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Panther Protocol',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    audits: [
      {
        company: 'Veridise',
        url: `${AUDITS_REPO}/blob/main/Veridise%20Panther%20Protocol%20250425.pdf`,
      },
      {
        company: 'Veridise',
        url: `${AUDITS_REPO}/blob/main/VAR_panther_250912_internal_transfers.pdf`,
      },
    ],
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.PantherV1,
      },
    ],
    verifierHashes: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    trackedOn: ['polygonpos', 'base', 'ethereum'],
    tokens: privacyTokens,
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'Snapshot votes are executed through Reality.eth modules, and the same DAO signers can also act directly through the Safes. Either way the diamonds, the Vault and the verifying keys can be changed without a delay that lets users exit first.',
      walkawayTest: {
        passed: false,
        reason:
          'Every withdrawal needs a fresh KYT signature from a trust provider, an unexpired KYC-backed zAccount and a proof against the current static root maintained by the owner. There is no forced withdrawal.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contracts, circuits, crypto library and trusted setup ceremony are public. The dApp and the KYC/KYT signing services are not.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: pantherAdversaries,
    riskSummary: readProjectMarkdown('panther', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('panther', 'upgradesAndGovernance', {
        daoSignerStats: discovery.getMultisigStats(POLYGON.daoSafe),
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [ChainSpecificAddress(POLYGON.pool)],
  },
}
