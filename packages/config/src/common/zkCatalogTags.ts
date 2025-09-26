import type { ZkCatalogTag } from '../types'

export type ZkCatalogTagType =
  (typeof ZkCatalogTagType)[keyof typeof ZkCatalogTagType]

export const ZkCatalogTagType = {
  Arithmetization: 'Arithmetization',
  curve: 'curve',
  Fflonk: 'Fflonk',
  Field: 'Field',
  Groth16: 'Groth16',
  ISA: 'ISA',
  Other: 'Other',
  PCS: 'PCS',
  Plonk: 'Plonk',
  STARK: 'STARK',
} as const

export const zkCatalogTags = [
  // STARK
  {
    id: 'Airbender',
    type: ZkCatalogTagType.STARK,
    name: 'Airbender',
    description:
      'zkVM STARK proving system operating on RISC-V ISA, developed by Matter Labs.',
  },
  {
    id: 'Boojum',
    type: ZkCatalogTagType.STARK,
    name: 'Boojum',
    description:
      'zkVM STARK proving system developed by Matter Labs for proving state transition of ZKsync Era.',
  },
  {
    id: 'Plonky3',
    type: ZkCatalogTagType.STARK,
    name: 'Plonky3',
    description:
      'Toolkit that implements a set of primitives for STARK-based zkVMs developed by Polygon Zero team.',
  },
  {
    id: 'PIL-STARK',
    type: ZkCatalogTagType.STARK,
    name: 'PIL-STARK',
    description:
      'zkVM STARK proving system that works with Polynomial Identity Language (PIL) developed by Polygon Zero team.',
  },
  {
    id: 'Stone',
    type: ZkCatalogTagType.STARK,
    name: 'Stone',
    description:
      'zkVM STARK proving system developed by Starkware for Cairo programs, including state transition of Starknet.',
  },
  {
    id: 'ZkvmProver',
    type: ZkCatalogTagType.STARK,
    name: 'zkvm-prover',
    description:
      'zkVM STARK proving system developed by Scroll for openvm programs, including state transition of Scroll.',
  },
  {
    id: 'RISC0',
    type: ZkCatalogTagType.STARK,
    name: 'Risc0',
    description:
      'zkVM STARK proving system developed by RISC ZERO for RISC-V programs.',
  },
  // ISA
  {
    id: 'EraVM',
    type: ZkCatalogTagType.ISA,
    name: 'EraVM',
    description: 'Instruction language for ZKsync Era virtual machine.',
  },
  {
    id: 'RISCV',
    type: ZkCatalogTagType.ISA,
    name: 'RISC-V',
    description:
      'Free and open-source universal 32-bit ISA used across a variety of hardware and software.',
  },
  {
    id: 'ZkASM',
    type: ZkCatalogTagType.ISA,
    name: 'zkASM',
    description: 'Instruction language for Polygon zkEVM virtual machine.',
  },
  {
    id: 'CASM',
    type: ZkCatalogTagType.ISA,
    name: 'Cairo ASM',
    description: 'Instruction language for Cairo VM developed by Starkware.',
  },
  {
    id: 'EVM',
    type: ZkCatalogTagType.ISA,
    name: 'EVM',
    description: 'Instruction language for Ethereum VM.',
  },
  {
    id: 'OpenVM',
    type: ZkCatalogTagType.ISA,
    name: 'OpenVM',
    description:
      'Extensible instruction set for OpenVM zkVM developed by Axiom.',
  },
  // Plonk
  {
    id: 'Bellman',
    type: ZkCatalogTagType.Plonk,
    name: 'Bellman',
    description:
      'Bellman Rust library for Plonk proving system, originally developed for ZCash.',
  },
  {
    id: 'Gnark',
    type: ZkCatalogTagType.Plonk,
    name: 'Gnark',
    description:
      'Consensys implementation of Plonk proving system written in Go.',
  },
  {
    id: 'Halo2',
    type: ZkCatalogTagType.Plonk,
    name: 'Halo2',
    description:
      'Rust implementation of Halo2 SNARK proving system, originally developed for ZCash.',
  },
  {
    id: 'Zksync',
    type: ZkCatalogTagType.Plonk,
    name: 'Zksync',
    description:
      'Matter Labs Rust implementation of Plonk proving system, originally developed for ZKsync Lite (old ZKsync).',
  },
  {
    id: 'linea',
    type: ZkCatalogTagType.Plonk,
    name: 'Linea',
    description:
      'Prover system of Linea written in Go, includes Vortex polynomial commitment and Arcane compiler.',
  },
  {
    id: 'Plonky2',
    type: ZkCatalogTagType.Plonk,
    name: 'Plonky2',
    description:
      'Toolkit for developing transparent SNARKs based on PLONK and FRI developed by Polygon Zero team.',
  },
  {
    id: 'AztecV1',
    type: ZkCatalogTagType.Plonk,
    name: 'AztecV1',
    description:
      'First version of Aztec implementation of Plonk proving system, originally developed for zk.money (AZTEC v1).',
  },
  {
    id: 'Jellyfish',
    type: ZkCatalogTagType.Plonk,
    name: 'Jellyfish',
    description:
      'Open-source toolkit of various cryptographic primitives, including an implementation of Plonk SNARK, developed in Rust by Espresso Systems.',
  },
  // Fflonk
  {
    id: 'Zksync',
    type: ZkCatalogTagType.Fflonk,
    name: 'Zksync',
    description:
      'Matter Labs Rust implementation of Fflonk improvement over standard Plonk proving system.',
  },
  {
    id: 'Snarkjs',
    type: ZkCatalogTagType.Fflonk,
    name: 'Snarkjs',
    description:
      'Circom / iden3 implementation of Fflonk improvement over standard Plonk proving system written in JS.',
  },
  // Groth16
  {
    id: 'Gnark',
    type: ZkCatalogTagType.Groth16,
    name: 'Gnark',
    description:
      'Consensys implementation of Groth16 proving system written in Go.',
  },
  {
    id: 'Snarkjs',
    type: ZkCatalogTagType.Groth16,
    name: 'Snarkjs',
    description:
      'Circom / iden3 implementation of Groth16 proving system written in JS.',
  },
  {
    id: 'EthSnarks',
    type: ZkCatalogTagType.Groth16,
    name: 'EthSnarks',
    description:
      'EthSnarks implementation of Groth16 proving system written in C++.',
  },
  // Curve
  {
    id: 'BN254',
    type: ZkCatalogTagType.curve,
    name: 'BN254',
    description:
      'BN254, aka BN256, aka alt_bn128 pairing-friendly 254-bit prime field Weierstrass elliptic curve.',
  },
  {
    id: 'BW6-761',
    type: ZkCatalogTagType.curve,
    name: 'BW6-761',
    description:
      'Pairing-friendly 761-bit prime field elliptic curve introduced by Housni and Guillevic.',
  },
  {
    id: 'BLS12-377',
    type: ZkCatalogTagType.curve,
    name: 'BLS12-377',
    description:
      'Pairing-friendly 377-bit prime field Weierstrass elliptic curve.',
  },
  // Field
  {
    id: 'Mersenne31',
    type: ZkCatalogTagType.Field,
    name: 'Mersenne31',
    description: 'Prime field of order p = 2**31 - 1.',
  },
  {
    id: 'Goldilocks',
    type: ZkCatalogTagType.Field,
    name: 'Goldilocks',
    description: 'Prime field of order p = 2**64 - 2**32  + 1.',
  },
  {
    id: 'BabyBear',
    type: ZkCatalogTagType.Field,
    name: 'Baby Bear',
    description: 'Prime field of order p = 15 * 2**27 + 1.',
  },
  {
    id: 'felt252',
    type: ZkCatalogTagType.Field,
    name: 'felt252',
    description: 'Prime field of order p = 2**251 + 17 * 2**192 + 1.',
  },
  // PCS
  {
    id: 'KZG',
    type: ZkCatalogTagType.PCS,
    name: 'KZG',
    description:
      'Polynomial commitment scheme that requires a universal trusted setup, introduced by Kate, Zaverucha and Goldberg.',
  },
  // Arithmetization
  {
    id: 'Plonkish',
    type: ZkCatalogTagType.Arithmetization,
    name: 'Plonkish',
    description:
      'General name for PLONK-like arithmetizations, i.e. value matrix with polynomial constraints, custom gates and lookup arguments.',
  },
  {
    id: 'R1CS',
    type: ZkCatalogTagType.Arithmetization,
    name: 'R1CS',
    description:
      'Rank 1 constraint system defined by a set of quadratic conditions on the circuit input.',
  },
  {
    id: 'AIR',
    type: ZkCatalogTagType.Arithmetization,
    name: 'AIR',
    description:
      'Algebraic intermediate representation that encodes a valid VM execution trace with polynomials.',
  },
  {
    id: 'eAIR',
    type: ZkCatalogTagType.Arithmetization,
    name: 'eAIR',
    description:
      'Extended algebraic intermediate representation introduced by Polygon Zero for eSTARK.',
  },
  // Other
  {
    id: 'CustomCircuits',
    type: ZkCatalogTagType.Other,
    name: 'App-specific circuits',
    description: 'This project uses custom app-specific ZK circuits.',
  },
] as const satisfies ZkCatalogTag[]

type AnyZkCatalogTag = (typeof zkCatalogTags)[number]

export const ZK_CATALOG_TAGS: {
  [T in keyof typeof ZkCatalogTagType]: {
    [K in Extract<AnyZkCatalogTag, { type: T }>['id']]: ZkCatalogTag
  }
} = zkCatalogTags.reduce((acc, zkCatalogTag) => {
  if (!acc[zkCatalogTag.type]) acc[zkCatalogTag.type] = {}
  acc[zkCatalogTag.type][zkCatalogTag.id] = zkCatalogTag
  return acc
  // biome-ignore lint/suspicious/noExplicitAny: needed any
}, {} as any)

export const zkCatalogTagTypeOrder = Object.values<string>(ZkCatalogTagType)
export const zkCatalogTagsCompareFn = (a: ZkCatalogTag, b: ZkCatalogTag) => {
  const typeOrder =
    zkCatalogTagTypeOrder.indexOf(a.type) -
    zkCatalogTagTypeOrder.indexOf(b.type)
  if (typeOrder !== 0) return typeOrder
  return a.name.localeCompare(b.name)
}
