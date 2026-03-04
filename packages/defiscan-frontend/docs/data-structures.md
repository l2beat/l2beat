# Frontend Data Structures

The frontend consumes two types of data files from `public/data/`:

1. **`index.json`** — Global index with protocol summaries and aggregated dependencies
2. **`{slug}/compiled-review.json`** — Full compiled review per protocol

Both are produced by the backend's `ReviewCompiler` and indexed by `compile-data.ts`.

---

## Index (`index.json`)

Top-level file listing all reviewed protocols.

```typescript
interface IndexData {
  totalDefiTvl: number                  // Total DeFi TVL (manually maintained)
  protocols: ProtocolSummary[]          // One entry per reviewed protocol
  globalTotals: {
    totalCapitalAtRisk: number          // Sum across all protocols
    totalTokenValueAtRisk: number       // Sum across all protocols
    protocolsReviewed: number           // Count of protocols
  }
  dependencies: AggregatedDependency[]  // Cross-protocol dependency aggregation
}
```

### ProtocolSummary

```typescript
interface ProtocolSummary {
  slug: string              // URL-safe identifier (e.g. "liquity-v2")
  name: string              // Display name (e.g. "Liquity V2")
  chain: string             // Blockchain (e.g. "Ethereum")
  projectType: string       // Protocol category (e.g. "cdp", "yield", "lending")
  tokenName: string         // Protocol token symbol (e.g. "BOLD")
  totals: {                 // Same shape as CompiledReview.totals
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
  }
}
```

### AggregatedDependency

Dependencies shared across multiple protocols, sorted by `totalFundsAtRisk` descending.

```typescript
interface AggregatedDependency {
  address: string                           // Contract address
  name: string                              // Resolved contract name
  entity: string | null                     // Vendor/provider (e.g. "Chainlink")
  totalFundsAtRisk: number                  // Sum of capital from dependent protocols
  protocols: { slug: string; name: string }[] // Which protocols depend on this
}
```

---

## Compiled Review (`compiled-review.json`)

Self-contained review for a single protocol. This is the primary data structure consumed by all 3 view modes (Report, Explorer, Dashboard).

```typescript
interface CompiledReview {
  version: '1.0'
  compiledAt: string        // ISO timestamp of compilation
  project: string           // Project identifier

  metadata: {
    protocolName: string    // Display name
    protocolSlug: string    // URL-safe slug
    chain: string           // Blockchain
    projectType: string     // Category
    tokenName: string       // Protocol token symbol
    description: string     // Protocol overview text
  }

  totals: {
    contractCount: number               // Total contracts analyzed
    permissionedFunctionCount: number   // Functions with admin access
    scoredFunctionCount: number         // Functions scored as critical
    adminCount: number                  // Distinct admin entities
    dependencyCount: number             // External dependency contracts
    totalCapitalAtRisk: number          // USD value of user funds at risk
    totalTokenValueAtRisk: number       // USD value of protocol token at risk
  }

  admins: CompiledAdmin[]              // Who controls the protocol
  dependencies: CompiledDependency[]   // What external contracts it relies on
  funds: CompiledFundHolder[]          // Where the money sits
  functions: CompiledFunction[]        // Permissioned functions (critical impact)
  contracts: CompiledContract[]        // Full contract inventory

  sections: Record<string, unknown>    // Review config sections (e.g. codeAndAudits)
}
```

### CompiledAdmin

An entity (EOA, multisig, contract) that has admin control over protocol functions.

```typescript
interface CompiledAdmin {
  address: string                   // Admin address
  name: string                      // Human-readable name (e.g. "Steakhouse 5/8 Multisig")
  description: string               // What this admin controls
  adminType: string                 // EOA | EOAPermissioned | Multisig | Timelock |
                                    // Contract | Untemplatized | Immutable |
                                    // Upgradeable | Diamond | Revoked
  isGovernance: boolean             // Tagged as governance contract
  functions: CompiledAdminFunction[] // Functions this admin can call
  totalDirectCapital: number        // USD in contracts directly controlled
  totalDirectTokenValue: number     // Protocol token value directly controlled
  totalReachableCapital: number     // USD in contracts reachable via call chain
  totalReachableTokenValue: number  // Protocol token value reachable via call chain
}
```

