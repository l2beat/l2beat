# Risk Scoring Methodology

The frontend computes a **0–100 risk score** for each protocol based on its compiled review data. Higher scores indicate greater risk.

## Score Components

| Factor | Max Points | Description |
|--------|-----------|-------------|
| Admin Type | 40 | Based on the most privileged admin type present |
| Dependency Concentration | 25 | Number of external dependencies |
| Capital Concentration | 20 | Total capital at risk (USD) |
| Permissioned Function Density | 15 | Ratio of permissioned functions to contracts |

**Total: 100 points maximum**

### Admin Type Risk (0–40 points)

The riskiest admin type present determines the score:

| Admin Type | Points |
|------------|--------|
| EOA or EOAPermissioned | 40 |
| Multisig (no EOA) | 20 |
| Timelock only | 10 |
| Immutable / none | 0 |

### Dependency Concentration (0–25 points)

| Dependencies | Points |
|--------------|--------|
| 5+ | 25 |
| 3–4 | 15 |
| 1–2 | 8 |
| 0 | 0 |

### Capital Concentration (0–20 points)

| Capital at Risk | Points |
|-----------------|--------|
| > $500M | 20 |
| > $100M | 15 |
| > $10M | 10 |
| > $0 | 5 |
| $0 | 0 |

### Permissioned Function Density (0–15 points)

Calculated as: `permissionedFunctionCount / contractCount`

| Ratio | Points |
|-------|--------|
| > 3.0 | 15 |
| > 1.5 | 10 |
| > 0 | 5 |
| 0 | 0 |

## Risk Levels

The numeric score maps to a risk level:

| Score Range | Level | Color |
|-------------|-------|-------|
| 70–100 | CRITICAL | Red (#EF4444) |
| 50–69 | HIGH | Orange (#F97316) |
| 35–49 | MEDIUM | Amber (#F59E0B) |
| 20–34 | LOW | Green (#10B981) |
| 0–19 | MINIMAL | Cyan (#06B6D4) |

## Key Risk Factors

In addition to the numeric score, the system flags specific risk factors:

- **EOA admin detected** — An externally owned account has admin privileges
- **High dependency count** — More than 3 external dependencies
- **Large capital exposure** — Over $100M capital at risk
- **No timelock protection** — Multisig admin without timelock delay

## Implementation

Source: [`src/utils/risk.ts`](../src/utils/risk.ts)
