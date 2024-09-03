import { EthereumAddress } from '@l2beat/shared-pure'

import { DaAccessibilityRisk } from '../../../types/DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge } from '../../../types/DaBridge'
import { DaExitWindowRisk } from '../../../types/DaExitWindowRisk'

const validation = {
  type: 'zk-proof',
  relayer: 'SuccinctGateway',
}

export const vector = {
  id: 'vector',
  type: 'OnChainBridge',
  chain: 'Ethereum',
  display: {
    name: 'Vector',
    slug: 'vector',
    description:
      `Vector is a data availability bridge using Zero-Knowledge proofs to verify Avail data availability attestations on Ethereum.
      `,
    links: {
      websites: [],
      documentation: [],
      repositories: ['https://github.com/succinctlabs/sp1-vector'],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  validation: validation,
  contracts: {
    addresses: [
      {
        name: 'Vector',
        address: EthereumAddress('0x02993cdC11213985b9B13224f3aF289F03bf298d'),
        description:
          'Vector bridge contract that accepts and stores Avail data availability commitments on Ethereum.',
      },
    ],
    risks: [],
  },
  technology: ` 
   Vector SP1 is an implementation of zero-knowledge proof circuits for Vector, Avail's Data Attestation Bridge.
   The VectorSP1 contract should be used to store the latest data from the Avail chain, including the headers and data commitments.
    `,
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(), // no delay
  },
} satisfies DaBridge
