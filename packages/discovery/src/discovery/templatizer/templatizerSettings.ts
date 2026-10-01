/**
 * Turns `--ai` and friends into the settings the engine builds a
 * templatizer from. Only `runDiscovery` calls this, so only a local CLI run
 * can ever author: the backend builds its engine without settings.
 */
import path from 'path'
import type { DiscoveryModuleConfig } from '../../config/types'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import { createModelClient, describeModel } from './model/createModelClient'
import type { TemplatizerSettings } from './Templatizer'

export function getTemplatizerSettings(
  config: DiscoveryModuleConfig,
  paths: DiscoveryPaths,
  configReader: ConfigReader,
): TemplatizerSettings | undefined {
  if (config.ai !== true) {
    return undefined
  }
  return {
    project: config.project,
    model: createModelClient(config.aiModel),
    modelLabel: describeModel(config.aiModel),
    maxRounds: config.aiRounds,
    // Next to the sqlite cache, which is gitignored for the same reason:
    // the trail is evidence for a reviewer, not part of the repo.
    artifactsRoot: path.join(path.dirname(paths.cache), 'templatizer'),
    previousTemplates: readPreviousTemplates(configReader, config.project),
  }
}

/** A project discovered for the first time has no discovered.json and no history. */
function readPreviousTemplates(
  configReader: ConfigReader,
  project: string,
): Record<string, string> {
  let entries
  try {
    entries = configReader.readDiscovery(project).entries
  } catch {
    return {}
  }
  const previous: Record<string, string> = {}
  for (const entry of entries) {
    if (entry.template !== undefined) {
      previous[entry.address.toString()] = entry.template
    }
  }
  return previous
}
