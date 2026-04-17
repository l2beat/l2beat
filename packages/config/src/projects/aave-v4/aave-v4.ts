import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import generatedTokens from '../../tokens/generated.json'
import type { BaseProject } from '../../types'

// Build address -> symbol lookup from the token registry
const tokenSymbols: Record<string, string> = {}
for (const t of generatedTokens.tokens) {
  if (t.chainId === 1 && t.address) {
    tokenSymbols[t.address.toLowerCase()] = t.symbol
  }
}

const discovery = new ProjectDiscovery('aave-v4')

// Aave V4 ships as a hub-and-spoke lending protocol. The Hub holds the
// per-asset accounting (interest rate strategy, treasury, premium, spoke
// whitelist) and the Spokes hold the per-chain reserves and liquidation
// logic. On Ethereum we currently see 3 Hubs (Main, CorePrime, Ethena)
// and 10 Spokes (markets) sharing one OpenZeppelin V5 AccessManager.

const contracts = discovery.getContracts()
const NUM_SPOKES = contracts.filter(
  (c) => c.template === 'aave-v4/SpokeInstance',
).length
const NUM_HUBS = contracts.filter(
  (c) => c.template === 'aave-v4/HubInstance',
).length
const NUM_PRICE_ADAPTERS = contracts.filter(
  (c) => c.template === 'aave-v4/PriceCapAdapter',
).length

// Resolve an eth: address to a token symbol
function tokenName(addr: string): string {
  const raw = addr.replace('eth:', '').toLowerCase()
  return tokenSymbols[raw] ?? addr.slice(0, 10) + '...'
}

// Map hub addresses to names
const hubNames: Record<string, string> = {}
for (const c of contracts.filter(
  (c) => c.template === 'aave-v4/HubInstance',
)) {
  hubNames[c.address.toString()] = c.name ?? c.address.toString()
}

type ReserveValue = { underlying: string; hub: string }
type LiqConfig = {
  targetHealthFactor: string
  healthFactorForMaxBonus: string
  liquidationBonusFactor: number
}

// Build per-spoke detail with per-hub reserve grouping
const spokeEntries = contracts.filter(
  (c) => c.template === 'aave-v4/SpokeInstance',
)
const spokeDetails = spokeEntries
  .map((s) => {
    const reserves = (s.values?.getReserve as ReserveValue[]) ?? []
    const liq = s.values?.getLiquidationConfig as LiqConfig | undefined
    const thf = liq
      ? (Number(liq.targetHealthFactor) / 1e18).toFixed(2)
      : '?'
    const mbhf = liq
      ? (Number(liq.healthFactorForMaxBonus) / 1e18).toFixed(2)
      : '?'
    const bf = liq
      ? (liq.liquidationBonusFactor / 100).toFixed(0) + '%'
      : '?'

    // Group reserves by hub
    const byHub: Record<string, string[]> = {}
    for (const r of reserves) {
      const hub = hubNames[r.hub] ?? r.hub
      byHub[hub] ??= []
      byHub[hub].push(tokenName(r.underlying))
    }
    // Per-reserve detail with flags
    const configs = (s.values?.getReserveConfig as {
      borrowable: boolean
      paused: boolean
      frozen: boolean
    }[]) ?? []

    const reserveLines = reserves.map((r, i) => {
      const symbol = tokenName(r.underlying)
      const hub = hubNames[r.hub] ?? r.hub
      const cfg = configs[i]
      const flags = []
      if (cfg?.borrowable) flags.push('borrowable')
      if (!cfg?.borrowable) flags.push('supply-only')
      if (cfg?.paused) flags.push('PAUSED')
      if (cfg?.frozen) flags.push('FROZEN')
      return `- ${symbol} → ${hub} (${flags.join(', ')})`
    }).join('\n')

    return `**${s.name}** — ${reserves.length} reserves, target HF ${thf}, max bonus HF ${mbhf}, bonus ${bf}\n\n${reserveLines}`
  })
  .join('\n\n')


