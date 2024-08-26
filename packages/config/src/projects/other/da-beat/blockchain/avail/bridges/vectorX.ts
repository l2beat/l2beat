import { EthereumAddress } from '@l2beat/shared-pure'

import { DaAccessibilityRisk } from '../../../types/DaAccessibilityRisk'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge } from '../../../types/DaBridge'
import { DaExitWindowRisk } from '../../../types/DaExitWindowRisk'

export const vectorX = {
  id: 'vectorX',
  type: 'OnChainBridge',
  chain: 'Ethereum',
  display: {
    name: 'VectorX',
    slug: 'vectorx',
    description:
      'VectorX is a data availability bridge using Zero-Knowledge Proofs to verify Avail data availability attestations on Ethereum.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  validation: {
    type: 'zk-proof',
  },
  contracts: {
    addresses: [
      {
        name: 'VectorX',
        address: EthereumAddress('0x02993cdC11213985b9B13224f3aF289F03bf298d'),
        description:
          'VectorX bridge contract that accepts and stores Avail data availability commitments on Ethereum.',
      },
    ],
    risks: [],
  },
  technology: ` 
    `,
  permissions: [],
  usedIn: [],
  risks: {
    attestations: DaAttestationSecurityRisk.SigVerifiedZK(true),
    accessibility: DaAccessibilityRisk.NotEnshrined,
    exitWindow: DaExitWindowRisk.LowOrNoDelay(), // no delay
  },
} satisfies DaBridge
