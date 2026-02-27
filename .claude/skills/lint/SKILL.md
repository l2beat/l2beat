---
name: lint
description: Run Biome format check and auto-fix on DeFiDisco folders. Use this after editing files in defidisco/ directories to ensure formatting is correct.
---

# Lint DeFiDisco

Run Biome format check on all DeFiDisco folders (matches CI workflow).

## Instructions

Run this exact command:

```bash
pnpm biome format --error-on-warnings \
  packages/protocolbeat/src/apps/discovery/defidisco/ \
  packages/l2b/src/implementations/discovery-ui/defidisco/ \
  packages/discovery/src/discovery/handlers/defidisco/
```

If there are formatting errors, fix them by running:

```bash
pnpm biome format --write \
  packages/protocolbeat/src/apps/discovery/defidisco/ \
  packages/l2b/src/implementations/discovery-ui/defidisco/ \
  packages/discovery/src/discovery/handlers/defidisco/
```

Then re-run the check to confirm all issues are resolved.
