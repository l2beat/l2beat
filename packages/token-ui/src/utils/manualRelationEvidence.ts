export interface ManualRelationEvidenceView {
  user: string | undefined
  comment: string | undefined
  bridge:
    | {
        name: string | undefined
        chain: string | undefined
        address: string | undefined
      }
    | undefined
}

/**
 * Lenient reader for the `{ kind: 'manual', ... }` evidence stored on a
 * manually added relation, telling it apart from sample-transfer evidence by
 * the `kind` discriminator. Display-only: tolerates missing or malformed
 * fields instead of throwing, since the raw JSON is always shown alongside.
 */
export function readManualRelationEvidence(
  transfer: unknown,
): ManualRelationEvidenceView | undefined {
  if (!isRecord(transfer) || transfer.kind !== 'manual') {
    return undefined
  }
  const bridge = isRecord(transfer.bridge) ? transfer.bridge : undefined
  return {
    user: asString(transfer.user),
    comment: asString(transfer.comment),
    bridge: bridge && {
      name: asString(bridge.name),
      chain: asString(bridge.chain),
      address: asString(bridge.address),
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}
