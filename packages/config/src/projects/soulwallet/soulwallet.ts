import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PROOFS } from '../../common'
import type { BaseProject } from '../../types'

export const soulwallet: BaseProject = {
  id: ProjectId('soulwallet'),
  slug: 'soulwallet',
  name: 'Soul Wallet',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-08-14')),
  // tags
  isZkCatalog: true,
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Smart contract wallet supporting guardians and email recovery with ZK.',
    links: {},
    badges: [],
  },
  proofVerification: {
    shortDescription:
      'Smart contract wallet supporting guardians and email recovery with ZK.',
    aggregation: false,
    verifiers: [
      {
        name: 'EmailApprover',
        description:
          "EIP1271 style approver by verifying user's email onchain. Powered by zkemail.",
        contractAddress: EthereumAddress(
          '0x0A070fC1DBd9A146517045935B88256f20F969d7',
        ),
        chainId: ChainId.OPTIMISM,
        verified: 'no',
        subVerifiers: [
          {
            name: 'EmailApprover',
            ...PROOFS.GROTH16('POT22'),
            link: 'https://github.com/SoulWallet/email-approver/blob/v1.0.0/packages/circuits/EmailApprover.circom',
          },
        ],
      },
    ],
    requiredTools: [
      {
        name: 'snarkjs',
        version: '?',
        link: 'https://github.com/iden3/snarkjs',
      },
      {
        name: 'circom',
        version: '?',
        link: 'https://github.com/iden3/circom',
      },
    ],
  },
}
