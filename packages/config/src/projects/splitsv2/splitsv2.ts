import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CROP_NOTES } from '../../common/crops'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('splitsv2')

// The distribution incentive is a uint16 over the Warehouse's percentage scale.
const maxIncentivePercent = (
  (65535 /
    discovery.getContractValue<number>('SplitsWarehouse', 'PERCENTAGE_SCALE')) *
  100
).toFixed(2)

const deployedIn = (contract: string): string => {
  const since = discovery.getContract(contract).sinceTimestamp
  if (since === undefined) {
    throw new Error('Missing deployment time', { cause: { contract } })
  }
  return new Date(since * 1000).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export const splitsv2: BaseProject = {
  id: ProjectId('splitsv2'),
  slug: 'splitsv2',
  name: 'Splits V2',
  shortName: undefined,
  addedAt: UnixTime(1794268800), // 2026-11-10
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
      "Splits V2 divides payments. A split is an address that collects ETH and ERC-20 tokens and pays them out to its recipients by share. A push split pays recipients directly. A pull split credits them in the Warehouse, a shared contract they withdraw from. Anyone can create a split and trigger its payouts. The contracts are immutable, with no protocol owner and no protocol fee. A split's creator can give it an owner, who then controls that split.",
    detailedDescription: readProjectMarkdown(
      'splitsv2',
      'detailedDescription',
      {
        maxIncentivePercent,
        v20Date: deployedIn('PullSplitFactory_v2_0'),
        v21Date: deployedIn('PullSplitFactory_v2_1'),
        v22Date: deployedIn('PullSplitFactory_v2_2'),
      },
    ),
    links: {
      websites: [
        'https://splits.org/',
        'https://lite.splits.org/',
        'https://explorer.splits.org/',
      ],
      documentation: ['https://splits.org/protocol/docs/'],
      repositories: [
        'https://github.com/0xSplits/splits-contracts-monorepo',
        'https://github.com/0xSplits/splits-lite',
        'https://github.com/0xSplits/splits-sdk',
      ],
      socialMedia: ['https://x.com/0xsplits'],
    },
    references: [
      {
        title: 'Splits V2 audit report (Zach Obront)',
        url: 'https://github.com/0xSplits/splits-contracts-monorepo/blob/main/audits/splits-v2.md',
      },
      {
        title:
          'Splits V2 integration notes: push split recipients and token compatibility',
        url: 'https://github.com/0xSplits/splits-contracts-monorepo/blob/main/packages/splits-v2/docs/integration-patterns.md',
      },
      {
        title: "Don't send Mainnet USDT to Immutable V2.1 Splits",
        url: 'https://splits.org/blog/dont-send-mainnet-usdt-to-immutable-v2-1-splits/',
      },
      {
        title: 'USDT paid out from a v2.1 pull split without an owner',
        url: 'https://etherscan.io/tx/0x111748c9c5f5cbcb1429aabd5ab4a95cf65807258131db33c9c6cb00b3a8c3ac',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Payments',
  },
  // Declared empty on purpose: splits and the Warehouse depend on no oracle,
  // bridge or other external contract. The tokens a split receives are chosen
  // by whoever pays it.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        'Anyone can create a split and trigger its payouts, with no permission and no operator in the path.',
        'A recipient can always withdraw its own balance from the Warehouse.',
        CROP_NOTES.passesWalkawayTest(
          'splits and the Warehouse work without the team or its interfaces, and any wallet or contract can call them directly.',
        ),
      ],
      additionalConsiderations: [
        'In a push split, a token that refuses to pay one recipient pays none of them. A token issuer can cause this by blacklisting a single recipient.',
        'A token issuer that blacklists the Warehouse freezes that token for every recipient.',
        'In a push split of up to about ten recipients, a recipient contract can block all ETH payouts.',
        "A split's owner, where its creator set one, can pause its payouts.",
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'GPL-3.0',
      points: [
        'The contracts and the Splits Lite interface are published under the GPL, and the SDK under the MIT license.',
        'The contracts are verified onchain, and a local build of the tagged source reproduces the deployed code.',
        'Splits Lite builds and runs locally. It reads splits from the chain and contacts no Splits server.',
      ],
      additionalConsiderations: [
        'As published, Splits Lite reads the chain through Alchemy. Running it takes an Alchemy key and a WalletConnect project ID.',
        'Splits Lite creates push splits only and withdraws from the Warehouse only as part of a payout. A pull split, or a withdrawal on its own, takes the SDK or a direct contract call.',
      ],
    },
    privacy: {
      status: 'fullyTransparent',
      points: [
        'The protocol does not make privacy claims, and is fully transparent.',
        'Recipients, shares and payouts are public onchain.',
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'The Warehouse, the factories and the split implementations are immutable and have no owner.',
        'No external dependency: no oracle, no bridge.',
        'An independent researcher audited the v2.0 code before its release.',
      ],
      additionalConsiderations: [
        "A split's owner, where its creator set one, can replace its recipients and move its funds.",
        'A split without an owner cannot be repaired. Funds it cannot pay out stay in it, like USDT in a v2.0 pull split on Ethereum.',
        'The changes in v2.1 and v2.2 have no published audit.',
        'No circuit breakers or rate limits. Every pull split pays into one Warehouse, so a bug there would reach all of them.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
