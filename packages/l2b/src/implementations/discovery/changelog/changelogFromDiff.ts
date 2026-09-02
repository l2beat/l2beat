import type { DiscoveryDiff, FieldDiff } from '@l2beat/discovery'
import type {
  DiscoveryChangelogContract,
  DiscoveryChangelogEntry,
  DiscoveryChangelogField,
} from '@l2beat/shared'

/** The structured counterpart of the "Watched changes" section that
 *  discoveryDiffToMarkdown renders from the same diff. Same values (the diff
 *  already carries them JSON-serialized), same status, plus the severity in
 *  force at run time. Returns undefined when there is nothing to record. */
export function changelogEntryFromDiff(
  id: string,
  timestamp: number,
  diffs: DiscoveryDiff[],
): DiscoveryChangelogEntry | undefined {
  if (diffs.length === 0) return undefined
  return { id, timestamp, changes: diffs.map(toChangelogContract) }
}

function toChangelogContract(diff: DiscoveryDiff): DiscoveryChangelogContract {
  const fields = (diff.diff ?? []).map(toChangelogField)
  return {
    address: diff.address.toString().toLowerCase(),
    ...(diff.type ? { status: diff.type } : {}),
    ...(fields.length > 0 ? { fields } : {}),
  }
}

function toChangelogField(field: FieldDiff): DiscoveryChangelogField {
  return {
    key: field.key,
    ...(field.before !== undefined ? { removed: [field.before] } : {}),
    ...(field.after !== undefined ? { added: [field.after] } : {}),
    ...(field.severity !== undefined ? { severity: field.severity } : {}),
  }
}
