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
for (const c of contracts.filter((c) => c.template === 'aave-v4/HubInstance')) {
  hubNames[c.address.toString()] = c.name ?? c.address.toString()
}

type ReserveValue = { underlying: string; hub: string; assetId: number }
type LiqConfig = {
  targetHealthFactor: string
  healthFactorForMaxBonus: string
  liquidationBonusFactor: number
}

// uint40 max = 2^40 - 1, the sentinel value meaning "unlimited" for caps.
const MAX_ALLOWED_SPOKE_CAP = 1099511627775

// Build lookup: hubAddr -> assetId -> spokeAddr -> [addCap, drawCap, riskPremiumThreshold, active, halted]
type SpokeCfgTuple = [number, number, number, boolean, boolean]
const hubSpokeConfigs: Record<
  string,
  Record<string, Record<string, SpokeCfgTuple>>
> = {}
for (const c of contracts.filter((c) => c.template === 'aave-v4/HubInstance')) {
  hubSpokeConfigs[c.address.toString()] = (c.values?.spokeConfigs ??
    {}) as Record<string, Record<string, SpokeCfgTuple>>
}

function formatCap(whole: number): string {
  if (whole >= MAX_ALLOWED_SPOKE_CAP) return '∞'
  if (whole === 0) return '0'
  if (whole >= 1e9) return `${(whole / 1e9).toFixed(1)}B`
  if (whole >= 1e6) return `${(whole / 1e6).toFixed(1)}M`
  if (whole >= 1e3) return `${(whole / 1e3).toFixed(0)}K`
  return whole.toString()
}

