import { existsSync, readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { z } from 'zod'

const CONFIG_FILENAME = '.discovery.json'

export interface DiscoveryPaths {
  root: string
  discovery: string
  cache: string
}

let memoized: DiscoveryPaths | undefined

export function getDiscoveryPaths(root?: string): DiscoveryPaths {
  if (root === undefined && memoized) {
    return memoized
  }
  const paths = readConfig(root ?? discoverRoot())
  if (root === undefined) {
    memoized = paths
  }
  return paths
}

function discoverRoot(): string {
  let dir = process.cwd()
  const root = resolve('/')
  while (dir !== root) {
    if (existsSync(join(dir, CONFIG_FILENAME))) {
      return dir
    }
    dir = dirname(dir)
  }
  throw new Error(`Cannot locate the ${CONFIG_FILENAME} file`)
}

const ConfigInput = z.object({
  discovery: z.string().optional(),
  cache: z.string().optional(),
})

const DEFAULT_CONFIG: Omit<DiscoveryPaths, 'root'> = {
  discovery: 'discovery',
  cache: 'cache/discovery.sqlite',
}

function readConfig(root: string): DiscoveryPaths {
  const source = readFileSync(join(root, CONFIG_FILENAME), 'utf-8')
  const parsed = ConfigInput.parse(JSON.parse(source))
  return {
    root: resolve(root),
    discovery: resolve(root, parsed.discovery ?? DEFAULT_CONFIG.discovery),
    cache: resolve(root, parsed.cache ?? DEFAULT_CONFIG.cache),
  }
}
