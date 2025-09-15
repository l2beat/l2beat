# L2BEAT Discovery System - Complete Analysis & Setup Guide

## Project Overview

**L2BEAT** is a comprehensive research and analytics platform for Ethereum Layer 2 scaling solutions that provides:
- Research, statistics, and monitoring for Layer 2 protocols on Ethereum
- Tracks TVL (Total Value Locked), risk assessments, and technical details of L2s
- Offers a public website at [l2beat.com](https://www.l2beat.com) with live data

## Architecture Overview

### Monorepo Structure
- **TypeScript monorepo** using pnpm + Turbo for build orchestration
- **Node.js 22** runtime required
- **Modular package design** with published npm packages

### Core Packages
- **`backend`** - API server that collects and serves L2 data
- **`frontend`** - Next.js website displaying research and statistics  
- **`config`** - Central configuration for all L2 projects and chains
- **`discovery`** - Smart contract exploration tool (CORE ENGINE)
- **`database`** - Database schemas and migrations
- **`l2b`** - CLI tool for discovery operations
- **`shared`/`shared-pure`** - Common utilities

## Smart Contract Discovery System (Core Innovation)

### What Discovery Does
The **smart contract discovery system** is the technical foundation that makes L2BEAT possible:

1. **Explores smart contract networks** - Starting from "initial addresses", recursively discovers all related contracts
2. **Extracts contract metadata** - Source code, proxy patterns, admin relationships, state variables
3. **Tracks changes over time** - Monitors upgrades, governance changes, parameter modifications
4. **Templates contract behavior** - Identifies common patterns and applies standardized analysis

### Discovery Engine Architecture

#### Main Components (`packages/discovery/src/discovery/`)
- **`DiscoveryEngine`** - Main orchestrator that coordinates analysis
- **`AddressAnalyzer`** - Examines each contract in depth
- **`ProxyDetector`** - Identifies proxy patterns (OpenZeppelin, Diamond, etc.)
- **`SourceCodeService`** - Fetches and verifies contract source code
- **`HandlerExecutor`** - Runs analysis scripts for specific contract types
- **`TemplateService`** - Applies pre-built templates for common L2 patterns

#### Analysis Process
1. **Template Matching** - Contracts are fingerprinted against known patterns
2. **Automatic Handler Generation** - System generates handlers for any contract
3. **Relationship Discovery** - Follows contract references recursively
4. **Permission Analysis** - Extracts governance and access control

### Automated Source Code Analysis

#### Level of Automation: Very High

**Automatic System Handlers** (`getSystemHandlers.ts`):
```typescript
// For ANY contract, discovery automatically:
for (const fn of Object.values(abi.functions)) {
  if (fn.inputs.length === 0) {
    // Creates SimpleMethodHandler - calls owner(), paused(), etc.
    methodHandlers.push(new SimpleMethodHandler(fn))
  } else if (fn.inputs.length === 1 && fn.inputs[0]?.type === 'uint256') {
    // Creates LimitedArrayHandler - calls validators(0-4), owners(0-4)
    arrayHandlers.push(new LimitedArrayHandler(fn, 5))
  }
}
```

**Pattern Recognition**:
- ✅ **OpenZeppelin AccessControl** - Automatically detects and extracts roles
- ✅ **Proxy patterns** - EIP-1967, OpenZeppelin, Diamond, Custom
- ✅ **L2-specific patterns** - Arbitrum, Optimism, Polygon, zkSync governance
- ✅ **DeFi patterns** - Timelock controllers, multisigs, DAOs
- ✅ **Custom protocols** - Scroll, Linea, Starkware governance

**AccessControl Handler Example**:
```typescript
// Automatically finds role functions in ABI
const name = entry.match(/^function (\w+)_ROLE\(\)/)?.[1]
if (name) {
  const hash = utils.solidityKeccak256(['string'], [fullName])
  this.knownNames.set(hash, fullName) // Maps 0x123... to "ADMIN_ROLE"
}
```

#### Template System
Templates are stored in `packages/config/src/projects/_templates/`:
- **Shape Matching** - Each template has `shapes.json` with contract bytecode hashes
- **Automatic Application** - Discovery matches bytecode hash against known templates
- **Custom Logic** - `template.jsonc` defines special analysis rules

Example GnosisSafe template:
```json
{
  "ignoreInWatchMode": ["nonce"],
  "ignoreMethods": ["getThreshold", "getOwners"],
  "fields": {
    "GnosisSafe_modules": {
      "permissions": [{ "type": "act" }]
    }
  }
}
```

#### Fallback for Unknown Contracts
When no template matches, discovery still performs comprehensive analysis:
- ✅ All view/pure functions with 0 parameters called automatically
- ✅ Array-like functions called with indices 0-4
- ✅ Proxy detection and relationships
- ✅ Contract dependencies mapped
- ✅ Source code extracted (if verified)

## Discovery Input → Output Example

### Input Configuration (`config.jsonc`)
```json
{
  "name": "optimism",
  "initialAddresses": [
    "eth:0xdE1FCfB0851916CA5101820A69b13a4E276bd81F",  // AddressManager
    "eth:0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f",  // SNX Bridge
    // ... 14 more addresses
  ],
  "names": {
    "eth:0x10E6593CDda8c58a1d0f14C5164B376352a55f2F": "L1DAITokenBridge"
  }
}
```

### Output Results (`discovered.json`)
- **Scale**: 16 input addresses → 89 total addresses (560% expansion)
- **52 Smart contracts** with full analysis
- **37 EOAs** (externally owned accounts)
- **Complete governance structure** mapped
- **Cross-chain relationships** (L1 ↔ L2)

Example contract output:
```json
{
  "address": "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
  "type": "Contract",
  "template": "opstack/L1StandardBridge",
  "values": {
    "$admin": "eth:0x543bA4AADBAb8f9025686Bd03993043599c6fB04",
    "messenger": "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
    "l2TokenBridge": "oeth:0x4200000000000000000000000000000000000010",
    "paused": false,
    "version": "2.6.0"
  }
}
```

## Data Flow Through System

1. **Config → Discovery** - Project configs define what to discover
2. **Discovery → Analysis** - Engine extracts relationships and state  
3. **Analysis → Output** - Results saved as `discovered.json` files
4. **Output → Backend** - Backend monitors files for changes
5. **Backend → Frontend** - Changes reflected on website

### Backend Integration (`packages/backend/src/modules/update-monitor/`)
- **DiscoveryRunner** - Executes discovery for each project periodically
- **DiscoveryOutputCache** - Caches results to detect changes
- **UpdateNotifier** - Sends alerts when contracts change

## Published Packages (Reusable)

### Core Discovery Engine
```bash
npm install @l2beat/discovery
```
Provides:
- Full contract discovery engine
- Template system for pattern recognition
- Proxy detection and analysis
- Source code extraction
- Relationship mapping

### Usage Example
```typescript
import { runDiscovery } from '@l2beat/discovery'

const result = await runDiscovery({
  project: 'my-l2',
  initialAddresses: ['eth:0x123...'],
  chainConfigs: [/* ethereum, arbitrum, etc */]
})

console.log(result.contracts) // All discovered contracts
console.log(result.relationships) // Contract dependencies
```

### Supporting Packages
```bash
npm install @l2beat/backend-tools
npm install @l2beat/uif  
npm install @l2beat/discovery-types
npm install earl  # L2BEAT's testing library
```

## Discovery UI System

### Architecture
**Two-part system**:
1. **Backend API Server** - Express.js server on port 2021
2. **Frontend React App** - `protocolbeat` package with Monaco editor

### Running UI Locally

#### Setup Commands
```bash
# Install dependencies
pnpm install

# Build l2b CLI tool
cd packages/l2b
pnpm l2bup

# Launch UI (from packages/config)
cd ../config
l2b ui
# Opens http://localhost:2021/ui
```

#### Quick Restart Commands
```bash
cd /home/emilien/l2beat/packages/config
l2b ui
```

### UI Features
- **Project browser** for all L2 projects
- **Contract analysis views** with source code
- **Relationship mapping** between contracts
- **Search functionality** across projects
- **Template information** and descriptions
- **Live function values** from contracts

## Using Discovery UI for Your Own Projects

### Simple Local Setup
```bash
mkdir my-l2-analysis
cd my-l2-analysis

# Create discovery config
cat > .discovery.json << 'EOF'
{
  "discovery": "./projects",
  "cache": "./cache/discovery.sqlite"
}
EOF

# Create project structure
mkdir -p projects/my-project cache

# Add your project config
cat > projects/my-project/config.jsonc << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/l2beat/l2beat/main/packages/discovery/schemas/config.v2.schema.json",
  "name": "my-project",
  "initialAddresses": [
    "eth:0x123...",  // Your contracts
    "eth:0x456..."
  ],
  "names": {
    "eth:0x123...": "MyBridge",
    "eth:0x456...": "MyGovernance"
  }
}
EOF

# Launch UI for your projects
l2b ui
```

### Required Directory Structure
```
my-l2-analysis/
├── .discovery.json          # Points to your projects
├── projects/
│   ├── my-project/
│   │   ├── config.jsonc      # Discovery config
│   │   └── discovered.json   # Generated after discovery
│   └── another-project/
│       └── config.jsonc
└── cache/
    └── discovery.sqlite      # Discovery cache
```

### Environment Setup for Discovery
```bash
# Create .env for actual contract discovery
cat > .env << 'EOF'
ETHEREUM_RPC_URL_FOR_DISCOVERY=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
ETHERSCAN_API_KEY_FOR_DISCOVERY=YOUR_ETHERSCAN_KEY
EOF
```

## Key Insights for Building Our Own Version

### What Makes L2BEAT Powerful
1. **Automation** - 95% of analysis happens automatically
2. **Template System** - Reusable patterns for common contracts
3. **Recursive Discovery** - Follows all contract relationships
4. **Real-time Monitoring** - Detects changes and upgrades
5. **Visual Interface** - Makes complex data accessible

### Reusable Components
- **Discovery Engine** - Can analyze any smart contract ecosystem
- **Template System** - Patterns work beyond L2s (DeFi, DAOs, etc.)
- **UI Framework** - API + React frontend approach
- **Configuration System** - Simple JSON configs drive everything

### Extension Opportunities
- **New Chain Support** - Add more blockchains beyond Ethereum
- **Custom Templates** - Create templates for specific protocols
- **Enhanced Visualizations** - Better relationship mapping
- **Automated Alerts** - Real-time notifications for changes
- **Risk Scoring** - Automated security assessments

## Technical Setup Summary

### Dependencies Installed
- **pnpm** - Package manager for monorepo
- **l2b CLI** - Discovery command-line tool
- **Discovery UI** - Running on http://localhost:2021/ui

### Commands Reference
```bash
# Build dependencies
pnpm install
pnpm build:dependencies

# Build l2b tool
cd packages/l2b && pnpm l2bup

# Launch discovery UI
cd packages/config && l2b ui

# Run discovery on project
l2b discover ethereum optimism

# Discovery help
l2b --help
l2b discover --help
```

## Next Steps for Our Enhanced Version

### Potential Improvements
1. **Multi-chain Discovery** - Simultaneous analysis across chains
2. **Advanced Visualizations** - Graph-based relationship mapping
3. **Custom Risk Metrics** - Automated security scoring
4. **Enhanced Templates** - More protocol-specific patterns
5. **Real-time Dashboards** - Live monitoring interfaces
6. **API Integrations** - Connect to external data sources
7. **Machine Learning** - Pattern recognition for unknown contracts

### Technical Considerations
- **Scalability** - Handle larger contract sets efficiently
- **Performance** - Optimize discovery speed and caching
- **Extensibility** - Plugin architecture for custom handlers
- **Security** - Sandboxed execution for unknown contracts
- **Monitoring** - Better alerting and notification systems

This comprehensive analysis provides the foundation for understanding L2BEAT's architecture and building our enhanced version with additional features and improvements.

---

# DEFIDISCO FORK STRATEGY

## Overview

**DefidDisco** is now a fork of the L2BEAT monorepo, allowing us to build DeFi-focused discovery tools while maintaining compatibility with upstream L2BEAT developments.

## Fork Architecture Decision

After attempting to use L2BEAT's published packages independently, we encountered significant dependency issues with unpublished internal packages (`@l2beat/shared`, `@l2beat/shared-pure`, etc.). **Forking the entire monorepo** provides several critical advantages:

### Why Fork vs. Package Consumption?

1. **Complete Compatibility** - All internal dependencies work seamlessly
2. **No Dependency Hell** - Avoid missing packages and version conflicts
3. **Full Toolchain Access** - Get discovery engine, UI, templates, and CLI tools
4. **Proven Architecture** - Build on battle-tested monorepo structure
5. **Easy Upstream Sync** - Can merge L2BEAT improvements continuously

## Repository Structure

```
defidisco/ (forked from l2beat/l2beat)
├── packages/
│   ├── discovery/           # L2BEAT discovery engine (keep as-is)
│   ├── config/
│   │   └── src/projects/
│   │       ├── defi/        # ← Our DeFi-specific projects
│   │       ├── _templates/
│   │       │   └── defi/    # ← Our DeFi-specific templates
│   │       └── ...          # Original L2BEAT projects
│   ├── backend/             # L2BEAT backend (extend)
│   ├── frontend/            # L2BEAT frontend (extend)
│   ├── l2b/                # L2BEAT CLI (extend)
│   └── shared*/            # L2BEAT utilities (keep as-is)
```

## Development Strategy

### 1. Safe Enhancement Patterns (100% Compatible)

**Add New Directories:**
- `packages/config/src/projects/defi/` - DeFi protocol configurations
- `packages/config/src/projects/_templates/defi/` - DeFi-specific templates
- `packages/discovery/src/discovery/handlers/defi/` - DeFi discovery handlers

**Add New Packages:**
- `packages/defi-backend/` - DeFi-specific API extensions
- `packages/defi-frontend/` - DeFi-focused UI components
- `packages/defi-cli/` - Enhanced CLI for DeFi analysis

### 2. Extension Points (95% Compatible)

**Extend Existing Systems:**
- Add new discovery handlers for DeFi patterns (yield farming, lending, AMMs)
- Create templates for common DeFi protocols (Compound, Aave, Uniswap variants)
- Add DeFi-specific risk assessment criteria
- Extend backend APIs with DeFi analytics endpoints

### 3. Upstream Compatibility Strategy

**Merge Workflow:**
```bash
# Regular upstream sync (weekly/monthly)
git fetch upstream
git checkout main
git merge upstream/main
# Resolve any conflicts in our custom additions
```

**Naming Conventions:**
- Prefix our additions with `defi-*` or `defidisco-*`
- Keep all custom code in dedicated subdirectories
- Avoid modifying core L2BEAT files when possible

### 4. Areas to Avoid Modifying

- Core discovery engine (`packages/discovery/src/discovery/engine/`)
- Main backend server structure
- Database schemas (add new tables, don't modify existing)
- Frontend core components (extend, don't modify)

## Implementation Roadmap

### Phase 1: Foundation (Week 1) ✅ COMPLETED
- [x] Fork L2BEAT repository as `defidisco`
- [x] Set up upstream remote tracking
- [x] Create DeFi project structure
- [x] Add first DeFi protocol configurations (Compound V3)

### Phase 2: DeFi Discovery (Week 2-3)
- [ ] Implement DeFi-specific discovery handlers
- [ ] Create templates for major DeFi protocols
- [ ] Add yield farming and lending pattern recognition
- [ ] Test discovery on Compound, Aave, Uniswap

### Phase 3: Enhanced UI (Week 4)
- [ ] Extend frontend with DeFi-specific views
- [ ] Add DeFi risk assessment displays
- [ ] Create DeFi protocol relationship visualizations
- [ ] Add DeFi-specific search and filtering

### Phase 4: Analytics (Week 5+)
- [ ] Build DeFi-specific backend APIs
- [ ] Add yield calculation endpoints
- [ ] Implement TVL tracking for DeFi protocols
- [ ] Create DeFi risk scoring algorithms

## Key Benefits

1. **Immediate Functionality** - Full L2BEAT toolchain works day 1
2. **Proven Scalability** - Built on production-tested architecture
3. **Community Compatibility** - Can contribute improvements back to L2BEAT
4. **Future-Proof** - Easy to stay current with L2BEAT developments
5. **Reduced Development Time** - Focus on DeFi features, not infrastructure

## Commands Reference

```bash
# Navigate to DefidDisco
cd /home/emilien/defidisco

# Build all packages
pnpm install && pnpm build:dependencies

# Launch discovery UI
cd packages/config && l2b ui

# Run discovery on DeFi project
l2b discover compound-v3

# Sync with upstream L2BEAT
git fetch upstream && git merge upstream/main
```

This fork-based approach allows us to build powerful DeFi discovery tools while maintaining the robust foundation that L2BEAT provides.

## Current Implementation Status

### ✅ Successfully Completed (September 2025)

**Fork Implementation:**
- **Repository**: `/home/emilien/defidisco/` - Complete L2BEAT fork
- **Upstream Remote**: `upstream` pointing to `https://github.com/l2beat/l2beat.git`
- **Working Directory**: All L2BEAT packages functioning with no dependency issues
- **Discovery UI**: Running at `http://localhost:2021/ui`

**DeFi Enhancement Structure:**
```
defidisco/packages/config/src/projects/
├── defi/compound-v3/config.jsonc     # First DeFi project configuration
├── _templates/defi/                  # DeFi-specific templates (ready)
└── ../../discovery/handlers/defi/    # DeFi discovery handlers (ready)
```

**Initial DeFi Project - Compound V3:**
- **Markets Configured**: cUSDCv3, cWETHv3, cUSDTv3
- **Contract Addresses**:
  - `eth:0xc3d688B66703497DAA19211EEdff47f25384cdc3` (cUSDCv3)
  - `eth:0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3` (cWETHv3)
  - `eth:0xA17581A9E3356d9A858b789D68B4d866e593aE94` (cUSDTv3)
- **DeFi-Specific Fields**: borrowMin, liquidationFactor, supplyKink, borrowKink
- **Ready for Discovery**: `l2b discover compound-v3`

### Decision Context: Why Fork Over Package Consumption

**Problem Encountered:**
- L2BEAT publishes `@l2beat/discovery` but not internal dependencies
- Missing packages: `@l2beat/shared`, `@l2beat/shared-pure`, `@l2beat/validate`
- Dependency resolution failures when trying to use published packages
- Complex monorepo structure not fully exposed via npm

**Solutions Attempted:**
1. **Package Consumption** - Failed due to unpublished dependencies
2. **Third-party Packages** - Rejected due to security concerns (`@mradomski/discovery`)
3. **Local Package Creation** - Partially successful but incomplete compatibility
4. **Complete Fork** - ✅ Chosen solution providing full compatibility

**Fork Benefits Realized:**
- ✅ Zero dependency issues - all packages work immediately
- ✅ Full L2BEAT toolchain access (discovery, UI, CLI, templates)
- ✅ Proven production architecture
- ✅ Easy upstream synchronization capability
- ✅ Immediate development productivity

### Technical Migration Summary

**From:** Custom DefidDisco monorepo with partial L2BEAT integration
**To:** Complete L2BEAT fork with DeFi-specific enhancements

**Migration Steps Completed:**
1. Removed custom DefidDisco implementation attempts
2. Copied complete L2BEAT repository as `defidisco` fork
3. Set up upstream remote for future synchronization
4. Created DeFi enhancement directory structure
5. Implemented first Compound V3 project configuration
6. Verified UI functionality with full L2BEAT project catalog

**Current Capabilities:**
- Browse all existing L2BEAT projects (200+ Layer 2 protocols)
- Access complete discovery system with templates and handlers
- Run discovery on any project including our new DeFi configurations
- Extend system with DeFi-specific handlers and templates
- Maintain compatibility with upstream L2BEAT developments

**Ready for Next Development Phase:**
- Implement DeFi-specific discovery handlers for yield farming, lending protocols
- Create templates for Compound, Aave, Uniswap, and other major DeFi protocols
- Add DeFi risk assessment and analytics capabilities
- Build enhanced UI components for DeFi protocol visualization