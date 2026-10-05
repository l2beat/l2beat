/**
 * Turns `--ai` and friends into the settings the engine builds a
 * templatizer from. Only `runDiscovery` calls this, so only a local CLI run
 * can ever author: the backend builds its engine without settings.
 */
import path from 'path'
import type { DiscoveryModuleConfig } from '../../config/types'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import type { EntryParameters } from '../output/types'
import type { PreviousTemplate } from './existingTemplate'
import { chooseModel } from './model/createModelClient'
import type { TemplatizerSettings } from './Templatizer'

/** Throws before discovery starts when the model or its effort cannot run. */
export async function getTemplatizerSettings(
  config: DiscoveryModuleConfig,
  paths: DiscoveryPaths,
  configReader: ConfigReader,
): Promise<TemplatizerSettings | undefined> {
  if (config.ai !== true && config.aiRevisit !== true) {
    return undefined
  }
  const chosen = await chooseModel({
    model: config.aiModel,
    effort: config.aiEffort,
  })
  return {
    project: config.project,
    model: chosen.client,
    modelLabel: chosen.label,
    effort: chosen.effort,
    maxRounds: config.aiRounds,
    // Next to the sqlite cache, which is gitignored for the same reason:
    // the trail is evidence for a reviewer, not part of the repo.
    artifactsRoot: path.join(path.dirname(paths.cache), 'templatizer'),
    previousTemplates: readPreviousTemplates(configReader, config.project),
    revisit: config.aiRevisit === true,
  }
}

/** A project discovered for the first time has no discovered.json and no history. */
function readPreviousTemplates(
  configReader: ConfigReader,
  project: string,
): Record<string, PreviousTemplate> {
  let entries
  try {
    entries = configReader.readDiscovery(project).entries
  } catch {
    return {}
  }
  const previous: Record<string, PreviousTemplate> = {}
  for (const entry of entries) {
    if (entry.template !== undefined) {
      previous[entry.address.toString()] = {
        templateId: entry.template,
        names: shapeNamesOf(entry),
        failingFields: Object.keys(entry.errors ?? {}),
      }
    }
  }
  return previous
}

/**
 * `implementationNames` holds the contract's own name under its address
 * and each implementation's under the implementation's address. The shape
 * is taken from the implementations when there are any, as
 * `matchedBundles` takes it; `name` is not used, because a project's
 * config may replace it with a display name.
 */
function shapeNamesOf(entry: EntryParameters): string[] | undefined {
  const names = entry.implementationNames
  if (names === undefined) {
    return undefined
  }
  const own = entry.address.toString()
  const implementations = Object.entries(names)
    .filter(([address]) => address !== own)
    .map(([, name]) => name)
  return implementations.length > 0 ? implementations : Object.values(names)
}
