import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'

import type { ProjectPermission } from '../../types'
import { delayDescriptionFromSeconds } from '../../utils/delayDescription'
import { ProjectDiscovery } from '../ProjectDiscovery'
import { getProxyGovernance } from './getProxyGovernance'

// NOTE(radomski): The way SHARPVerifier works after the upgrade is the
// following: Everything goes through SHARPVerifierCallProxy which calls CallProxy
// as a fallback. CallProxy then calls the new SHARPVerifier that still
// references the old SHARPVerifier. When verifying a proof the new
// SHARPVerifier checks if a fact is valid. Since the old fact registry has
// proved many facts it still wants to use them. If first checks its own fact
// registry, in case of failure it checks the old fact registry. Stuff like
// FrilessVerifiers and CairoBootloaderPrograms are separate and new ones where
// deployed for the new SHARPVerifier.
//
//                                ┌─────────────────────┐
//                                │                     │          ┌─────────────┐
//                                │ SHARPVerifierProxy  │─────────▶│  CallProxy  │────────────┐
//                                │                     │          └─────────────┘            │
//                                └─────────────────────┘                                     │
// ┌─────────────────────────────────────────────────────────┬────────────────────┐           │
// │  ┌───────────────────┐                                  │ Old Verifier code  │           │                 ┌─────────────────┐
// │  │Old FrilessVerifier│◀─┐                               └────────────────────┤           ▼              ┌─▶│ FrilessVerifier │
// │  └───────────────────┘  │    ┌─────────────────────┐                         │ ┌───────────────────┐    │  └─────────────────┘
// │  ┌───────────────────┐  │    │                     │                         │ │                   │    │  ┌─────────────────┐
// │  │Old FrilessVerifier│◀─┼────│  Old SHARPVerifier  │◀──referenceFactRegistry─┼─│   SHARPVerifier   │────┼─▶│ FrilessVerifier │
// │  └───────────────────┘  │    │                     │                         │ │                   │    │  └─────────────────┘
// │  ┌───────────────────┐  │    └─────────────────────┘                         │ └───────────────────┘    │  ┌─────────────────┐
// │  │Old FrilessVerifier│◀─┘               │                                    │           │              └─▶│ FrilessVerifier │
// │  └───────────────────┘                  │                                    │           │                 └─────────────────┘
// │                                         ▼                                    │           ▼
// │                              ┌─────────────────────┐                         │ ┌───────────────────┐
// │                              │  Old FactRegistry   │                         │ │   FactRegistry    │
// │                              └─────────────────────┘                         │ └───────────────────┘
// └──────────────────────────────────────────────────────────────────────────────┘
//

const discovery = new ProjectDiscovery('shared-sharp-verifier')

const SHARP_VERIFIER_PROXY = discovery.getContractDetails(
  'SHARPVerifierCallProxy',
  'CallProxy for GpsStatementVerifier.',
)

const SHARP_VERIFIER = discovery.getContractDetails(
  'SHARPVerifier',
  'Starkware SHARP verifier used collectively by Starknet, Sorare, ImmutableX, Apex, Myria, rhino.fi and Canvas Connect. It receives STARK proofs from the Prover attesting to the integrity of the Execution Trace of these Programs including correctly computed state root which is part of the Program Output.',
)

const CAIRO_BOOTLOADER_PROGRAM = discovery.getContractDetails(
  'CairoBootloaderProgram',
  'Part of STARK Verifier.',
)

const MEMORY_FACT_REGISTRY = discovery.getContractDetails(
  'MemoryPageFactRegistry',
  'MemoryPageFactRegistry is one of the many contracts used by SHARP verifier. This one is important as it registers all necessary onchain data.',
)

const FRI_STATEMENT_CONTRACT = discovery.getContractDetails(
  'FriStatementContract',
  'Part of STARK Verifier.',
)

const MERKLE_STATEMENT_CONTRACT = discovery.getContractDetails(
  'MerkleStatementContract',
  'Part of STARK Verifier.',
)

const upgradeDelay = discovery.getContractValue<number>(
  'SHARPVerifierCallProxy',
  'StarkWareProxy_upgradeDelay',
)

const SHARP_VERIFIER_CONTRACTS = [
  SHARP_VERIFIER_PROXY,
  SHARP_VERIFIER,
  FRI_STATEMENT_CONTRACT,
  MERKLE_STATEMENT_CONTRACT,
  CAIRO_BOOTLOADER_PROGRAM,
  MEMORY_FACT_REGISTRY,
]

export function getSHARPVerifierContracts(
  projectDiscovery: ProjectDiscovery,
  verifierAddress: ChainSpecificAddress,
) {
  assert(
    verifierAddress === SHARP_VERIFIER_PROXY.address,
    `SHARPVerifierCallProxy address mismatch. This project probably uses a different SHARP verifier (${projectDiscovery.projectName})`,
  )

  return SHARP_VERIFIER_CONTRACTS
}

export function getSHARPVerifierGovernors(
  projectDiscovery: ProjectDiscovery,
  verifierAddress: ChainSpecificAddress,
): ProjectPermission[] {
  assert(
    verifierAddress === SHARP_VERIFIER_PROXY.address &&
      getProxyGovernance(discovery, 'SHARPVerifierCallProxy')[0].address ===
        discovery.getContract('SHARP Multisig').address &&
      getProxyGovernance(discovery, 'SHARPVerifierCallProxy').length === 1,
    `SHARPVerifierCallProxy or governance address mismatch. This project probably uses a different SHARP verifier or the admin has changed (${projectDiscovery.projectName})`,
  )

  return [
    projectDiscovery.getPermissionDetails(
      'SHARP Verifier Governors',
      getProxyGovernance(discovery, 'SHARPVerifierCallProxy'),
      'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. ' +
        delayDescriptionFromSeconds(upgradeDelay),
    ),
    discovery.getMultisigPermission(
      'SHARP Multisig',
      'SHARP Verifier Governor.',
    ),
  ]
}

export function getSHARPVerifierUpgradeDelay() {
  return upgradeDelay
}
