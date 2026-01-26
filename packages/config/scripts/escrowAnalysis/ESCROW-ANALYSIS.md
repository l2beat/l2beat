# Escrow Security Classification

Tooling for analyzing trust assumptions of bridged assets on L2s/L3s.

## Classification Framework

### Name Categories (User-Facing)

| Name | Category | Messaging | Who can harm you? | Additional Trust? |
|------|----------|-----------|-------------------|-------------------|
| Canonical (trust-minimized) | Rollup-secured | Canonical | Rollup governance | No |
| Canonical (trust-minimized) | Issuer-secured | Canonical | Issuer OR Rollup gov | No |
| External | Issuer-secured | External (issuer) | Issuer | No |
| External | Rollup-secured | External | Rollup gov OR External validators | **Yes** |
| External | Third-party-secured | External | Third-Party OR External validators | **Yes** |
| Canonical (additional trust) | Third-party-secured | Canonical | Third-Party OR Rollup gov | **Yes** |
| Native | - | - | - | - |

### Key Insight

**Canonical messaging**: Trust depends only on escrow control
- Rollup/Issuer controlled → No additional trust
- Third-party controlled → Additional trust (third-party can rug)

**External messaging**: You ALWAYS trust external validators for withdrawals
- Issuer-secured → No additional trust (issuer already trusted by holding token)
- Rollup-secured → Additional trust (external validators now in trust path)
- Third-party-secured → Additional trust (validators + third-party)

### Key Principle

> Does using this bridge add trust assumptions beyond what the user already accepts by holding the token?

- Hold USDC → already trust Circle
- Circle controls CCTP bridge → no additional trust (issuer-secured)
- LayerZero bridges your ETH → additional trust (third-party validators)

## Usage

### Analyze a Chain

```bash
cd packages/config
npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts arbitrum
npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts nova
```

### List Available Chains

```bash
npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts --list
```

### Generate Dashboard

```bash
npx ts-node scripts/escrowAnalysis/generateHtml.ts
```

Opens `analysis/dashboard.html` with all analyzed chains.

## Output

Each analysis produces:
- Console summary with Current API vs New Framework comparison
- JSON file in `analysis/{chain}.json`

Example output:
```
Source        Current API          New Framework        Difference
─────────────────────────────────────────────────────────────────────
Canonical     $3.89B (21.0%)    $4.62B (24.9%)    +$733.94M
External      $9.23B (49.8%)    $8.50B (45.8%)    -$733.94M
Native        $5.43B (29.3%)    $5.43B (29.3%)    -
─────────────────────────────────────────────────────────────────────
Total         $18.55B              $18.55B              ✓
```

## Architecture

```
escrowAnalysis/
├── analyzeMultiChain.ts   # Main analysis script
├── generateHtml.ts        # Dashboard generator
├── chains/
│   ├── registry.ts        # Auto-detects chains by stack
│   ├── orbitStack.ts      # Orbit-specific config
│   └── types.ts           # Shared types
└── analysis/              # Output directory
    ├── dashboard.html
    └── {chain}.json
```

### Adding New Stacks

1. Create `chains/{stack}Stack.ts` with stack-specific config
2. Add stack detection patterns to `registry.ts`
3. Import in `analyzeMultiChain.ts`

## Data Sources

- **TVL**: L2Beat API (`/api/scaling/tvs/{project}/breakdown`)
- **Escrow Permissions**: Discovery JSON (`discovered.json`)
- **Bridge Info**: TVS config (`bridgedUsing` field)

## References

- [Stages Update Proposal](https://forum.l2beat.com/t/stages-update-proposal-decouple-escrows-from-rollup-stages/407)
- [LayerZero v2 OFTs Risk](https://l2beat.com/bridges/projects/layerzerov2oft)
