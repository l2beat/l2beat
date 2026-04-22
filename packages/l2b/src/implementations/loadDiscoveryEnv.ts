import { config as dotenv } from 'dotenv'
import { existsSync } from 'fs'
import { dirname, join, resolve } from 'path'

const CONFIG_FILENAME = '.discovery.json'

/**
 * Walks up from process.cwd() to find a `.discovery.json` file (the discovery
 * project root). If found, loads any `.env` file in well-known locations so
 * that `getEnv()` calls inside discovery can find the chain RPC URLs and
 * Etherscan keys regardless of the user's current working directory.
 *
 * Best effort: silently no-ops if no `.discovery.json` or no `.env` is found.
 */
export function loadDiscoveryEnv(): void {
  // Always try cwd first so an explicit local .env wins.
  const cwdEnv = join(process.cwd(), '.env')
  if (existsSync(cwdEnv)) {
    dotenv({ path: cwdEnv })
    return
  }

  const root = findDiscoveryRoot()
  if (!root) return

  // Then look in known L2BEAT-shaped locations relative to the discovery root.
  const candidates = [
    join(root, 'packages', 'config', '.env'),
    join(root, '.env'),
  ]
  for (const path of candidates) {
    if (existsSync(path)) {
      dotenv({ path })
      return
    }
  }
}

function findDiscoveryRoot(): string | undefined {
  let dir = process.cwd()
  const fsRoot = resolve('/')
  while (dir !== fsRoot) {
    if (existsSync(join(dir, CONFIG_FILENAME))) {
      return dir
    }
    dir = dirname(dir)
  }
  return undefined
}
