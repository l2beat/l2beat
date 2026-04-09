import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('aave-v4')

// Aave V4 ships as a hub-and-spoke lending protocol. The Hub holds the
// per-asset accounting (interest rate strategy, treasury, premium, spoke
// whitelist) and the Spokes hold the per-chain reserves and liquidation
// logic. On Ethereum we currently see 3 Hubs (Main, CorePrime, Ethena)
// and 10 Spokes (markets) sharing one OpenZeppelin V5 AccessManager.

const NUM_SPOKES = discovery
  .getContracts()
  .filter((c) => c.template === 'aave-v4/SpokeInstance').length
const NUM_HUBS = discovery
  .getContracts()
  .filter((c) => c.template === 'aave-v4/HubInstance').length

export const aavev4: BaseProject = {
  id: ProjectId('aave-v4'),
  slug: 'aave-v4',
  name: 'Aave V4',
  shortName: undefined,
  addedAt: UnixTime(1775720000), // 2026-04-08
  // tags
  isScaling: true, // route hack: only the scaling project page renders contracts + permissions
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: 'inReview',
    unverifiedContracts: [],
  },
  display: {
    description:
      'Aave V4 is a lending protocol. Users deposit assets to earn yield from borrowers, or post collateral to borrow against it; positions stay open as long as they remain overcollateralized, otherwise they get liquidated. V4 splits the deposits across several risk-isolated markets per chain so a problem in one market is contained.',
    links: {
      websites: ['https://aave.com/'],
      documentation: ['https://aave.com/docs'],
      repositories: ['https://github.com/aave-dao/aave-v4'],
      socialMedia: [
        'https://x.com/aave',
        'https://discord.com/invite/aave',
        'https://t.me/Aavesome',
      ],
    },
    badges: [],
  },
  scalingInfo: {
    layer: 'layer2',
    type: 'Other',
    capability: 'appchain',
    reasonsForBeingOther: [
      {
        label: 'DeFi protocol',
        shortDescription:
          'Aave V4 is a DeFi lending protocol on Ethereum, not a scaling solution.',
        description:
          'Aave V4 is tracked here for its discovery-driven contract and permission map. It is not a scaling solution: it is a hub-and-spoke lending protocol that lives on Ethereum (and other chains via cross-chain spokes).',
      },
    ],
    hostChain: {
      id: ProjectId.ETHEREUM,
      slug: 'ethereum',
      name: 'Ethereum',
      shortName: undefined,
    },
    stacks: undefined,
    raas: undefined,
    infrastructure: undefined,
    vm: ['EVM'],
    daLayer: ['Ethereum (calldata)'],
    stage: 'Not applicable',
    purposes: ['Lending'],
    scopeOfAssessment: undefined,
    proofSystem: undefined,
  },
  scalingStage: { stage: 'NotApplicable' },
  scalingRisks: {
    self: {
      stateValidation: { value: 'N/A', sentiment: 'neutral' },
      dataAvailability: { value: 'N/A', sentiment: 'neutral' },
      exitWindow: { value: 'N/A', sentiment: 'neutral' },
      sequencerFailure: { value: 'N/A', sentiment: 'neutral' },
      proposerFailure: { value: 'N/A', sentiment: 'neutral' },
    },
    host: undefined,
    stacked: undefined,
  },
  scalingTechnology: {
    detailedDescription: `
## What is Aave V4

Aave is a lending protocol. Users come to Aave to do one of two things:

- **Earn yield on assets they're not actively using.** A user deposits an asset (USDC, ETH, wstETH, ...) into a market and immediately starts accruing interest paid by borrowers of that same asset. The deposit is liquid: it can be withdrawn at any time as long as the market has spare liquidity, and the deposit can also be used as collateral for borrowing without giving up the yield.
- **Borrow against collateral they want to keep.** A user posts collateral (typically ETH, an LST like wstETH/weETH/rsETH, BTC, or another supported asset) and draws a loan in a different asset (often a stable like USDC, USDT, GHO). The loan accrues interest at a rate that floats with how much of the supply side is currently being borrowed. As long as the position stays sufficiently overcollateralized, it stays open indefinitely; if the collateral value drops too far, anyone can liquidate the position by repaying part of the debt and seizing collateral at a discount.

Both flows happen through the same per-market contract on the chain the user is on. Internally, every deposit, borrow, repay, withdraw, and liquidation goes through the **Spoke** for that market, which talks to a shared **Hub** that does the cross-chain accounting (so global supply and borrow numbers per asset are consistent across every chain Aave V4 lives on). Prices come from a per-spoke **AaveOracle** that wraps Chainlink feeds with a growth-rate cap; interest rate parameters per asset come from an **InterestRateStrategy**; the protocol's revenue share is sent to a single **Treasury**.

The big design choice in V4 is that markets are **risk-isolated**. Instead of one pool with every asset listed, V4 deploys several Spokes on each chain: a main blue-chip Spoke, a pure-stables Spoke, a BTC Spoke, separate Spokes for Ethena (USDe / sUSDe / Pendle PTs), and a correlated-LST Spoke per ETH derivative (wstETH, weETH, rsETH). A risk event in one market (a depeg, an oracle failure, a governance pause) is contained to that Spoke and can't drain collateral that's posted in another.

## Architecture

Aave V4 splits its protocol into two contract families that talk to each other across chains:

- A **Hub** holds the per-asset accounting that needs to be globally consistent across chains: the registry of supported assets, the per-asset interest rate strategy, the per-asset spoke registry, and the per-asset treasury split.
- A **Spoke** sits on a specific chain, holds the actual asset reserves and the per-reserve config (collateral and borrow flags, freeze, pause, oracle source), and routes liquidity through its paired Hub.

On Ethereum, the discovery surfaces ${NUM_HUBS} Hubs and ${NUM_SPOKES} Spokes. The Spokes are organized by market type: a main "Prime" spoke that lists most blue-chip assets, plus several risk-isolated spokes for stables, BTC, Ethena, and the major correlated-LST pairs (wstETH, weETH, rsETH).

## Trust map

Every privileged action on every Hub and every Spoke is gated through one OpenZeppelin V5 **AccessManager**. The AccessManager is the protocol's single trust root: whoever holds the role members registered there can reconfigure reserves, change interest rate parameters, swap interest rate strategies, swap oracles, freeze and pause markets, and (via the proxy admins) upgrade the implementations.

The AccessManager itself is owned by an Aave Governance V3 **Executor**. Aave V4 inherits its top-level governance from Aave Governance V3: any change to the AccessManager configuration ultimately has to be scheduled and ratified by Aave Governance V3 proposals.

## Oracles

Each Spoke has its own paired **AaveOracle** that exposes one price source per reserveId. The price sources are typically Aave-deployed **PriceCapAdapters** that wrap a Chainlink feed (or for liquid-staked / wrapped assets, a ratio provider) with a growth-rate cap. The cap can only be re-snapshotted or re-armed by addresses with the appropriate role on the **ACLManager** (a separate, legacy bytes32 access-control contract distinct from the V5 AccessManager).
`,
    otherConsiderations: [
      {
        name: 'Cross-chain spoke registry',
        description:
          "The Hub keeps a per-asset list of every Spoke that holds that asset, across all chains. The discovery on Ethereum only walks the Spokes deployed on Ethereum; sibling Spokes on other chains exist but are out of scope for this project entry. The Hub's getSpokeCount per-asset numbers (3-7 across the 17 assets on the main Hub) reflect the full cross-chain spoke set.",
        references: [],
        risks: [],
      },
      {
        name: 'Multi-market topology',
        description: `Aave V4 deploys ${NUM_SPOKES} distinct Spokes on Ethereum, each with its own asset list and risk parameters. The discovery names them by their primary asset cluster (MainSpoke, StablesSpoke, BTCSpoke, EthenaIsolatedSpoke, RsETHCorrelatedSpoke, ...). All Spokes share the same AccessManager and the same governance chain, so a single Aave Governance V3 vote can reconfigure any of them.`,
        references: [],
        risks: [],
      },
    ],
  },
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious code upgrade is pushed through the AccessManager / Aave Governance V3 chain. Upgrade authority on every Hub, Spoke and Treasury proxy reduces to addresses controlled by Aave Governance V3.',
      },
      {
        category: 'Funds can be lost if',
        text: 'an oracle source returned by AaveOracle.getReserveSource is manipulated. Several reserves rely on Aave-deployed PriceCapAdapters that cap growth but ultimately wrap a Chainlink feed; the cap can be re-armed by ACLManager role members.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'a privileged role on the AccessManager freezes or pauses a Spoke or its reserves.',
      },
    ],
  },
  permissions: discovery.getDiscoveredPermissions(),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