// Build per-spoke detail with per-hub reserve grouping
const spokeEntries = contracts.filter(
  (c) => c.template === 'aave-v4/SpokeInstance',
)
const spokeDetails = spokeEntries
  .map((s) => {
    const reserves = (s.values?.getReserve as ReserveValue[]) ?? []
    const liq = s.values?.getLiquidationConfig as LiqConfig | undefined
    const thf = liq ? (Number(liq.targetHealthFactor) / 1e18).toFixed(2) : '?'
    const mbhf = liq
      ? (Number(liq.healthFactorForMaxBonus) / 1e18).toFixed(2)
      : '?'
    const bf = liq ? (liq.liquidationBonusFactor / 100).toFixed(0) + '%' : '?'

    // Group reserves by hub
    const byHub: Record<string, string[]> = {}
    for (const r of reserves) {
      const hub = hubNames[r.hub] ?? r.hub
      byHub[hub] ??= []
      byHub[hub].push(tokenName(r.underlying))
    }
    // Per-reserve detail with flags
    const configs =
      (s.values?.getReserveConfig as {
        collateralRisk: number
        borrowable: boolean
        paused: boolean
        frozen: boolean
      }[]) ?? []

    const spokeAddr = s.address.toString()
    const reserveRows = reserves
      .map((r, i) => {
        const symbol = tokenName(r.underlying)
        const hub = hubNames[r.hub] ?? r.hub
        const cfg = configs[i]
        const mode = cfg?.borrowable ? 'borrowable' : 'supply-only'
        const paused = cfg?.paused ? 'yes' : 'no'
        const frozen = cfg?.frozen ? 'yes' : 'no'
        const risk = cfg ? `${(cfg.collateralRisk / 100).toFixed(2)}%` : '?'
        const spokeCfg =
          hubSpokeConfigs[r.hub]?.[r.assetId.toString()]?.[spokeAddr]
        const addCap = spokeCfg ? formatCap(spokeCfg[0]) : '?'
        const drawCap = spokeCfg ? formatCap(spokeCfg[1]) : '?'
        return `| ${symbol} | ${hub} | ${mode} | ${paused} | ${frozen} | ${risk} | ${addCap} | ${drawCap} |`
      })
      .join('\n')

    const table =
      '| Asset | Hub | Mode | Paused | Frozen | collateralRisk | addCap | drawCap |\n' +
      '|---|---|---|---|---|---|---|---|\n' +
      reserveRows

    return `**${s.name}** — ${reserves.length} reserves, target HF ${thf}, max bonus HF ${mbhf}, bonus ${bf}\n\n${table}`
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
  const assetCount = discovery.getContractValue<number>(
    hubName,
    'getAssetCount',
  )
  const assets = discovery.getContractValue<AssetStruct[]>(hubName, 'getAsset')
  const configs = discovery.getContractValue<AssetConfig[]>(
    hubName,
    'getAssetConfig',
  )
  const spokeCounts = discovery.getContractValue<number[]>(
    hubName,
    'getSpokeCount',
  )

  // Find the strategy for this hub
  const strategyAddr = configs[0]?.irStrategy ?? ''
  const strategyName = strategyNames[strategyAddr] ?? strategyAddr

  // Find the rate data from the strategy
  const strategyEntry = contracts.find(
    (c) =>
      c.template === 'aave-v4/AssetInterestRateStrategy' &&
      c.address.toString() === strategyAddr,
  )
  const rateData = strategyEntry?.values?.getInterestRateData as
    | RateData[]
    | undefined

  const fmtAmount = (x: number): string =>
    x > 1e6
      ? `${(x / 1e6).toFixed(1)}M`
      : x > 1e3
        ? `${(x / 1e3).toFixed(0)}K`
        : x.toFixed(2)

  const rows = []
  for (let i = 0; i < assetCount; i++) {
    const a = assets[i]
    const cfg = configs[i]
    const symbol = tokenName(a.underlying)
    const fee = (cfg.liquidityFee / 100).toFixed(2) + '%'
    const spokes = spokeCounts[i]
    const rate = rateData?.[i]
    const optUtil = rate ? (rate.optimalUsageRatio / 100).toFixed(0) + '%' : '?'
    const baseRate = rate ? (rate.baseDrawnRate / 100).toFixed(2) + '%' : '?'
    const slope1 = rate
      ? (rate.rateGrowthBeforeOptimal / 100).toFixed(2) + '%'
      : '?'
    const slope2 = rate
      ? (rate.rateGrowthAfterOptimal / 100).toFixed(2) + '%'
      : '?'
    const reinvestment =
      cfg.reinvestmentController !==
      'eth:0x0000000000000000000000000000000000000000'
        ? 'active'
        : 'none'

    const liq = Number(a.liquidity) / 10 ** a.decimals
    const liqStr = fmtAmount(liq)
    const deficit = Number(a.deficitRay) / 1e27 / 10 ** a.decimals
    const deficitStr = deficit > 0 ? fmtAmount(deficit) : '0'

    rows.push(
      `| ${symbol} | ${spokes} | ${liqStr} | ${fee} | ${baseRate} | ${slope1} | ${slope2} | ${optUtil} | ${reinvestment} | ${deficitStr} |`,
    )
  }

  const table =
    '| Asset | Spokes | Liquidity | Fee | Base rate | Slope 1 | Slope 2 | Optimal util | Reinvestment | Deficit |\n' +
    '|---|---|---|---|---|---|---|---|---|---|\n' +
    rows.join('\n')

  return `**${hubName}** — ${assetCount} assets, strategy: ${strategyName}\n\n${table}`
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

- **Earn yield on assets they're not actively using.** A user deposits an asset (USDC, ETH, wstETH, ...) into a market and immediately starts accruing interest paid by borrowers of that same asset. Under normal conditions the deposit is liquid (it can be withdrawn whenever the market has spare liquidity) and can also be used as collateral for borrowing without giving up the yield. Admins with emergency and risk controls can pause or freeze a reserve: a paused reserve blocks withdrawals (and all other operations) until unpaused, while a frozen reserve still allows withdrawals but blocks new supplies, borrows, and collateral-enable (see the permissions section).
- **Borrow against collateral they want to keep.** A user posts collateral (typically ETH, an LST like wstETH/weETH/rsETH, BTC, or another supported asset) and draws a loan in a different asset (often a stable like USDC, USDT, GHO). The loan accrues interest at a rate that floats with how much of the supply side is currently being borrowed. As long as the position stays sufficiently overcollateralized, it stays open indefinitely; if the collateral value drops too far, anyone can liquidate the position by repaying part of the debt and seizing collateral at a discount.

Both flows happen on a **Spoke** contract. A Spoke is a market: it defines which assets you can supply, which you can borrow, which count as collateral, and at what parameters. Each asset you supply can be toggled on or off as collateral individually, and all of your activity on a given Spoke (your supplies, your borrows, and which of your supplies are currently enabled as collateral) is tied together into a single health factor. You cannot supply on one Spoke and borrow against that collateral on a different Spoke: each Spoke is a self-contained position boundary.

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

4. **Riskier borrowers pay more.** Each reserve on a Spoke has a \`collateralRisk\` value (in BPS, set by the PoolAdmin, capped at 1000% / 100,000 BPS). When a user borrows, the Spoke sorts their collaterals from safest to riskiest (by \`collateralRisk\` ascending) and "uses" them in that order to back the debt. A user whose debt is fully covered by safe collateral (zero \`collateralRisk\`) pays only the base rate; a user who has to dip into riskier collateral pays a surcharge proportional to the fraction of debt backed by risky collateral. For example, $200 of safe collateral + $400 of collateral with a 5% risk value, backing $600 of debt, yields a premium of 400·5%/600 = 3.33% on top of the base rate. This premium is tracked separately (\`premiumShares\` and \`premiumOffsetRay\`) and flows into the same pool, benefiting suppliers. On the current deployment, \`collateralRisk\` is zero for every reserve across all Spokes, so the mechanism exists but is dormant.

5. **Idle liquidity can be reinvested into external yield strategies.** Each Hub asset supports a \`reinvestmentController\` that can sweep idle tokens out of the Hub and return them later; any surplus it reclaims grows the pool. This path is currently disabled on every asset on every Hub (see "Reinvestment controllers" below for the mechanism, risk, and activation).

In short: the primary yield is the interest spread. Borrowers pay \`baseRate + riskPremium\`, suppliers receive \`baseRate + riskPremium - protocolFee\`, and the Treasury receives \`protocolFee\`. All rates are algorithmically determined by utilization and collateral quality, not by governance votes or token emissions. A future secondary yield source may come from reinvestment of idle liquidity, but this is not currently enabled.

## User flows

All user interactions happen on a **Spoke** contract. Users (or their approved position managers) call functions on the Spoke for the market they want to use. Each function takes a \`reserveId\` (identifying which asset within the Spoke) and an \`onBehalfOf\` address (who the position belongs to).

- **Supply**: \`supply(reserveId, amount, onBehalfOf)\`. Transfers the underlying token from the caller to the Hub and credits the user's \`suppliedShares\`. The deposit immediately starts earning yield. The caller must have approved the Spoke for the token transfer.

- **Withdraw**: \`withdraw(reserveId, amount, onBehalfOf)\`. Burns the user's \`suppliedShares\` and transfers the underlying token from the Hub to the caller. If the user is using this asset as collateral, the Spoke validates that the withdrawal doesn't make the position undercollateralized.

- **Borrow**: \`borrow(reserveId, amount, onBehalfOf)\`. Draws liquidity from the Hub and transfers the borrowed token to the caller, recording the user's \`drawnShares\`. The Spoke validates the user's health factor: the borrow only succeeds if total collateral value (at oracle prices) exceeds total debt value by the required margin.

- **Repay**: \`repay(reserveId, amount, onBehalfOf)\`. Transfers tokens from the caller back to the Hub, reducing the user's \`drawnShares\`. The repayment covers both the base debt and the accrued risk premium.

- **Liquidation**: \`liquidationCall(collateralReserveId, debtReserveId, user, debtToCover, receiveShares)\`. Permissionless: anyone can call this to liquidate an undercollateralized position. The liquidator repays part of the user's debt (transferred from the liquidator to the Hub) and receives the user's collateral at a discount. The liquidation bonus scales with how far below the health factor threshold the position is. If the position is in deficit (debt exceeds collateral value), the loss is reported to the Hub.

- **Set collateral**: \`setUsingAsCollateral(reserveId, usingAsCollateral, onBehalfOf)\`. Toggles whether a supplied asset counts as collateral for borrowing. Disabling collateral releases the asset from liquidation risk but reduces borrowing power.

All of these actions (except \`liquidationCall\`) are gated by an \`onlyPositionManager(onBehalfOf)\` check. A **position manager** is a contract or EOA authorised to act on another user's position: it can call \`supply\`, \`withdraw\`, \`borrow\`, \`repay\`, and \`setUsingAsCollateral\` with that user as \`onBehalfOf\`. The check allows a caller through if either (a) the caller is the user themselves, or (b) the caller is both **globally active** as a position manager on the Spoke *and* **explicitly approved** by the specific user.

Global activation is controlled by the protocol admin: \`updatePositionManager(address, bool)\` is \`restricted\`, so only \`ADMIN_ROLE\` holders on the AccessManager can flip a contract to active. User approval is self-service: the user calls \`setUserPositionManager(address, bool)\` (or signs an EIP-712 message consumed by \`setUserPositionManagersWithSig\`) to add or remove approvals on their own account. A position manager can also voluntarily drop its authority over a specific user via \`renouncePositionManagerRole\`. A position manager cannot approve further position managers on the user's behalf — that action is always tied to the user's own \`msg.sender\`.

This two-sided gating is how router-style UX flows (ETH wrapping, permit-based approvals, batched multicalls) can operate on user positions without holding approvals on the user's token balances directly: the admin whitelists the router contract globally, and each user opts in individually.

## Architecture

Aave V4 splits its protocol into two contract families:

- A **Hub** holds the per-asset accounting: the registry of supported assets, the per-asset interest rate strategy, the per-asset spoke registry, and the per-asset treasury split. Hubs and Spokes communicate via direct EVM contract calls (not cross-chain messaging), so they must be deployed on the same chain.
- A **Spoke** sits on a specific chain and holds a set of **reserves** (one per supported asset). Each reserve defines the per-asset config (collateral and borrow flags, freeze, pause, oracle source) and points to a specific Hub for that asset's liquidity pool. A single Spoke can have reserves pointing to different Hubs (e.g., the Ethena Ecosystem Spoke has Ethena assets routed through the Plus Hub and stablecoin assets routed through the Core Hub).

On Ethereum there are ${NUM_HUBS} Hubs and ${NUM_SPOKES} Spokes, organized by market type (a main market listing most blue-chip assets, plus several risk-isolated markets for stables, BTC, Ethena, and correlated-LST pairs). The per-Hub and per-Spoke config tables live in the sections below.

## Oracles

Each Spoke has its own paired **AaveOracle** that exposes one price source per reserveId. The price sources are typically Aave-deployed **PriceCapAdapters** that wrap a Chainlink feed (or for liquid-staked / wrapped assets, a ratio provider) with a growth-rate cap on the underlying ratio. The discount rate on these caps is tunable within governance-set bounds (see the upgrades & governance section).

For the full set of actors who can swap oracles or adjust cap discount rates, see the upgrades & governance section below and the permissions section.
`,
    upgradesAndGovernance: `Privileged authority over Aave V4 is concentrated in a small number of multisigs and one onchain governance endpoint, and upgrades execute with no timelock. Every Hub, every Spoke, the Treasury, every PriceCapAdapter, the ACLManager, and the AccessManager itself is deployed behind a TransparentUpgradeableProxy.

Two independent access control systems gate privileged calls. The OpenZeppelin V5 \`AccessManager\` gates every admin function on every Hub and Spoke through the \`restricted\` modifier, using role labels such as \`ADMIN_ROLE\`, \`HUB_CONFIGURATOR_ROLE\`, and \`SPOKE_CONFIGURATOR_ROLE\`. The top-level \`ADMIN_ROLE\` currently has two members: the **AaveV4AdminMultisig** (a 5-of-8 Gnosis Safe) and the **AaveGovV3Executor** (the onchain endpoint that runs proposals approved through Aave Governance V3). Both members are configured with an execution delay of zero, so privileged calls execute immediately once the multisig quorum or the DAO vote is reached. In parallel, a legacy \`ACLManager\` inherited from Aave V3 (with bytes32 roles \`POOL_ADMIN\`, \`RISK_ADMIN\`, \`EMERGENCY_ADMIN\`) continues to gate the PriceCapAdapters used by V4 oracles; discount-rate adjustments on those caps flow through this older system rather than through the V4 AccessManager.

Upgrades go through several \`ProxyAdmin\` contracts whose owners resolve to either the AaveV4AdminMultisig or the AaveGovV3Executor. There is no separate upgrade timelock: once either owner submits an upgrade, it takes effect in the same transaction. The single most concentrated trust assumption is therefore the AaveV4AdminMultisig: five of its eight signers can replace the implementation of any V4 contract at will.

Because the AaveV4AdminMultisig holds \`ADMIN_ROLE\` directly, the same five signers can execute any \`restricted\` function on any Hub or Spoke without going through the Aave DAO. In one transaction, and with no delay, they can:

- swap the oracle feed on any reserve via \`updateReservePriceSource\` (a wrong price enables unfair liquidations or blocks legitimate ones);
- list, reconfigure, or pause reserves via \`addReserve\` and \`updateReserveConfig\` on any Spoke;
- halt or deactivate entire Spokes and assets via the HubConfigurator (\`haltSpoke\`, \`deactivateSpoke\`, \`haltAsset\`, \`deactivateAsset\`);
- redirect protocol fees via \`updateFeeReceiver\` and \`updateLiquidityFee\`;
- install a reinvestment controller that can sweep idle Hub liquidity into an external strategy via \`updateReinvestmentController\`;
- replace the interest-rate strategy on any Hub via \`updateInterestRateStrategy\`;
- activate or deactivate a position manager on any Spoke via \`updatePositionManager\`;
- move any ERC20 balance held by the Treasury (whose owner is the same multisig).

The AaveGovV3Executor can do all of the same things, but only after an Aave Governance V3 onchain vote executes through the governance executor; the DAO vote process is public and takes days end-to-end, but the resulting transaction then executes on V4 with no additional delay.

Position-manager activation is the one privileged call that does **not** directly threaten user funds: the \`onlyPositionManager\` check on the Spoke requires both admin activation *and* explicit per-user approval (\`setUserPositionManager\`), so the admin cannot drain a user who has not individually approved the activated contract. The practical risk there is a "lure" pattern: the admin activates a contract that users are then encouraged to approve.

Two routine-tuning paths exist for risk parameters, bounded by ranges set at deploy time or by governance. Neither can upgrade contracts or move funds. The **RiskCouncilMultisig** (2-of-2) operates the \`RiskSteward\` and can adjust supply caps, borrow caps, LTV and liquidation parameters, and PriceCapAdapter discount rates, within per-reserve bounds returned onchain (with a 3-day cooldown between updates on the same reserve). The **GhoRiskCouncilMultisig** (3-of-4) operates the \`GhoAaveSteward\` and \`GhoDirectMinter\` and can adjust GHO borrow rates, bucket capacities, and pause or unpause GHO minting, within bounds. Neither steward can raise its own bounds; only the AaveV4AdminMultisig or the DAO can.

The **EmergencyAdminMultisig** (5-of-9) holds the \`EMERGENCY_ADMIN\` role on the legacy V3-era ACLManager and can trigger emergency actions (such as pausing a PriceCapAdapter) on the V3 system that V4 oracles still depend on. It does not hold any V4 AccessManager role.
`,
    otherConsiderations: [
      {
        name: 'Hubs',
        description: `${NUM_HUBS} Hubs pool liquidity across Spokes. Each Hub has its own InterestRateStrategy, fee configuration, and per-asset spoke registry.

The interest rate borrowers pay on a Hub is a kinked curve driven by **utilization** (\`drawn / (liquidity + drawn)\`, the fraction of the pool that is currently borrowed):

![Kinked interest-rate curve for USDC on the CoreHub (base 0%, slope 1 4% up to the 92% optimal kink, slope 2 20% from the kink to 100%)](/images/architecture/aave-v4-interest-rate-curve.svg)

- **Base rate**: the rate charged when utilization is zero (nothing borrowed).
- **Optimal util**: the target utilization governance wants the pool to sit at. It is the "kink" on the curve.
- **Slope 1**: the extra rate added as utilization grows from zero to the optimal point. At optimal util, the borrow rate equals \`base + slope 1\`.
- **Slope 2**: the extra rate added between optimal and 100% utilization. At 100% util, the borrow rate equals \`base + slope 1 + slope 2\` (typically very large, to make borrowing prohibitively expensive when liquidity is scarce and to keep some available for withdrawers).

The table below shows per-asset: the number of Spokes registered for that asset, current idle liquidity, the protocol fee taken by the Treasury, the four rate-curve parameters, whether a reinvestment controller is active (see "Reinvestment controllers"), and any accrued deficit (bad debt absorbed by suppliers).

${hubDetails}`,
        references: [],
        risks: [],
      },
      {
        name: 'Spokes',
        description: `${NUM_SPOKES} Spokes on Ethereum, each a self-contained market with its own position boundary, liquidation parameters, and oracle. Each reserve within a Spoke routes to a specific Hub for liquidity.

Each reserve is bounded on both sides by two per-(Hub, asset, Spoke) caps set by governance, expressed in whole tokens (so a cap of \`500K\` on USDC means 500,000 USDC):

- **addCap**: the maximum amount that can be supplied to the Hub through this Spoke (caps the Spoke's share of the pool's liquidity). Reaching it blocks further deposits on this reserve until existing supply is withdrawn or the cap is raised.
- **drawCap**: the maximum amount that can be borrowed from the Hub through this Spoke (caps the Spoke's outstanding debt to the Hub). Reaching it blocks further borrows on this reserve. It also bounds the worst-case bad debt a single Spoke can inflict on a Hub: if every position on that Spoke is liquidated at zero recovery, the loss to the shared Hub pool cannot exceed the drawCap.

A value of \`∞\` means the cap is set to the uint40 sentinel and is effectively unlimited. A value of \`0\` means the corresponding action is currently disabled on that reserve.

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
      {
        name: 'Reinvestment controllers',
        description: `Each Hub asset has a configurable \`reinvestmentController\` address. When set to a non-zero address, this controller can:

- **\`sweep(assetId, amount)\`**: withdraw idle liquidity tokens from the Hub to the controller's address. The Hub tracks the removed amount in \`asset.swept\` so supplier share value is preserved.
- **\`reclaim(assetId, amount)\`**: return tokens to the Hub, decreasing \`swept\` and increasing \`liquidity\`.

The intended use is deploying idle liquidity into external yield strategies. If the controller reclaims more than it swept, the excess grows the pool for all suppliers. The swept amount is included in the interest rate formula denominator (\`drawn / (liquidity + drawn + swept)\`), so sweeping does not artificially inflate borrow rates.

**Risk**: when active, the controller can physically remove all idle liquidity from the Hub. If a supplier tries to withdraw more than the remaining \`liquidity\`, the transaction reverts until the controller reclaims. A malicious or compromised controller could sweep funds and never return them.

**Current status**: all assets on all three Hubs have \`reinvestmentController\` set to the zero address (disabled). No idle liquidity is currently being reinvested. Governance (via HubConfigurator.updateReinvestmentController, gated by the AccessManager) can activate a controller at any time.`,
        references: [],
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'a reinvestment controller is activated and sweeps most idle liquidity, making withdrawals temporarily unavailable until the controller reclaims.',
          },
          {
            category: 'Funds can be lost if',
            text: 'a reinvestment controller is activated and the controller contract or its external yield strategy is compromised, preventing reclaim of swept funds.',
          },
        ],
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
