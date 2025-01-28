import type { ProjectTechnologyChoice } from '../types'

const ZK_SNARKS: ProjectTechnologyChoice = {
  name: 'Zero knowledge SNARK cryptography is used',
  description:
    'Despite their production use zkSNARKs are still new and experimental cryptography. Cryptography has made a lot of advancements in the recent years but all cryptographic solutions rely on time to prove their security. In addition zkSNARKs require a trusted setup to operate.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'the cryptography is broken or implemented incorrectly.',
    },
  ],
  references: [],
}

const ZK_STARKS: ProjectTechnologyChoice = {
  name: 'Zero knowledge STARK cryptography is used',
  description:
    'Despite their production use zkSTARKs proof systems are still relatively new, complex and they rely on the proper implementation of the polynomial constraints used to check validity of the Execution Trace.',
  risks: [
    {
      category: 'Funds can be lost if',
      text: 'the proof system is implemented incorrectly.',
    },
  ],
  references: [
    {
      title: 'STARK Core Engine Deep Dive',
      url: 'https://medium.com/starkware/starkdex-deep-dive-the-stark-core-engine-497942d0f0ab',
    },
  ],
}

const ZK_BOTH: ProjectTechnologyChoice = {
  name: 'Zero knowledge STARK and SNARK cryptography is used',
  description:
    'Despite their production use zkSTARKs and zkSNARKs proof systems are still relatively new, complex and they rely on the proper implementation of the polynomial constraints used to check validity of the Execution Trace. In addition zkSNARKs require a trusted setup to operate.',
  risks: [
    {
      category: 'Funds can be lost if',
      text: 'the proof system is implemented incorrectly.',
    },
  ],
  references: [],
}

export const NEW_CRYPTOGRAPHY = {
  ZK_SNARKS,
  ZK_STARKS,
  ZK_BOTH,
}
