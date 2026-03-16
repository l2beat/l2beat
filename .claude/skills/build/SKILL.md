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

2. Build only the packages that had changes. Use the turbo filters to build them together in a single command. The filter flags are:
   - `--filter=@l2beat/protocolbeat` for protocolbeat
   - `--filter=@l2beat/l2b` for l2b
   - `--filter=@l2beat/defiscan-frontend` for defiscan-frontend

   **Important**: Always source nvm first to ensure `pnpm` is available:
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

   **Most common case** (protocolbeat + l2b both changed):
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco && pnpm turbo run build --filter=@l2beat/protocolbeat --filter=@l2beat/l2b
   ```

   **All three** (if defiscan-frontend also changed):
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco && pnpm turbo run build --filter=@l2beat/protocolbeat --filter=@l2beat/l2b --filter=@l2beat/defiscan-frontend
   ```

   **Single package** (if only one changed):
   ```bash
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && cd /home/emilien/defidisco && pnpm turbo run build --filter=@l2beat/<package-name>
   ```

3. If the build fails, read the error output and fix the issue, then retry.

4. Report the build result concisely — just say which packages were built and whether it succeeded.
