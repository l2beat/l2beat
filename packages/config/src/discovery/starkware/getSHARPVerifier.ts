import { assert, EthereumAddress } from '@l2beat/shared'

import { isSingleAddress } from '../../common'
import { ProjectDiscovery } from '../ProjectDiscovery'
import { getProxyGovernance } from './getProxyGovernance'

const discovery = new ProjectDiscovery('l2beat-starkware')

const CALL_PROXY = discovery.getMainContractDetails(
  'SHARPVerifierProxy',
  'CallProxy for GpsStatementVerifier.',
)

const SHARP_VERIFIER = discovery.getMainContractDetails(
  'SHARPVerifier',
  'Starkware SHARP verifier used collectively by StarkNet, Sorare, Immutable X, Apex, Myria and rhino.fi. It receives STARK proofs from the Prover attesting to the integrity of the Execution Trace of these Programs including correctly computed L2 state root which is part of the Program Output.',
)

// VALIDIUM VS ROLLUP? - maybe it's only starknet, not sure
const MEMORY_FACT_REGISTRY = discovery.getMainContractDetails(
  'MemoryPageFactRegistry',
  'MemoryPageFactRegistry is one of the many contracts used by SHARP verifier. This one is important as it registers all necessary on-chain data such as StarkNet contracts state diffs.',
)

const CAIRO_BOOTLOADER_PROGRAM = discovery.getMainContractDetails(
  'CairoBootloaderProgram',
  'Part of STARK Verifier.',
)

const FRI_STATEMENT_CONTRACT = discovery.getMainContractDetails(
  'FriStatementContract',
  'Part of STARK Verifier.',
)

const MERKLE_STATEMENT_CONTRACT = discovery.getMainContractDetails(
  'MerkleStatementContract',
  'Part of STARK Verifier.',
)

const STARKWARE_VERIFIER_CONTRACTS = [
  CALL_PROXY,
  SHARP_VERIFIER,
  FRI_STATEMENT_CONTRACT,
  MERKLE_STATEMENT_CONTRACT,
  MEMORY_FACT_REGISTRY,
  CAIRO_BOOTLOADER_PROGRAM,
]

export function getSHARPVerifier(verifierAddress: EthereumAddress) {
  assert(isSingleAddress(CALL_PROXY), 'CallProxy is not a single address.')
  assert(
    verifierAddress === CALL_PROXY.address,
    'CallProxy address mismatch. This project probably uses a different SHARP verifier. Project: ' +
      discovery.projectName,
  )

  return STARKWARE_VERIFIER_CONTRACTS
}

export function getSHARPVerifierGovernors(verifierAddress: EthereumAddress) {
  assert(isSingleAddress(CALL_PROXY), 'CallProxy is not a single address.')
  assert(
    verifierAddress === CALL_PROXY.address,
    'CallProxy address mismatch. This project probably uses a different SHARP verifier. Project: ' +
      discovery.projectName,
  )

  return {
    name: 'SHARP Verifier Governors',
    accounts: getProxyGovernance(discovery, 'SHARPVerifierProxy'),
    description:
      'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. ' +
      discovery.getDelayStringFromUpgradeability(
        'SHARPVerifierProxy',
        'upgradeDelay',
      ),
  }
}

// discovery.getGnosisSafeDetails(
//   'VerifierGovernorMultisig',
//   'SHARP Verifier Governor.',
// ),
