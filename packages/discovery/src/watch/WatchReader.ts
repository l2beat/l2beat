import { assert, type json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { ConfigReader } from '../discovery/config/ConfigReader'
import type { DiscoveryPaths } from '../discovery/config/getDiscoveryPaths'
import { readJsonc } from '../discovery/utils/readJsonc'
import type { WatchTemplate } from './WatchTemplate'

export const WATCH_CONFIG_FILE = 'watch.jsonc'
export const WATCHED_FILE = 'watched.json'

export interface WatchLocation {
  name: string
  kind: 'project'
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
    paths: Pick<DiscoveryPaths, 'discovery'>,
    private readonly templates: Record<string, WatchTemplate>,
  ) {
    this.locations = new Map()
    for (const location of findProjectWatches(paths.discovery)) {
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
  const parsed = WatchedFile.safeValidate(
    JSON.parse(readFileSync(file, 'utf-8')),
  )
  if (!parsed.success) {
    throw new Error('Invalid watched.json', {
      cause: { file, message: parsed.message },
    })
  }
  return {
    timestamp: parsed.data.timestamp,
    values: parsed.data.values as Record<string, json>,
  }
}

function findProjectWatches(projectsPath: string): WatchLocation[] {
  const configReader = new ConfigReader(projectsPath)
  const locations: WatchLocation[] = []
  for (const projectPath of configReader.enumerateProjectDirectories()) {
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
