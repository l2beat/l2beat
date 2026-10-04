/**
 * The `ignoreMethods` of an authored template.
 *
 * V1 probes every view with a single `uint256` argument at indices 0–4.
 * Once the model has ruled on such a getter, the probe is noise: a getter
 * skipped as not worth reading (`unbounded`, `user-activity`, `not-state`,
 * `computation`), or a getter covered by a field of another name, which
 * reads it in full, so five probed entries would repeat part of it. A
 * getter skipped as `covered` keeps its probe: that skip is a claim that
 * some other value holds the state, and when the claim is wrong the probe
 * is the only copy of the data (the first quick-suite run lost
 * AgglayerGateway's `aggchainSigners` that way). Other skips need nothing in
 * the file, because V1 does not read functions with other arguments unless
 * told to.
 *
 * Only items V1 actually probes for this address are candidates (the
 * worklist's `probed` flag comes from V1's handler list), so a name that a
 * 0-argument getter also has is never written: V1 keeps the getter and
 * drops the probe of that name itself. A draft field named like the probe
 * needs nothing either, since a template field replaces the system handler
 * of its name. Only a new template gets this list; an existing template's
 * `ignoreMethods` is never changed.
 */
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import type { Draft } from '../draft/Draft'
import type { Worklist, WorklistItem } from '../worklist'

export function deriveIgnoreMethods(
  worklist: Worklist,
  draft: Draft,
): string[] {
  const ruledOn = ruledOnSignatures(draft)
  const fieldNames = new Set(Object.keys(draft.fields))
  const names = worklist.items
    .filter((item) => item.probed && ruledOn.has(item.signature))
    .filter((item) => !fieldNames.has(probeFieldName(item)))
    .map((item) => item.name)
  return [...new Set(names)].sort()
}

/**
 * Covered by any field counts: a field of the probe's own name is filtered
 * out by name afterwards, which leaves exactly the fields of another name.
 */
function ruledOnSignatures(draft: Draft): Set<string> {
  return new Set([
    ...draft.skips
      .filter((skip) => skip.reason !== 'covered')
      .map((skip) => skip.item),
    ...Object.values(draft.fields).flatMap((field) => field.covers),
  ])
}

/** The field name V1 gives the probe's values. */
function probeFieldName(item: WorklistItem): string {
  return rewriteSolidityIdentifier(item.name)
}
