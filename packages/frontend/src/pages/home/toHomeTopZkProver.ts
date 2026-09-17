import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'

// The home card shows only risk dots and verifier counts, so the per-project
// "used in" lists, tech stack and filters of the full catalog entry stay out.
export type HomeTopZkProver = Omit<
  ZkCatalogEntry,
  'techStack' | 'filterable' | 'trustedSetupsByProofSystem'
> & {
  trustedSetupsByProofSystem: Record<
    string,
    Pick<TrustedSetupsByProofSystem[string], 'trustedSetups' | 'verifiers'>
  >
}

export function toHomeTopZkProver({
  techStack: _techStack,
  filterable: _filterable,
  trustedSetupsByProofSystem,
  ...entry
}: ZkCatalogEntry): HomeTopZkProver {
  return {
    ...entry,
    trustedSetupsByProofSystem: Object.fromEntries(
      Object.entries(trustedSetupsByProofSystem).map(
        ([key, { trustedSetups, verifiers }]) => [
          key,
          { trustedSetups, verifiers },
        ],
      ),
    ),
  }
}
