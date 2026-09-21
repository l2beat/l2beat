/**
 * Loads the same environment V1 discovery reads.
 *
 * V1 resolves `<CHAIN>_RPC_URL` (and explorer keys) from `process.env`
 * through `getChainConfigs()`, and the repository keeps those values in
 * `packages/backend/.env`, not at the root. Running V2 from its own package
 * directory would therefore find nothing unless the file is located
 * explicitly, which is what this module does: `--env-file` wins, otherwise
 * the first existing of `<repo>/.env` and `<repo>/packages/backend/.env`,
 * where the repository root is the directory holding `.discovery.json`, the
 * same anchor V1 uses for its paths.
 *
 * Values are never logged or returned; only the path that was loaded is, so
 * a run can say where its configuration came from without leaking it.
 */
import { getDiscoveryPaths } from '@l2beat/discovery'
import { config as dotenv } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'

export const DEFAULT_ENV_FILES = ['.env', 'packages/backend/.env'] as const

export interface LoadedEnv {
  /** Absolute path of the file that was loaded, or undefined when none existed. */
  file?: string
}

export function loadEnv(envFile?: string): LoadedEnv {
  const file = envFile ?? findDefaultEnvFile()
  if (file === undefined) {
    return {}
  }
  if (!existsSync(file)) {
    throw new Error(`Env file does not exist: ${file}`)
  }
  dotenv({ path: file })
  return { file: path.resolve(file) }
}

function findDefaultEnvFile(): string | undefined {
  const root = getDiscoveryPaths().root
  return DEFAULT_ENV_FILES.map((candidate) => path.join(root, candidate)).find(
    (candidate) => existsSync(candidate),
  )
}