// Hub detail builder
type AssetStruct = {
  underlying: string
  irStrategy: string
  feeReceiver: string
  liquidityFee: number
  reinvestmentController: string
  decimals: number
  liquidity: string
  drawnShares: string
  drawnRate: string
  deficitRay: number
}
type AssetConfig = {
  feeReceiver: string
  liquidityFee: number
  irStrategy: string
  reinvestmentController: string
}
type RateData = {
  optimalUsageRatio: number
  baseDrawnRate: number
  rateGrowthBeforeOptimal: number
  rateGrowthAfterOptimal: number
}

const hubList = ['CoreHub', 'PrimeHub', 'PlusHub'] as const
const strategyNames: Record<string, string> = {}
for (const c of contracts.filter(
  (c) => c.template === 'aave-v4/AssetInterestRateStrategy',
)) {
  strategyNames[c.address.toString()] = c.name ?? c.address.toString()
}

function buildHubDetail(hubName: string): string {
  const assetCount = discovery.getContractValue<number>(hubName, 'getAssetCount')
  const assets = discovery.getContractValue<AssetStruct[]>(hubName, 'getAsset')
  const configs = discovery.getContractValue<AssetConfig[]>(hubName, 'getAssetConfig')
  const spokeCounts = discovery.getContractValue<number[]>(hubName, 'getSpokeCount')

  // Find the strategy for this hub
  const strategyAddr = configs[0]?.irStrategy ?? ''
  const strategyName = strategyNames[strategyAddr] ?? strategyAddr

  // Find the rate data from the strategy
  const strategyEntry = contracts.find(
    (c) => c.template === 'aave-v4/AssetInterestRateStrategy' && c.address.toString() === strategyAddr,
  )
  const rateData = strategyEntry?.values?.getInterestRateData as RateData[] | undefined

  const lines = []
  for (let i = 0; i < assetCount; i++) {
    const a = assets[i]
    const cfg = configs[i]
    const symbol = tokenName(a.underlying)
    const fee = cfg.liquidityFee / 100
    const spokes = spokeCounts[i]
    const rate = rateData?.[i]
    const optUtil = rate ? (rate.optimalUsageRatio / 100).toFixed(0) : '?'
    const baseRate = rate ? (rate.baseDrawnRate / 100).toFixed(1) : '?'
    const slope1 = rate ? (rate.rateGrowthBeforeOptimal / 100).toFixed(1) : '?'
    const slope2 = rate ? (rate.rateGrowthAfterOptimal / 100).toFixed(1) : '?'
    const hasReinvestment = cfg.reinvestmentController !== 'eth:0x0000000000000000000000000000000000000000'
    const isCollateralOnly = rate && rate.rateGrowthBeforeOptimal === 0 && rate.rateGrowthAfterOptimal === 0

    // Format liquidity values
    const liq = Number(a.liquidity) / 10 ** a.decimals
    const liqStr = liq > 1e6 ? `${(liq / 1e6).toFixed(1)}M` : liq > 1e3 ? `${(liq / 1e3).toFixed(0)}K` : liq.toFixed(2)
    const hasDeficit = a.deficitRay > 0

    if (isCollateralOnly) {
      lines.push(
        `- **${symbol}**: collateral-only (not borrowable), ` +
        `${spokes} spoke(s), ${liqStr} liquidity` +
        (hasDeficit ? ', HAS DEFICIT' : '') +
        (hasReinvestment ? ', has reinvestment controller' : ''),
      )
    } else {
      lines.push(
        `- **${symbol}**: ` +
        `${fee}% protocol fee, ${spokes} spoke(s), ${liqStr} liquidity, ` +
        `rates: ${baseRate}% base → ${slope1}%/${slope2}% slopes at ${optUtil}% optimal` +
        (hasDeficit ? ', HAS DEFICIT' : '') +
        (hasReinvestment ? ', has reinvestment controller' : ''),
      )
    }
  }

  return `**${hubName}** — ${assetCount} assets, strategy: ${strategyName}\n\n${lines.join('\n')}`
}

const hubDetails = hubList.map(buildHubDetail).join('\n\n')