**Admin types explained:**
- **EOA / EOAPermissioned** — Single private key controls (highest risk)
- **Multisig** — Multi-signature wallet (e.g. 3-of-5 signers)
- **Timelock** — Enforces delay before changes take effect
- **Contract / Untemplatized** — Generic smart contract
- **Immutable** — Cannot be changed after deployment
- **Upgradeable** — Can be upgraded (proxy pattern)
- **Diamond** — Diamond proxy pattern (EIP-2535)
- **Revoked** — Admin access has been renounced

### CompiledAdminFunction

A permissioned function controlled by an admin, with its financial impact.

```typescript
interface CompiledAdminFunction {
  contractAddress: string              // Contract containing the function
  contractName: string                 // Contract display name
  functionName: string                 // Function name (e.g. "pause")
  impact: 'critical'                   // Impact level (currently only critical)
  directFundsUsd: number               // USD in the function's own contract
  directTokenValueUsd: number          // Protocol token value in the contract
  reachableContracts: CompiledReachableContract[] // Contracts reachable via call chain
}
```

### CompiledReachableContract

A contract reachable from a permissioned function via the call graph.

```typescript
interface CompiledReachableContract {
  address: string           // Contract address
  name: string              // Contract display name
  viewOnlyPath: boolean     // True if only view/read calls lead here
  calledFunctions: string[] // Which functions are called on this contract
  fundsUsd: number          // USD value held by this contract
  tokenValueUsd: number     // Protocol token value held
  fundsAtRisk: boolean      // True if non-view calls can affect funds
}
```

### CompiledDependency

An external contract the protocol depends on (detected via call graph or manually tagged).

```typescript
interface CompiledDependency {
  address: string           // Dependency contract address
  name: string              // Resolved name (e.g. "ETH/USD Price Feed")
  description: string       // What role this dependency plays
  entity: string | null     // Vendor/provider (e.g. "Chainlink", "Morpho")
  isAutoDetected: boolean   // True if found by call graph analysis, false if manual
  viewOnlyPath: boolean     // True if only read calls reach this dependency
  calledFunctions: string[] // Functions called on this dependency
  functions: {              // Which protocol functions use this dependency
    contractAddress: string
    contractName: string
    functionName: string
    viewOnlyPath: boolean
  }[]
}
```

### CompiledFundHolder

A contract holding protocol funds (user deposits, treasury, etc.).

```typescript
interface CompiledFundHolder {
  address: string                    // Contract address
  name: string                       // Contract display name
  description: string                // What this contract holds
  balances: {                        // Token balances (from DeBank)
    totalUsdValue: number
  } | null
  positions: {                       // DeFi positions (from DeBank)
    totalUsdValue: number
  } | null
  tokenInfo: {                       // Protocol's own token info
    symbol: string                   // Token symbol
    price: number                    // Current price in USD
    totalSupply: string              // Total supply (string to preserve precision)
    tokenValue: number               // Market cap (price × supply)
  } | null
}
```

### CompiledFunction

A permissioned function flagged as critical impact.

```typescript
interface CompiledFunction {
  contractAddress: string   // Contract containing the function
  contractName: string      // Contract display name
  functionName: string      // Function name
  impact: 'critical'        // Impact level
}
```

### CompiledContract

A contract in the protocol's inventory.

```typescript
interface CompiledContract {
  address: string           // Contract address (with eth: prefix)
  name: string              // Resolved contract name
  isExternal: boolean       // Tagged as external dependency
  isGovernance: boolean     // Tagged as governance contract
  entity: string | null     // Vendor entity (for external contracts)
  proxyType: string | null  // Proxy pattern (e.g. "EIP1967", "gnosis safe")
}
```

---

## Data Flow

```
ReviewCompiler (backend)
  ├── writes: compiled-review.json per project
  │
compile-data.ts (build step)
  ├── reads: public/data/*/compiled-review.json
  ├── writes: public/data/index.json (aggregated index)
  │
Frontend (runtime)
  ├── GET /data/index.json          → LandingPage, ComparePage
  └── GET /data/{slug}/compiled-review.json → ReviewPage (Report/Explorer/Dashboard)
```

## Source

- Types: [`src/types.ts`](../src/types.ts)
- Index builder: [`scripts/compile-data.ts`](../scripts/compile-data.ts)
- API layer: [`src/data/api.ts`](../src/data/api.ts)
