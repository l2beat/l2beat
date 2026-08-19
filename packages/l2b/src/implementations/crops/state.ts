import type { CropAttestation } from '@l2beat/config/build/crops/attestations'
import type { AttestationNetworkConfig } from '@l2beat/config/build/crops/eas'
import type { Address, Hex, PublicClient } from 'viem'
import {
  getAttestation,
  type OnchainAttestation,
  scanAttestedUids,
} from './easClient'

/**
 * Onchain state keyed by uid. The cheap path reads back only the uids the
 * committed ledger knows about; `--scan` walks the attester's Attested logs so
 * attestations made outside the ledger are found too.
 */
export async function loadOnchainState(
  reader: PublicClient,
  network: AttestationNetworkConfig,
  ledger: CropAttestation[],
  options: { scan: boolean; attester?: Address; fromBlock?: number },
): Promise<Map<string, OnchainAttestation>> {
  const uids = new Set<Hex>(ledger.map((x) => x.uid as Hex))

  if (options.scan) {
    if (!options.attester) {
      throw new Error(
        '--scan needs an attester address: either the committed ledger records one, or set L2B_CROPS_PRIVATE_KEY so it can be derived.',
      )
    }
    const scanned = await scanAttestedUids(
      reader,
      network,
      options.attester,
      BigInt(options.fromBlock ?? 0),
    )
    for (const uid of scanned) {
      uids.add(uid)
    }
  }

  const state = new Map<string, OnchainAttestation>()
  for (const uid of uids) {
    const attestation = await getAttestation(reader, network, uid)
    if (attestation) {
      state.set(uid, attestation)
    }
  }
  return state
}
