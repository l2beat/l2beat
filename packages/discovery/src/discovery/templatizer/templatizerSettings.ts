/**
 * Turns `--ai` and friends into the settings `runDiscovery` builds a
 * templatizer from. Only `runDiscovery` calls this, so only a local CLI run
 * can ever author: the backend never builds a templatizer.
 */
import path from 'path'
import type { DiscoveryModuleConfig } from '../../config/types'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import { chooseModel } from './model/createModelClient'
import { readPreviousTemplates } from './previousTemplates'
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