const NUM_ROLES = discovery.getContractValue<number>(
  'AccessManager',
  'getRoleCount',
)

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
      'Aave V4 is a lending protocol. Users deposit assets to earn yield from borrowers, or post collateral to borrow against it; positions stay open as long as they remain overcollateralized, otherwise they get liquidated. V4 introduces a Hub and Spoke model: multiple markets (Spokes) with independent risk parameters share liquidity through a common Hub, with per-spoke caps bounding the maximum damage from any single market.',
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
          'Aave V4 is tracked here for its discovery-driven contract and permission map. It is not a scaling solution: it is a hub-and-spoke lending protocol. Hubs and Spokes on the same chain communicate via direct contract calls.',
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

Both flows happen on a **Spoke** contract. A Spoke is a market: it defines which assets you can supply, which you can borrow, which count as collateral, and at what parameters. All your positions (supplies, borrows, collateral flags) on a given Spoke are tied together into one health factor. You cannot supply on one Spoke and borrow against that collateral on a different Spoke: each Spoke is a self-contained position boundary.

Each Spoke holds a set of **reserves** (one per asset). Each reserve points to a **Hub** for that asset's liquidity pool. The Hub is where the actual tokens sit and where interest accounting happens. A single Spoke can have reserves pointing to different Hubs (for example, the Ethena Ecosystem Spoke routes Ethena assets through the Plus Hub and stablecoins through the Core Hub). Prices come from a per-spoke **AaveOracle** that wraps Chainlink feeds with a growth-rate cap; interest rate parameters come from an **InterestRateStrategy** per Hub; protocol revenue is sent to a single **Treasury**.

The design choice in V4 is **shared liquidity with bounded per-segment risk**. In V3, each pool is fully isolated: separate liquidity, separate risk. Adding a risky asset to the main pool exposes all suppliers; creating a separate pool fragments liquidity and worsens rates. V4 breaks this tradeoff:

- Multiple **Spokes** (markets) on each chain define independent collateral/borrow rules, risk parameters, and oracle sources. Each Spoke has a **drawCap** per asset set by governance that hard-limits how much liquidity it can borrow from the Hub.
- A shared **Hub** pools the underlying liquidity across all Spokes. Suppliers on any Spoke earn yield from borrowers on every Spoke connected to the same Hub.
- **Positions are isolated per Spoke.** Your health factor on one Spoke is independent of your positions on another. A liquidation cascade on one Spoke cannot trigger liquidations on another. The same asset (e.g., USDC) can be configured differently on different Spokes: usable as collateral on one, supply-only on another, not listed on a third.

If a risky collateral type depegs and creates bad debt on one Spoke, that bad debt IS absorbed by the Hub (all suppliers across all Spokes sharing that Hub see reduced share value). However, the maximum damage is bounded by the Spoke's drawCap. For example, if a Spoke has a 375K USDC drawCap and the total Hub has 100M USDC, the worst-case loss from that Spoke is 0.375% of the pool. In V3's single-pool model, there is no such per-segment bound.

Additionally, governance can halt or deactivate individual Spokes without affecting others. In V3, pausing is per-asset and affects all users of that asset across the entire pool.

## Where does the yield come from?

Supplier yield comes directly from interest paid by borrowers. There is no token emission, no external subsidy, and no Ponzi-like mechanism. The flow:

