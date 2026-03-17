---
name: build
description: Rebuild DeFiDisco packages (protocolbeat, l2b, defiscan-frontend) after code changes. Use this after editing files in protocolbeat, l2b, or defiscan-frontend to make changes take effect.
---

# Build DeFiDisco Packages

Rebuild the packages that have been modified so changes take effect.

## Instructions

1. Determine which packages need rebuilding by checking which files were modified in the current conversation. The three packages are:
   - **protocolbeat** — UI components (`packages/protocolbeat/`)
   - **l2b** — backend/CLI (`packages/l2b/`)
   - **defiscan-frontend** — public review site (`packages/defiscan-frontend/`)

2. Build each package by running `pnpm build` from its directory. This is simpler and more reliable than using turbo filters.

   **Important**: Always source nvm first to ensure `pnpm` is available:
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

   **Examples:**

   **Single package** (most common — e.g. l2b):
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco/packages/l2b && pnpm build
   ```

   **Multiple packages** (run sequentially):
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco/packages/l2b && pnpm build && cd /home/emilien/defidisco/packages/protocolbeat && pnpm build
   ```

   **All three**:
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco/packages/l2b && pnpm build && cd /home/emilien/defidisco/packages/protocolbeat && pnpm build && cd /home/emilien/defidisco/packages/defiscan-frontend && pnpm build
   ```

3. If the build fails, read the error output and fix the issue, then retry.

4. Report the build result concisely — just say which packages were built and whether it succeeded.