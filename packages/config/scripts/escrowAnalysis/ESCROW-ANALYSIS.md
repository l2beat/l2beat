# Escrow Security Classification Analysis

This document analyzes the trust assumptions for tokens on Arbitrum, categorizing them by who controls the bridge/escrow infrastructure.

## Trust Model Classification

| Category | Definition | User Trust Assumption |
|----------|------------|----------------------|
| **Rollup-Secured** | Escrow controlled by the rollup's governance (same admin as RollupProxy) | Only trust the rollup |
| **Issuer-Secured** | Escrow/bridge controlled by the token issuer | Already trust issuer for the token itself - no *additional* trust |
| **Third-Party-Secured** | Bridge controlled by a third party different from both rollup and token issuer | Trust an additional party beyond the token issuer |

### Key Principle

The question is: **Does using this bridge add trust assumptions beyond what the user already accepts by holding the token?**

- If you hold USDC, you already trust Circle
- If Circle also controls the bridge → no additional trust (issuer-secured)
- If LayerZero controls the bridge → additional trust in LayerZero (third-party-secured)

### What "Control" Means

It's not just about minting. Trust encompasses **all privileged functions** that can affect user funds:

| Privileged Function | Risk to Users |
|--------------------|---------------|
| **Minting** | Create tokens out of thin air, dilute holdings |
| **Burning** | Destroy tokens without user consent |
| **Pausing** | Freeze all transfers, trap funds |
| **Blacklisting** | Freeze specific addresses |
| **Contract upgrades** | Change any logic, introduce backdoors |
| **Security config changes** | Redirect validation to malicious actors |
| **Admin key rotation** | Transfer control to attackers |

A token is only "issuer-secured" if the issuer controls **all** these functions. If any privileged function is controlled by a third party, that's an additional trust assumption.

---

## Arbitrum TVL Summary

| Category | TVL | Percentage |
|----------|-----|------------|
| **Rollup-Secured** | $8.47B | 47.7% |
| **Issuer-Secured** | $7.60B | 42.8% |
| **Third-Party-Secured** | $1.68B | 9.5% |
| **Total** | $17.75B | 100% |

---

## Detailed Breakdown

### Rollup-Secured ($8.47B)

These escrows are controlled by Arbitrum's governance (GatewaysAdmin → UpgradeExecutor → SecurityCouncil).

| Escrow | TVL | Description |
|--------|-----|-------------|
| Custom ERC20 Gateway | $4.23B | Main gateway for tokens requiring custom L2 representation |
| Standard ERC20 Gateway | $4.23B | Gateway for standard wrapped tokens |

### Issuer-Secured ($7.60B)

The escrow/bridge is controlled by the same entity that issues the token.

| Asset | TVL | Issuer | Bridge | Why Issuer-Secured |
|-------|-----|--------|--------|-------------------|
| **Native USDC** | $6.36B | Circle | Circle CCTP | Circle controls both USDC AND the CCTP attestation service |
| **DAI/USDS/sUSDS** | $330M | MakerDAO | Maker L1 Escrow | MakerDAO controls both the escrow AND the tokens |
| **wstETH** | $267M | Lido DAO | Lido L1 Escrow | Lido DAO controls both the escrow AND wstETH |
| **GRT** | $155M | The Graph | The Graph Gateway | The Graph operates their own bridge infrastructure |
| **ZRO** | $51M | LayerZero | LayerZero (Native) | LayerZero's own token on their own infra |
| **frxETH/sfrxETH** | $28M | Frax | Frax Ferry | Frax team operates the Ferry bridge |
| **LPT** | $21M | Livepeer | Livepeer L1 Escrow | Livepeer controls the escrow |
| **tBTC** | $13M | Threshold | Threshold Network | Threshold operators are the token governance |

### Third-Party-Secured ($1.68B)

Users must trust an additional party beyond the token issuer.

| Asset | TVL | Token Issuer | Bridge Operator | Additional Trust |
|-------|-----|--------------|-----------------|------------------|
| **USDT0** | $1.05B | Tether | LayerZero + Everdawn Labs | LZ Labs multisig + DVN operators |
| **rsETH** | $251M | Kelp DAO | LayerZero | LZ Labs multisig + DVN operators |
| **ezETH** | $139M | Renzo | LayerZero | LZ Labs multisig + DVN operators |
| **syrupUSDC** | $124M | Maple Finance | Unknown | Bridge control unverified |
| **EDU** | $40M | Open Campus | LayerZero | LZ Labs multisig + DVN operators |
| **cgETH** | $23M | Hashkey | Wormhole NTT | Wormhole Guardian network |
| **ATH** | $23M | Aethir | LayerZero | LZ Labs multisig + DVN operators |
| **sUSDe/USDe** | $9M | Ethena | LayerZero | LZ Labs multisig + DVN operators |
| **GHO** | $5M | Aave | Chainlink CCIP | Chainlink node operators |
| **USDY** | $5M | Ondo | Axelar | Axelar validator set |
| **STG** | $3M | Stargate | Stargate/LayerZero | LZ Labs infrastructure |

---

## Layer Zero OFT: Deep Dive

