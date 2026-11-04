import { ProjectService } from '@l2beat/config'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

// The dashboard leaves zk verifiers out: zk program audits are not tracked
// yet, so a verifier's Solidity is never in any report's scope and would only
// count as unaudited code.

/** Every verifier deployment the zk catalog knows. Needs packages/config built. */
export async function getVerifierAddresses(): Promise<
  Set<ChainSpecificAddress>
> {
  const projects = await new ProjectService().getProjects({
    select: ['zkCatalogInfo'],
  })
  const addresses = new Set<ChainSpecificAddress>()
  for (const project of projects) {
    for (const hash of project.zkCatalogInfo.verifierHashes) {
      for (const deployment of hash.knownDeployments) {
        addresses.add(deployment.address)
      }
    }
  }
  return addresses
}

/**
 * A verifier contract is a zk catalog deployment that is not a proxy. The
 * catalog lists the address that takes proofs; when that is a proxy, the
 * verifier is inherited into an upgradeable protocol contract (Railgun's
 * smart wallet) whose other code the dashboard should keep showing.
 */
export function isVerifierContract(
  address: ChainSpecificAddress,
  implementations: ChainSpecificAddress[],
  verifiers: Set<ChainSpecificAddress>,
): boolean {
  return implementations.length === 0 && verifiers.has(address)
}
