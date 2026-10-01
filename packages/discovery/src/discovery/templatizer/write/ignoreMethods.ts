/**
 * The `ignoreMethods` of an authored template.
 *
 * V1 probes every view with a single `uint256` argument at indices 0–4.
 * Once the model has ruled on such a getter, the probe is noise: a skipped
 * getter was judged not worth reading, and a getter covered by a field of
 * another name is already read in full by that field, so five probed
 * entries would repeat part of it. Other skips need nothing in the file,
 * because V1 does not read functions with other arguments unless told to.
 *
 * `ignoreMethods` matches by bare name and suppresses 0-argument getters
 * too, so a name that also has one is left alone: ignoring it would drop
 * that getter's value, and the getter owns the field name anyway. A draft
 * field named like the probe needs nothing either, since a template field
 * replaces the system handler of its name.
 */
import { rewriteSolidityIdentifier } from '../../handlers/utils/rewriteSolidityIdentifier'
import { AbiIndex } from '../abi/AbiIndex'
import type { Draft } from '../draft/Draft'
import type { Worklist, WorklistItem } from '../worklist'

export function deriveIgnoreMethods(
  worklist: Worklist,
  draft: Draft,
  abi: string[],
): string[] {
  const ruledOn = ruledOnSignatures(draft)
  const getterNames = zeroArgumentGetterNames(abi)
  const fieldNames = new Set(Object.keys(draft.fields))
  const names = worklist.items
    .filter((item) => item.probed && ruledOn.has(item.signature))
    .filter(
      (item) =>
        !getterNames.has(item.name) && !fieldNames.has(probeFieldName(item)),
    )
    .map((item) => item.name)
  return [...new Set(names)].sort()
}

/**
 * Covered by any field counts: a field of the probe's own name is filtered
 * out by name afterwards, which leaves exactly the fields of another name.
 */
function ruledOnSignatures(draft: Draft): Set<string> {
  return new Set([
    ...draft.skips.map((skip) => skip.item),
    ...Object.values(draft.fields).flatMap((field) => field.covers),
  ])
}

/** The functions `getSystemHandlers` reads as plain getters. */
function zeroArgumentGetterNames(abi: string[]): Set<string> {
  return new Set(
    AbiIndex.from(abi)
      .functions.filter(
        (fragment) =>
          fragment.constant &&
          fragment.inputs.length === 0 &&
          (fragment.outputs?.length ?? 0) > 0,
      )
      .map((fragment) => fragment.name),
  )
}

/** The field name V1 gives the probe's values. */
function probeFieldName(item: WorklistItem): string {
  return rewriteSolidityIdentifier(item.name)
}
