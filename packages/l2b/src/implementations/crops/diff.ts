import type { CropAttestation } from '@l2beat/config/build/crops/attestations'
import { ATTESTATION_SCHEMA_UID } from '@l2beat/config/build/crops/eas'
import type { OnchainAttestation, Revocation } from './easClient'
import {
  type CropPayload,
  type CropSubject,
  decodePayload,
  payloadMatches,
  toPayload,
} from './payload'

export type CropDiffKind = 'new' | 'changed' | 'unchanged' | 'orphaned'

export interface CropDiffEntry {
  kind: CropDiffKind
  projectId: string
  /** Absent for orphans - the project no longer declares crops. */
  subject: CropSubject | undefined
  /** What the committed ledger claims, if anything. */
  ledger: CropAttestation | undefined
  /** What the chain actually holds for the ledger's uid, if anything. */
  onchain: OnchainAttestation | undefined
  /** The payload to attest, for `new` and `changed`. */
  payload: CropPayload | undefined
  /** What to revoke first, for `changed` and `orphaned`. */
  revoke: Revocation | undefined
  reason: string
}

export interface DiffInput {
  subjects: CropSubject[]
  ledger: CropAttestation[]
  /** Onchain state for every uid in the ledger, by uid. */
  onchain: Map<string, OnchainAttestation>
  /** Timestamp stamped on new and changed attestations. */
  now: number
}

export function diffAttestations(input: DiffInput): CropDiffEntry[] {
  const entries: CropDiffEntry[] = []
  const seen = new Set<string>()

  for (const subject of input.subjects) {
    seen.add(subject.projectId)
    const ledger = input.ledger.find((x) => x.projectId === subject.projectId)
    const onchain = ledger ? input.onchain.get(ledger.uid) : undefined

    if (!ledger) {
      entries.push(
        entry(
          subject,
          undefined,
          undefined,
          'new',
          1,
          input.now,
          undefined,
          'not attested yet',
        ),
      )
      continue
    }

    // The ledger names a uid the chain does not have live any more - someone
    // revoked it out of band, or the ledger was committed without the tx
    // landing. Either way the fix is a fresh attestation.
    if (!onchain || onchain.revocationTime !== 0) {
      entries.push(
        entry(
          subject,
          ledger,
          onchain,
          'new',
          ledger.revision + 1,
          input.now,
          undefined,
          onchain
            ? 'ledger uid is revoked onchain'
            : 'ledger uid is missing onchain',
        ),
      )
      continue
    }

    // A schema change makes the old payload unreadable under the new params,
    // so it is replaced without being decoded. The revocation names the schema
    // it was attested under, which is the only schema EAS will accept for it.
    if (onchain.schema.toLowerCase() !== ATTESTATION_SCHEMA_UID.toLowerCase()) {
      entries.push(
        entry(
          subject,
          ledger,
          onchain,
          'changed',
          ledger.revision + 1,
          input.now,
          { uid: onchain.uid, schema: onchain.schema },
          'attested under a superseded schema',
        ),
      )
      continue
    }

    const current = decodePayload(onchain.data)
    const wanted = toPayload(subject, current.reviewedAt, ledger.revision)
    if (payloadMatches(current, wanted)) {
      entries.push(
        entry(
          subject,
          ledger,
          onchain,
          'unchanged',
          ledger.revision,
          current.reviewedAt,
          undefined,
          'matches config',
        ),
      )
      continue
    }

    entries.push(
      entry(
        subject,
        ledger,
        onchain,
        'changed',
        ledger.revision + 1,
        input.now,
        { uid: onchain.uid, schema: onchain.schema },
        'evaluation differs from config',
      ),
    )
  }

  for (const ledger of input.ledger) {
    if (seen.has(ledger.projectId)) {
      continue
    }
    const onchain = input.onchain.get(ledger.uid)
    entries.push({
      kind: 'orphaned',
      projectId: ledger.projectId,
      subject: undefined,
      ledger,
      onchain,
      payload: undefined,
      revoke:
        onchain && onchain.revocationTime === 0
          ? { uid: onchain.uid, schema: onchain.schema }
          : undefined,
      reason: 'project no longer declares crops',
    })
  }

  return entries.sort((a, b) => a.projectId.localeCompare(b.projectId))
}

function entry(
  subject: CropSubject,
  ledger: CropAttestation | undefined,
  onchain: OnchainAttestation | undefined,
  kind: CropDiffKind,
  revision: number,
  reviewedAt: number,
  revoke: Revocation | undefined,
  reason: string,
): CropDiffEntry {
  return {
    kind,
    projectId: subject.projectId,
    subject,
    ledger,
    onchain,
    payload:
      kind === 'unchanged'
        ? undefined
        : toPayload(subject, reviewedAt, revision),
    revoke,
    reason,
  }
}
