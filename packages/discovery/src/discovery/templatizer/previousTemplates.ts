/**
 * What the committed `discovered.json` says about each address's template,
 * for the fit check of a contract whose code changed.
 *
 * A project discovered for the first time has no `discovered.json` and no
 * history; a missing file is the one reading failure taken as "no history".
 * A file that is there but cannot be read or parsed is an error to surface:
 * taken as no history, every changed contract would get a template of its
 * own instead of its old one being checked and extended.
 */
import type { ConfigReader } from '../config/ConfigReader'
import type { EntryParameters } from '../output/types'
import type { PreviousTemplate } from './existingTemplate'

export function readPreviousTemplates(
  configReader: ConfigReader,
  project: string,
): Record<string, PreviousTemplate> {
  let entries: EntryParameters[]
  try {
    entries = configReader.readDiscovery(project).entries
  } catch (error) {
    if (isMissingFile(error)) {
      return {}
    }
    throw error
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

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

/**
 * `implementationNames` holds the contract's own name under its address
 * and each implementation's under the implementation's address. The shape
 * is taken from the implementations when there are any, as
 * `getSourcesToBeMatched` takes it; `name` is not used, because a project's
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