### Why Layer Zero OFT is Third-Party-Secured

A common misconception is that because the token issuer deploys the OFT contract, they "control" the bridge. This is incorrect.

#### How Layer Zero OFT Works

```
1. User initiates transfer on source chain
2. LayerZero Endpoint emits a message
3. DVNs (Decentralized Verifier Networks) validate the message
4. If required DVNs agree → message is marked as verified
5. Executor submits transaction on destination chain
6. OFT contract mints tokens
```

#### Who Actually Controls Minting?

| Component | Who Controls It |
|-----------|----------------|
| OFT Contract | Token issuer deploys it |
| DVN Configuration | Token issuer chooses DVNs |
| DVN Operation | **Third parties** (LayerZero Labs, Google Cloud, Polyhedra, etc.) |
| LayerZero Endpoint | **LayerZero Labs** (3-of-5 multisig) |
| Default Security Stack | **LayerZero Labs** (can change defaults) |

The token issuer configures which DVNs to use, but they don't operate them. The DVN operators (third parties) are the ones who validate messages and authorize minting.

#### Risk Vectors (per L2Beat)

> "Funds can be stolen if all required Verifiers collude to approve and relay a fraudulent transfer."

> "Funds can be stolen if the LayerZero Multisig changes the default security stack maliciously."

> "Funds can be stolen if the OApp owner upgrades the OFT(Adapter) contract maliciously."

#### USDT0 Specific Configuration

USDT0 uses a dual-DVN model:
- **LayerZero DVN** - Operated by LayerZero Labs
- **Everdawn Labs DVN** - Operated by Everdawn Labs (not Tether)

Both must verify each transaction.

#### Full Trust Breakdown for USDT0

| Party | Privileged Functions | How They Can Put Tokens at Risk |
|-------|---------------------|--------------------------------|
| **Tether** | Blacklist, pause, control reserves | Freeze your address, halt all transfers, fractional reserve risk |
| **Everdawn Labs** (3-of-5 multisig) | Upgrade OFT contracts, change OApp config | Introduce malicious logic, redirect minting, steal funds via upgrade |
| **LayerZero Labs** (3-of-5 multisig) | Change default DVNs, upgrade MessageLib | Redirect validation to malicious DVNs, change security assumptions |
| **LayerZero DVN** | Validate/censor cross-chain messages | Approve fraudulent mints, censor legitimate transfers |
| **Everdawn DVN** | Validate/censor cross-chain messages | Approve fraudulent mints, censor legitimate transfers |

If **any** of these parties act maliciously or are compromised, user funds are at risk.

**Comparison with native USDT on Ethereum:**
- On Ethereum, you only trust Tether
- On Arbitrum via USDT0, you trust Tether + Everdawn Labs + LayerZero Labs + DVN operators

This is **additional trust** beyond just trusting Tether.

### Comparison: Circle CCTP vs Layer Zero OFT

| Aspect | Circle CCTP (USDC) | Layer Zero OFT (USDT0) |
|--------|-------------------|------------------------|
| Token Issuer | Circle | Tether |
| Who validates cross-chain messages? | Circle's attestation service | LayerZero DVN + Everdawn DVN |
| Who can mint on destination? | Only Circle-approved attestations | DVN-approved messages |
| Additional trust required? | No (Circle controls everything) | Yes (trust LZ Labs + Everdawn) |
| Classification | **Issuer-Secured** | **Third-Party-Secured** |

---

## Methodology

### Data Sources

1. **TVL Data**: L2Beat API (`/api/scaling/tvs/{project}/breakdown`)
2. **Escrow Permissions**: Discovery JSON (`discovered.json`)
3. **Bridge Documentation**: L2Beat bridge risk assessments

### Classification Logic

```
IF escrow.admin == rollup.admin:
    category = "rollup-secured"
ELSE IF escrow.admin == token.issuer AND bridge.operator == token.issuer:
    category = "issuer-secured"
ELSE:
    category = "third-party-secured"
```

### Key Insight

The critical question is not "who deployed the contract" but "who operates the infrastructure that authorizes minting."

---

## References

- [L2Beat - LayerZero v2 OFTs Risk Assessment](https://l2beat.com/bridges/projects/layerzerov2oft)
- [LayerZero V2: Explaining DVNs](https://layerzero.network/blog/layerzero-v2-explaining-dvns)
- [Chaos Labs - USD₮0 Mechanism Design Review](https://chaoslabs.xyz/posts/usdt0-risk-review)
- [USDT0 Documentation](https://docs.usdt0.to)
- [L2Beat Stages Update Proposal](https://forum.l2beat.com/t/stages-update-proposal-decouple-escrows-from-rollup-stages/407)

---

## Running the Analysis

```bash
cd packages/config
npx ts-node scripts/escrowAnalysis/analyzeEscrows.ts arbitrum
```

For Orbit chains, pass the project id and the script will auto-detect escrow
addresses from TVS formulas (example: `game7`, `powerloom`, `degen`).

Output:
- Console report with colored categorization
- JSON file: `{projectId}-escrow-analysis.json`

---

*Generated: January 2025*
