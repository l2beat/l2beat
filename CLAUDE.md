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
cd packages/config && l2b ui  # http://localhost:2021/ui

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

## DefidDisco Enhancements

### Repository Setup
- **Fork**: `~/defidisco/` (complete L2BEAT fork)
- **Why Fork**: Avoids dependency issues with unpublished internal packages
- **Benefits**: Full toolchain access, easy upstream sync

### Enhancement 1: Function Permission Analysis ✅

**Added:** `FunctionPermissionHandler` analyzes write function permissions in source code

**Critical Pattern - Handler Config:**
```json
{
  "fields": {
    "functionPermissions": {
      "handler": { "type": "functionPermission" }  // Must wrap in "handler" object
    }
  }
}
```

**Essential Steps:**
1. Create handler in `packages/discovery/src/discovery/handlers/user/`
2. Register in `index.ts`
3. **Always run:** `cd packages/discovery && pnpm run generate-schemas && pnpm build`

### Enhancement 2: Interactive Permission UI ✅

**Added:** Complete UI system for managing function permissions

**Architecture:**
- **Data Separation**: Discovered permissions (ephemeral) vs user overrides (persistent)
- **File Storage**: `permission-overrides.json` for user data only
- **User Priority**: Manual classifications override auto-detection
- **Performance**: File caching (3ms response), optimistic UI updates

**Components:**
- Icons: Lock (🔒), Check (✓), Score (⚡), Open (📁)
- `PermissionsDisplay.tsx`: Main permission management UI
- Backend API: GET/PUT endpoints for override management

### Enhancement 3: Enhanced Attributes ✅

**Three Interactive Attributes per Function:**
- **✓ Checked**: Task completion (gray → green)
- **🔒 Permission**: Access control (gray → red)
- **⚡ Score**: Risk assessment (gray → green → orange → red)

**Data Model:**
```json
{
  "contractAddress": "eth:0x...",
  "functionName": "admin",
  "userClassification": "permissioned",
  "checked": true,
  "score": "medium-risk",
  "description": "Function documentation",
  "timestamp": "2025-09-17T16:46:36.131Z"
}
```

### Enhancement 4: Expandable Functions + Navigation ✅

**UI Improvements:**
- **Dropdowns**: Functions expand to show description textarea
- **Debounced Input**: 500ms delay for description saves
- **Code Navigation**: 📁 icon opens function in Code panel
- **Multi-occurrence**: Counter-based cycling through function definitions
- **Scroll Reset**: Horizontal scroll to 0 for readability

---

## Development Patterns

### Handler Development
1. Create in `packages/discovery/src/discovery/handlers/user/`
2. Register in `index.ts` with imports
3. **Critical**: Run `pnpm run generate-schemas` from discovery package
4. Test on single contract first

### UI Development
1. **Separate concerns**: Keep original components unchanged, add new sections
2. **React Query**: Proper cache invalidation for immediate updates
3. **Optimistic updates**: Immediate feedback with error rollback
4. **Performance**: Cache file parsing, debounce inputs

### Common Mistakes
- ❌ **Handler config**: Forgetting to wrap in `"handler"` object
- ❌ **Schema updates**: Not regenerating after handler changes
- ❌ **Data mixing**: Polluting discovered data with user data
- ❌ **Cache stale**: Not invalidating React Query after mutations

### File Structure
```
packages/
├── discovery/src/discovery/handlers/user/
│   ├── FunctionPermissionHandler.ts
│   └── index.ts (registration)
├── protocolbeat/src/
│   ├── icons/ (UI icons)
│   ├── panel-values/PermissionsDisplay.tsx
│   └── components/editor/editor.ts (navigation)
├── l2b/src/implementations/discovery-ui/
│   ├── permissionOverrides.ts (backend)
│   └── main.ts (API endpoints)
└── config/src/projects/compound-v3/
    └── permission-overrides.json (user data)
```

## Future Development

### Next Features
- Add tag to specific contracts to mark them as external
- Assign permission owners of each functions
- DeFi-specific templates (Compound, Aave, Uniswap)
- Advanced risk scoring algorithms
- Export/import capabilities

### Best Practices
- Study existing L2BEAT patterns before extending
- Test: single contract → full project → multiple projects
- Cache heavy operations, optimize UI responsiveness
- Keep discovered vs user data strictly separated
- Update this guide with new patterns

This guide captures essential knowledge for extending DefidDisco while avoiding common development pitfalls.