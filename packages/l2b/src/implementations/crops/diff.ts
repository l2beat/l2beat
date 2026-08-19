import type { CropAttestation } from '@l2beat/config/build/crops/attestations'
import type { Hex } from 'viem'
import type { OnchainAttestation } from './easClient'
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
  /** The uid to revoke first, for `changed` and `orphaned`. */
  revoke: Hex | undefined
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
        onchain.uid,
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
          ? (onchain.uid as Hex)
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
  revoke: Hex | undefined,
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
