import { assert, type json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { ConfigReader } from '../discovery/config/ConfigReader'
import type { DiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { readJsonc } from '../discovery/utils/readJsonc'
import type { WatchTemplate } from './WatchTemplate'

export const WATCH_CONFIG_FILE = 'watch.jsonc'
export const WATCHED_FILE = 'watched.json'

export interface WatchLocation {
  name: string
  kind: 'project' | 'global'
  path: string
}

export interface WatchDefinition {
  key: string
  template: WatchTemplate
  params: unknown
}

export interface WatchConfig {
  name: string
  watches: WatchDefinition[]
}

export interface Watched {
  timestamp: number
  values: Record<string, json>
}

const WatchConfigFile = v.strictObject({
  watches: v.record(
    v.string(),
    v.strictObject({ template: v.string(), params: v.unknown() }),
  ),
})

const WatchedFile = v.strictObject({
  timestamp: v.number(),
  values: v.record(v.string(), v.unknown()),
})

export class WatchReader {
  private readonly locations: Map<string, WatchLocation>

  constructor(
    paths: Pick<DiscoveryPaths, 'discovery' | 'watches'>,
    private readonly templates: Record<string, WatchTemplate>,
  ) {
    const configReader = new ConfigReader(paths.discovery)
    const projectPaths = configReader.enumerateProjectDirectories()
    const projectNames = new Set(projectPaths.map((p) => path.basename(p)))
    this.locations = new Map()
    for (const location of findProjectWatches(configReader, projectPaths)) {
      this.locations.set(location.name, location)
    }
    for (const location of findGlobalWatches(paths.watches)) {
      assert(
        !projectNames.has(location.name),
        'Global watch named like a project',
        { name: location.name },
      )
      this.locations.set(location.name, location)
    }
  }

  readAllWatches(): WatchLocation[] {
    return [...this.locations.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }

  findWatch(name: string): WatchLocation | undefined {
    return this.locations.get(name)
  }

  getWatchPath(name: string): string {
    const location = this.locations.get(name)
    assert(location !== undefined, 'Watch not found', { name })
    return location.path
  }

  readWatchConfig(name: string): WatchConfig {
    const file = path.join(this.getWatchPath(name), WATCH_CONFIG_FILE)
    const parsed = WatchConfigFile.safeValidate(readJsonc(file))
    if (!parsed.success) {
      throw new Error('Invalid watch.jsonc', {
        cause: { name, message: parsed.message },
      })
    }
    const keys = Object.keys(parsed.data.watches).sort()
    const watches = keys.map((key) => {
      const entry = parsed.data.watches[key]
      assert(entry !== undefined)
      return this.parseWatchDefinition(name, key, entry)
    })
    return { name, watches }
  }

  readWatched(name: string): Watched | undefined {
    return readWatchedFile(path.join(this.getWatchPath(name), WATCHED_FILE))
  }

  private parseWatchDefinition(
    name: string,
    key: string,
    entry: { template: string; params?: unknown },
  ): WatchDefinition {
    assert(key.length > 0, 'Empty watch key', { name })
    assert(!key.includes('\n'), 'Watch key with a newline', { name, key })
    const template = this.templates[entry.template]
    if (template === undefined) {
      throw new Error('Unknown watch template', {
        cause: { name, key, template: entry.template },
      })
    }
    assert(template.name === entry.template, 'Template registered by name')
    const params = template.params.safeValidate(entry.params)
    if (!params.success) {
      throw new Error('Invalid watch params', {
        cause: { name, key, message: params.message },
      })
    }
    return { key, template, params: params.data }
  }
}

export function readWatchedFile(file: string): Watched | undefined {
  if (!existsSync(file)) {
    return undefined
  }
  return parseWatched(readFileSync(file, 'utf-8'))
}

export function parseWatched(text: string): Watched {
  const parsed = WatchedFile.safeValidate(JSON.parse(text))
  if (!parsed.success) {
    throw new Error('Invalid watched.json', {
      cause: { message: parsed.message },
    })
  }
  return {
    timestamp: parsed.data.timestamp,
    values: parsed.data.values as Record<string, json>,
  }
}

function findProjectWatches(
  configReader: ConfigReader,
  projectPaths: string[],
): WatchLocation[] {
  const locations: WatchLocation[] = []
  for (const projectPath of projectPaths) {
    if (!existsSync(path.join(projectPath, WATCH_CONFIG_FILE))) {
      continue
    }
    const name = path.basename(projectPath)
    // A watch-only project (NEAR, Starknet, Aztec) has no config.jsonc. One
    // with a config is skipped when archived, like the update monitor does.
    if (
      configReader.projectConfigExists(name) &&
      configReader.readConfig(name).archived
    ) {
      continue
    }
    locations.push({ name, kind: 'project', path: projectPath })
  }
  return locations
}

function findGlobalWatches(watchesPath: string): WatchLocation[] {
  if (!existsSync(watchesPath)) {
    return []
  }
  const locations: WatchLocation[] = []
  for (const entry of readdirSync(watchesPath, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) {
      continue
    }
    const watchPath = path.join(watchesPath, entry.name)
    assert(
      existsSync(path.join(watchPath, WATCH_CONFIG_FILE)),
      'Global watch without watch.jsonc',
      { name: entry.name },
    )
    locations.push({ name: entry.name, kind: 'global', path: watchPath })
  }
  return locations
}
