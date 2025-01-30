import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { PROOFS } from './common/proofSystems'

export const nebraupa: BaseProject = {
  id: ProjectId('nebra-upa'),
  slug: 'nebra-upa',
  name: 'Nebra UPA',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-02')),
  // tags
  isZkCatalog: true,
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    isUnderReview: false,
    isUnverified: false,
  },
  proofVerification: {
    aggregation: true,
    verifiers: [
      {
        name: 'UPA verifier',
        description:
          'The Nebra UPA verifier that allows to verify aggregated proofs from multiple projects.',
        contractAddress: EthereumAddress(
          '0xE990F8e3505391d2b42C80683d403A8371Ee88B9',
        ),
        chainId: ChainId.ETHEREUM,
        verified: 'no',
        // not sure which degree is used for PPOT
        subVerifiers: [
          {
            name: 'Outer circuit',
            ...PROOFS.HALO2KZG('PPOT?'),
            link: 'https://github.com/NebraZKP/upa/tree/v1.2.2/circuits/src/outer',
          },
          {
            name: 'UBV circuit',
            ...PROOFS.HALO2KZG('PPOT?'),
            link: 'https://github.com/NebraZKP/upa/tree/v1.2.2/circuits/src/batch_verify',
          },
          {
            name: 'Keccak circuit',
            ...PROOFS.HALO2KZG('PPOT?'),
            link: 'https://github.com/NebraZKP/upa/tree/v1.2.2/circuits/src/keccak',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'Custom tool',
        version: '1.2.2',
        link: 'https://github.com/NebraZKP/upa/blob/v1.2.2/verification/key_verification.sh',
      },
    ],
  },
}
