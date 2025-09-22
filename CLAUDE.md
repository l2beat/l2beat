# DefidDisco Development Guide

## L2BEAT Architecture Reference

### Core System Overview
**L2BEAT** is a TypeScript monorepo for analyzing Ethereum Layer 2 protocols. **DefidDisco** is a fork enhanced for DeFi analysis.

**Key Packages:**
- **`discovery`**: Core contract analysis engine (keep unchanged)
- **`protocolbeat`**: React UI with Monaco editor
- **`l2b`**: CLI tool and API server
- **`config`**: Project configurations and results

**Commands:**
```bash
# Setup and run
pnpm install && pnpm build:dependencies
cd ~/defidisco/packages/config && l2b ui  # http://localhost:2021/ui

# Sync upstream
git fetch upstream && git merge upstream/main
```

### Discovery System
**Automated Analysis:** Discovery automatically analyzes any contract by:
- Calling all view/pure functions with 0 parameters
- Testing array functions with indices 0-4
- Detecting proxy patterns and relationships
- Applying templates for known contract types

**Template System:** Contracts matched by bytecode hash to templates in `packages/config/src/projects/_templates/`

**Handler System:** Custom handlers in `packages/discovery/src/discovery/handlers/user/` for specialized analysis

### Data Flow
1. **Config** (`config.jsonc`) → Discovery engine
2. **Analysis** → Results in `discovered.json`
3. **Backend** monitors changes → Frontend displays data

---

## DefidDisco Architecture

### Minimal Integration Principle ⭐
**Core Philosophy**: Minimize modifications to original L2BEAT files to ensure easy upstream merges

### Code Organization
**DefidDisco folders** (keep all our code here):
- `packages/protocolbeat/src/defidisco/` - All UI components, extensions, icons
- `packages/l2b/src/implementations/discovery-ui/defidisco/` - All backend modules
- `packages/discovery/src/discovery/handlers/defidisco/` - Discovery handlers

**Integration points** (minimal modifications only):
- `ValuesPanel.tsx` - Single `<ValuesPanelExtensions>` line
- `TerminalPanel.tsx` - Single `<TerminalExtensions>` line
- `main.ts` - API endpoint registrations (unavoidable)
- `api.ts` - DefidDisco API functions (unavoidable)

### Repository Setup
- **Fork**: `~/defidisco/` (complete L2BEAT fork)
- **Why Fork**: Avoids dependency issues with unpublished internal packages
- **Benefits**: Full toolchain access, easy upstream sync

## DefidDisco Features

### Function Permission Analysis ✅
**Discovery Handler**: `WriteFunctionPermissionHandler` in `/defidisco/` folder
- Analyzes write function permissions in source code
- Handler config: `"handler": { "type": "functionPermission" }`
- **Critical**: Run `pnpm run generate-schemas && pnpm build` after handler changes

### Interactive Permission Management ✅
**UI System**: Complete permission management in `/defidisco/ValuesPanelExtensions.tsx`
- **Data Separation**: Discovered permissions vs user overrides (persistent)
- **Three Attributes**: Checked (✓), Permission (🔒), Risk Score (⚡)
- **Features**: Expandable functions, code navigation, owner tracking
- **Performance**: File caching, optimistic updates, debounced inputs

### Permissions Report Generation ✅
**Terminal Integration**: Button in `/defidisco/TerminalExtensions.tsx`
- Generates markdown table from `permission-overrides.json`
- Maps addresses to contract names, resolves owner definitions
- Server-Sent Events API for real-time output

### DeFiScan Panel ✅
**Overview Panel**: Contract analysis dashboard in `/defidisco/DeFiScanPanel.tsx`
- **Status Section**: Initial vs discovered contract counts, address type breakdown
- **Contract Types**: Contracts, EOAs, Multisigs, External addresses
- **Permissions Dashboard**: Shows permissioned functions count and review progress
- **Data Sources**: Uses `getProject`, `useContractTags`, and `getPermissionOverrides` APIs
- **Integration**: Registered in `ProjectPage.tsx` and `store.ts` following panel patterns

---

## Development Guidelines

### 🎯 Minimal Integration Principle
**ALWAYS write new code in `/defidisco/` folders**
- UI components → `packages/protocolbeat/src/defidisco/`
- Backend modules → `packages/l2b/src/implementations/discovery-ui/defidisco/`
- Discovery handlers → `packages/discovery/src/discovery/handlers/defidisco/`

**Integration points should be minimal:**
- Single import + single component usage in UI files
- API functions in `api.ts` (unavoidable for frontend consumption)
- Endpoint registration in `main.ts` (unavoidable for routing)

### Development Patterns
**Handler Development:**
1. Create in `/defidisco/` folder, register in main `index.ts`
2. **Critical**: Run `pnpm run generate-schemas && pnpm build`
3. Handler config must wrap in `"handler"` object

**UI Development:**
1. Create extension components in `/defidisco/`
2. Use React Query with proper cache invalidation
3. Implement optimistic updates with error rollback

**Common Mistakes:**
- ❌ Writing DefidDisco code in original L2BEAT files
- ❌ Not regenerating schemas after handler changes
- ❌ Mixing discovered data with user data
- ❌ Using non-existent hooks (check existing patterns in `/defidisco/` files)
- ❌ Address format mismatches (contracts use `eth:0x...`, tags use `0x...`)

### File Structure
```
packages/
├── discovery/src/discovery/handlers/defidisco/
│   └── WriteFunctionPermissionHandler.ts
├── protocolbeat/src/defidisco/
│   ├── ValuesPanelExtensions.tsx
│   ├── TerminalExtensions.tsx
│   ├── DeFiScanPanel.tsx
│   ├── PermissionsDisplay.tsx
│   ├── FunctionFolder.tsx
│   ├── ExternalButton.tsx
│   └── icons/
├── l2b/src/implementations/discovery-ui/defidisco/
│   ├── permissionOverrides.ts
│   ├── contractTags.ts
│   └── generatePermissionsReport.ts
└── config/src/projects/compound-v3/
    └── permission-overrides.json
```

### Data Access Patterns
**API Access**: For new components, follow existing patterns:
- **Project Data**: Use `useQuery` with `getProject(project)` from `api.ts`
- **Contract Tags**: Use `useContractTags(project)` hook for external address marking
- **Permission Overrides**: Use `useQuery` with `getPermissionOverrides(project)` directly (no hook exists)
- **Address Format**: Always normalize `contract.address.replace('eth:', '').toLowerCase()` when matching with tags
- **EOA Counting**: EOAs stored separately in `entry.eoas[]` array, not mixed with contracts

**Panel Development**: To add new panels:
1. Add panel ID to `PANEL_IDS` in `store.ts`
2. Register component in `PANELS` and `READONLY_PANELS` in `ProjectPage.tsx`
3. Create panel component in `/defidisco/` folder following existing patterns
4. Import and register in `ProjectPage.tsx` with single line addition

**Future Development:** Follow the minimal integration principle to ensure easy upstream merges and maintainable code separation.