import type {
  AttestationNetwork,
  AttestationNetworkConfig,
  CropAttestations,
} from '@l2beat/config'
import { ProjectService } from '@l2beat/config'

/** From the config build, like the project set - run `pnpm build:dependencies` first. */
export function loadCropAttestations(
  ps = new ProjectService(),
): Promise<CropAttestations> {
  return ps.getCropAttestations()
}

/** `--network` when given, otherwise the network config reads. */
export function pickNetwork(
  attestations: CropAttestations,
  name: string | undefined,
): AttestationNetworkConfig {
  const network =
    attestations.networks[(name ?? attestations.network) as AttestationNetwork]
  if (!network) {
    throw new Error(
      `Unknown attestation network: ${name}. Known: ${Object.keys(attestations.networks).join(', ')}`,
    )
  }
  return network
}