1. **Borrowers pay interest.** Every borrowed position accrues interest at a rate (\`drawnRate\`) computed by the InterestRateStrategy contract. The rate is a function of utilization: \`calculateInterestRate(liquidity, drawn, deficit, swept)\`. When utilization is low, rates are low (incentivizing borrowing); when utilization is high, rates rise sharply (incentivizing repayment and new supply). The interest compounds via a \`drawnIndex\` that grows linearly over time: each second, the index increases by \`previousIndex * rate * timeDelta\`.

2. **The interest grows the pool.** The Hub tracks \`totalAddedAssets\` per asset, which includes: the idle liquidity + swept liquidity + total debt owed by borrowers (drawn + premium) - protocol fees. As borrowers' debt grows (the drawnIndex increases), the total pool grows, and each supplier's \`addedShares\` become worth more underlying tokens. Suppliers don't receive yield as a separate payment; instead, their share of the pool appreciates.

3. **The protocol takes a cut.** A configurable \`liquidityFee\` (set per asset by governance via the HubConfigurator) is deducted from the interest accrued between index updates. This fee is tracked as \`realizedFees\` on the Hub and sent to the Treasury (the \`feeReceiver\` address in each asset's config). The fee is subtracted from the pool before computing supplier share value, so suppliers receive the borrower interest minus the protocol's percentage.

4. **Riskier borrowers pay more.** On top of the base interest rate, borrowers with lower-quality collateral pay a **risk premium** that scales with their position's collateral composition. This premium is tracked separately (\`premiumShares\` and \`premiumOffsetRay\`) and flows into the same pool, benefiting suppliers.

In short: the yield is the interest spread. Borrowers pay \`baseRate + riskPremium\`, suppliers receive \`baseRate + riskPremium - protocolFee\`, and the Treasury receives \`protocolFee\`. All rates are algorithmically determined by utilization and collateral quality, not by governance votes or token emissions.

## User flows

All user interactions happen on a **Spoke** contract. Users (or their approved position managers) call functions on the Spoke for the market they want to use. Each function takes a \`reserveId\` (identifying which asset within the Spoke) and an \`onBehalfOf\` address (who the position belongs to).

- **Supply**: \`supply(reserveId, amount, onBehalfOf)\`. Transfers the underlying token from the caller to the Hub and credits the user's \`suppliedShares\`. The deposit immediately starts earning yield. The caller must have approved the Spoke for the token transfer.

- **Withdraw**: \`withdraw(reserveId, amount, onBehalfOf)\`. Burns the user's \`suppliedShares\` and transfers the underlying token from the Hub to the caller. If the user is using this asset as collateral, the Spoke validates that the withdrawal doesn't make the position undercollateralized.

- **Borrow**: \`borrow(reserveId, amount, onBehalfOf)\`. Draws liquidity from the Hub and transfers the borrowed token to the caller, recording the user's \`drawnShares\`. The Spoke validates the user's health factor: the borrow only succeeds if total collateral value (at oracle prices) exceeds total debt value by the required margin.

- **Repay**: \`repay(reserveId, amount, onBehalfOf)\`. Transfers tokens from the caller back to the Hub, reducing the user's \`drawnShares\`. The repayment covers both the base debt and the accrued risk premium.

- **Liquidation**: \`liquidationCall(collateralReserveId, debtReserveId, user, debtToCover, receiveShares)\`. Permissionless: anyone can call this to liquidate an undercollateralized position. The liquidator repays part of the user's debt (transferred from the liquidator to the Hub) and receives the user's collateral at a discount. The liquidation bonus scales with how far below the health factor threshold the position is. If the position is in deficit (debt exceeds collateral value), the loss is reported to the Hub.

- **Set collateral**: \`setUsingAsCollateral(reserveId, usingAsCollateral, onBehalfOf)\`. Toggles whether a supplied asset counts as collateral for borrowing. Disabling collateral releases the asset from liquidation risk but reduces borrowing power.

All of these except \`liquidationCall\` require the caller to be an approved **position manager** for the \`onBehalfOf\` user. Users approve position managers via \`setUserPositionManager\` (or via EIP-712 signature). Two default position managers are pre-registered: a NativeTokenGateway (for ETH wrapping) and a SignatureGateway (for ERC-20 permit flows).

## Architecture

Aave V4 splits its protocol into two contract families:

- A **Hub** holds the per-asset accounting: the registry of supported assets, the per-asset interest rate strategy, the per-asset spoke registry, and the per-asset treasury split. Hubs and Spokes communicate via direct EVM contract calls (not cross-chain messaging), so they must be deployed on the same chain.
- A **Spoke** sits on a specific chain and holds a set of **reserves** (one per supported asset). Each reserve defines the per-asset config (collateral and borrow flags, freeze, pause, oracle source) and points to a specific Hub for that asset's liquidity pool. A single Spoke can have reserves pointing to different Hubs (e.g., the Ethena Ecosystem Spoke has Ethena assets routed through the Plus Hub and stablecoin assets routed through the Core Hub).

On Ethereum there are ${NUM_HUBS} Hubs and ${NUM_SPOKES} Spokes. The Spokes are organized by market type: a main "Prime" spoke that lists most blue-chip assets, plus several risk-isolated spokes for stables, BTC, Ethena, and the major correlated-LST pairs (wstETH, weETH, rsETH).

## Trust map

Users trust five actors across two independent access control systems:

**System 1: OpenZeppelin V5 AccessManager** gates every privileged action on every Hub and every Spoke through the \`restricted\` modifier. Two actors hold the top-level ADMIN_ROLE:
- The **AaveGovV3Executor** (Aave Governance V3 proposal execution). Changes through this path require a full governance proposal and voting cycle.
- The **AaveV4AdminMultisig** (5/8 multisig). This multisig can bypass the governance proposal process entirely: it holds ADMIN_ROLE directly and can reconfigure reserves, swap oracles, change position managers, freeze markets, and upgrade all proxy implementations with no delay.

**System 2: legacy ACLManager** (bytes32 roles from Aave V3) gates PriceCapAdapter discount rates and risk parameter adjustments. Three additional actors operate through this system:
- The **RiskCouncilMultisig** (2/2 multisig): can adjust supply/borrow caps, interest rates, and LTV ratios within governance-set bounds, without a governance proposal (via the RiskSteward contracts).
- The **GhoRiskCouncilMultisig** (3/4 multisig): can adjust GHO borrow rates and bucket capacities within bounds, and pause/unpause GHO minting (via the GhoAaveSteward and GhoDirectMinter contracts).
- The **EmergencyAdminMultisig** (5/9 multisig): can trigger emergency actions on the legacy Aave V3 system.

The most critical privileged operations:

- **\`updatePositionManager\`** (on every Spoke, gated by \`restricted\`): can activate or deactivate any contract as a position manager. An active position manager can supply, withdraw, borrow, and repay on behalf of ALL users who have approved it. Changing this to a malicious contract is the most direct path to draining user funds. Only the AaveV4AdminMultisig and AaveGovV3Executor (ADMIN_ROLE holders) can do this.
- **\`updateReservePriceSource\`** (on every Spoke, gated by \`restricted\`): can swap the oracle price feed for any reserve. A malicious feed enables unfair liquidations or prevents legitimate ones. Same ADMIN_ROLE gating.
- **\`transfer\` / \`withdraw\`** (on the Treasury, gated by \`onlyOwner\`): the **AaveV4AdminMultisig** (5/8 multisig) can move any ERC20 token the Treasury holds to any address with no timelock.

## Oracles

Each Spoke has its own paired **AaveOracle** that exposes one price source per reserveId. The price sources are typically Aave-deployed **PriceCapAdapters** that wrap a Chainlink feed (or for liquid-staked / wrapped assets, a ratio provider) with a growth-rate cap. The discount rate on these caps can be adjusted by the **RiskCouncilMultisig** (2/2) and **GhoRiskCouncilMultisig** (3/4) through the RiskSteward and GhoAaveSteward automation contracts, within governance-set bounds. These adjustments go through the legacy **ACLManager** (separate from the V5 AccessManager), not through the governance proposal process.
`,
    otherConsiderations: [
      {
        name: 'Cross-chain spoke registry',
        description:
          "The Hub keeps a per-asset list of every Spoke registered for that asset. All Hubs and Spokes on Ethereum communicate via direct contract calls (no cross-chain messaging). If Aave V4 deploys on another chain, that chain gets its own independent Hub(s) and Spoke(s).",
        references: [],
        risks: [],
      },
      {
        name: 'Multi-market topology',
        description: `Aave V4 deploys ${NUM_SPOKES} distinct Spokes on Ethereum, each with its own asset list and risk parameters (MainSpoke, StablesSpoke, BTCSpoke, EthenaIsolatedSpoke, RsETHCorrelatedSpoke, ...). All Spokes share the same AccessManager and the same governance chain, so a single Aave Governance V3 vote can reconfigure any of them. All Spoke implementations use the same access control pattern: restricted modifier on every admin function, onlyPositionManager on user functions, permissionless liquidation.`,
        references: [],
        risks: [],
      },
      {
        name: 'Two independent access control systems',
        description:
          'Aave V4 uses two separate, independent access control systems with five total end actors. The OZ V5 AccessManager gates all Hub and Spoke admin functions (reserve listing, oracle source replacement, interest rate changes, pause/freeze, position manager assignment) and is controlled by the AaveV4AdminMultisig (5/8) and AaveGovV3Executor. The legacy ACLManager gates PriceCapAdapter discount rate changes and is operated by the RiskCouncilMultisig (2/2), GhoRiskCouncilMultisig (3/4), and EmergencyAdminMultisig (5/9) through automation steward contracts. The two systems have different role holders, different admin hierarchies, and different trust chains.',
        references: [],
        risks: [],
      },
      {
        name: 'Hubs',
        description: `${NUM_HUBS} Hubs pool liquidity across Spokes. Each Hub has its own InterestRateStrategy, fee configuration, and per-asset spoke registry. For each asset: the protocol fee (percentage of interest taken by the Treasury), the number of Spokes that can draw/add liquidity for that asset, and the interest rate curve parameters (base rate, slope before optimal utilization, slope after optimal utilization, optimal utilization target).

${hubDetails}`,
        references: [],
        risks: [],
      },
      {
        name: 'Spokes',
        description: `${NUM_SPOKES} Spokes on Ethereum, each a self-contained market with its own position boundary, liquidation parameters, and oracle. Each reserve within a Spoke routes to a specific Hub for liquidity.

${spokeDetails}`,
        references: [],
        risks: [],
      },
      {
        name: 'AccessManager roles',
        description: `${NUM_ROLES} roles configured on the AccessManager: ADMIN_ROLE, HUB_CONFIGURATOR_ROLE, HUB_CONFIGURATOR_DOMAIN_ADMIN_ROLE, HUB_FEE_MINTER_ROLE, HUB_DEFICIT_ELIMINATOR_ROLE, SPOKE_DOMAIN_ADMIN_ROLE, SPOKE_CONFIGURATOR_ROLE, SPOKE_USER_POSITION_UPDATER_ROLE, SPOKE_CONFIGURATOR_DOMAIN_ADMIN_ROLE. ${NUM_PRICE_ADAPTERS} PriceCapAdapters are deployed across all markets.`,
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
        text: 'the position manager on a Spoke is changed to a malicious contract via updatePositionManager (gated by AccessManager roles). An active position manager can supply, withdraw, borrow, and repay on behalf of all users who approved it.',
      },
      {
        category: 'Funds can be lost if',
        text: 'an oracle price source is swapped to a malicious feed via updateReservePriceSource (gated by AccessManager roles). The oracle controls all collateral valuations; a wrong price enables unfair liquidations or prevents legitimate ones.',
      },
      {
        category: 'Funds can be lost if',
        text: 'a malicious code upgrade is pushed through the proxy admin chain. Every Hub, Spoke, and Treasury is behind a TransparentUpgradeableProxy; the upgrade authority traces back to the Aave Governance V3 Executor.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the AaveV4AdminMultisig (5/8) calls transfer() or withdraw() on the Treasury to drain accumulated protocol fees. These functions have no timelock.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the interest rate strategy is swapped to a malicious contract via updateInterestRateStrategy on the HubConfigurator, or the fee receiver is redirected via updateFeeReceiver. Both are gated by AccessManager roles.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'AccessManager role holders freeze or pause reserves via the SpokeConfigurator (freezeReserve, pauseReserve, freezeAllReserves, pauseAllReserves) or halt/deactivate Spokes or assets via the HubConfigurator.',
      },
    ],
  },
  permissions: discovery.getDiscoveredPermissions(),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
