import type { CropAttestation } from '@l2beat/config'
import type { Address, Hex, PublicClient } from 'viem'
import {
  type EasTarget,
  getAttestation,
  type OnchainAttestation,
  scanAttestedUids,
} from './easClient'

/** By uid. `--scan` also walks the attester's logs for uids the ledger does not know. */
export async function loadOnchainState(
  reader: PublicClient,
  target: EasTarget,
  ledger: CropAttestation[],
  options: { scan: boolean; attester?: Address; fromBlock?: number },
): Promise<Map<string, OnchainAttestation>> {
  const uids = new Set<Hex>(ledger.map((x) => x.uid))

  if (options.scan) {
    if (!options.attester) {
      throw new Error(
        '--scan needs an attester address: either the committed ledger records one, or set L2B_CROPS_PRIVATE_KEY so it can be derived.',
      )
    }
    const scanned = await scanAttestedUids(
      reader,
      target,
      options.attester,
      BigInt(options.fromBlock ?? 0),
    )
    for (const uid of scanned) {
      uids.add(uid)
    }
  }

  const state = new Map<string, OnchainAttestation>()
  for (const uid of uids) {
    const attestation = await getAttestation(reader, target, uid)
    if (attestation) {
      state.set(uid, attestation)
    }
  }
  return state
}
