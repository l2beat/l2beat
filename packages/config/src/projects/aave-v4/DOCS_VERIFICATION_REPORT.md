# Aave V4 Documentation Verification Report

Cross-referencing the official Aave documentation (https://aave.com/docs/) against the onchain discovery and static analysis findings. The goal is to identify inconsistencies between documented claims and onchain reality, surface anything the docs describe that our discovery missed, and adopt official naming where the docs provide it.

## Verified claims (docs match onchain)

### Hub and Spoke architecture
The docs describe a "Hub & Spoke architecture" where the Hub consolidates liquidity and the Spokes are modular borrowing modules with isolated risk profiles. This matches our discovery: 3 Hubs, 10 Spokes, each Spoke with its own oracle and reserve config.

### Position managers
The docs say "Governance registers position managers before user enablement." Confirmed onchain: `updatePositionManager` on every Spoke carries the `restricted` modifier (gated by AccessManager roles). Users must explicitly authorize managers via `setUserPositionManager` before they can act.

### Governance contract addresses
All addresses from the docs match our discovery:
- Governance: `0x9AEE0B04504CeF83A65AC3f0e838D0593BCb2BC7` (confirmed)
- PayloadsController: `0xdAbad81aF85554E9ae636395611C58F7eC1aAEc5` (confirmed)
- ExecutorLvl1: `0x5300A1a15135EA4dc7aD5a167152C01EFc9b192A` (confirmed, our "AaveGovV3Executor")
- CrossChainController: `0xEd42a7D8559a463722Ca4beD50E0Cc05a386b0e1` (confirmed)

### Protocol Emergency Guardian
The docs describe a 5/9 multisig holding EMERGENCY_ADMIN. Our discovery found the EmergencyAdminMultisig at `0x2CFe3ec4d5a6811f4B8067F0DE7e47DfA938Aa30` with exactly 5/9 threshold. Match.

The docs name the 9 signers by organization: Chaos Labs, Llamarisk, Karpatkey, Certora, Tokenlogic, BGD Labs, ACI, Ezr3al, Stable Labs.

### Steward parameter bounds: docs vs onchain

The docs specify bounds, but onchain values differ significantly:

**Risk Steward** (verified via `getRiskConfig` onchain):
- Docs say "5-day update frequency, max 50% cap increase"
- Onchain: **3-day cooldown** (`minDelay: 259200`), supply/borrow cap `maxPercentChange: 10000` (up to **100x increase**, not 50%)
- LTV/liquidation threshold changes: max 0.5% per update
- Rate slope changes: variable (100 to 2000 basis points depending on parameter)

**GHO Aave Steward** (verified via `getBorrowRateConfig` and `MINIMUM_DELAY` onchain):
- Docs say "GHO Borrow Rate ±5% (max 25%)"
- Onchain: max 5% rate parameter change per update (`maxChange: 500`), **1-day cooldown** (`MINIMUM_DELAY: 86400`)

The onchain values are the source of truth and are reflected in our template descriptions.

## Inconsistencies and gaps

### 1. The 5/8 multisig holding ADMIN_ROLE: identity not yet confirmed

A 5/8 GnosisSafe multisig at `0x187AAE17d4931310B3fc75743e7F16Bdc9eD77e9` holds ADMIN_ROLE on the AccessManager (alongside the ExecutorLvl1). It was granted the role during deployment (March 24, 2026, 12 seconds after the Executor's grant). Aave V4 is less than 3 weeks old at time of analysis.

We were unable to find this multisig documented in the official governance docs or the Aave Permissions Book (which does not yet have V4 data). Its 8 signers do not overlap with the Protocol Emergency Guardian's 9 signers, confirming it is a separate entity.

This could be:
- A deployment/operational admin intended to be documented when the Permissions Book is updated for V4
- A temporary bootstrapping admin that will be revoked once V4 is fully stabilized
- An Aave Labs operational multisig for ongoing V4 management

Our discovery correctly identifies it as an ADMIN_ROLE holder with `executionDelay: 0`. We named it "AaveV4AdminMultisig" as a placeholder until its official identity is confirmed. The name should be updated once Aave's V4 permissions documentation is published.

### 2. ExecutorLvl2: verified, no active roles on V4

The docs list ExecutorLvl2 at `0x17Dd33Ed0e3dD2a80E37489B8A63063161BE6957` alongside ExecutorLvl1 at `0x5300`. We verified onchain: ExecutorLvl2 holds NO roles on the AccessManager or either ACLManager. It is not an active actor in V4. Our discovery is not missing a trust path here.

### 3. Steward parameter bounds are not reflected in our descriptions

Our template descriptions say "within governance-set bounds" without specifying what those bounds are. The docs provide exact numbers:
- Risk Steward: max 50% cap increase, 5-day update frequency
- GHO Aave Steward: borrow rate ±5% (max 25%), cap ±100%

These bounds should be in the steward template descriptions and in the frontend project's "Other considerations" section.

### 4. Oracle documentation understates the trust assumption

The official oracle docs describe Chainlink feeds and CAPO (Correlated Asset Price Oracle) but do NOT mention:
- The `setDiscountRatePerYear` function on PriceCapAdapters that the RiskCouncilMultisig can call
- The ACLManager as a separate trust path for oracle parameter changes
- The growth rate cap mechanism and who can re-arm it

Our static analysis identified these as critical trust functions. The docs present oracles as if they're purely Chainlink-dependent, omitting the protocol-controlled cap layer.

### 5. The risk documentation is generic

The official risks page acknowledges smart contract risk, oracle risk, collateral risk, and network/bridge risk, but provides no specifics about:
- Access control centralization (the 5/8 multisig with full admin power)
- Position manager risk (a compromised manager can drain all approved user positions)
- Treasury drain risk (no timelock on owner operations)
- The two independent access control systems (AccessManager vs ACLManager)

Our static analysis report covers all of these in detail.

### 6. Governance Emergency Guardian not in our discovery

The docs describe a "Governance Emergency Guardian" (5/9 multisig) separate from the Protocol Emergency Guardian, with the power to veto malicious payloads. We did not discover this multisig because it operates at the Aave Governance V3 level (PayloadsController/Governance), which we cut at the Executor seam.

This is expected: the Governance Emergency Guardian is part of the Aave Gov V3 stack, not part of Aave V4 directly. But it's worth noting that our discovery does not capture the full governance veto chain.

## Naming corrections from docs

| Our name | Docs name | Action |
|---|---|---|
| AaveGovV3Executor | ExecutorLvl1 | Consider renaming or noting both names |
| EmergencyAdminMultisig | Protocol Emergency Guardian | Should rename to match official name |
| AaveV4AdminMultisig | (not documented) | Keep our name, note the documentation gap |
| RiskCouncilMultisig | Risk Council (via Risk Steward) | Name matches docs |
| GhoRiskCouncilMultisig | Risk Council (via GHO Aave Steward) | Name matches docs |

## Actions for our analysis

1. Rename EmergencyAdminMultisig to "ProtocolEmergencyGuardian" (official name from docs)
2. ~~Add ExecutorLvl2 to the discovery~~ — verified: holds no V4 roles, not needed
3. ~~Add steward parameter bounds~~ — done, using onchain values (which differ from docs: 3-day cooldown not 5-day, up to 100x cap increase not 50%)
4. Update AaveV4AdminMultisig name once official V4 permissions documentation is published
5. Consider adding the Protocol Emergency Guardian signer organizations to the project description (Chaos Labs, Llamarisk, Karpatkey, Certora, Tokenlogic, BGD Labs, ACI, Ezr3al, Stable Labs)
