import type { ZkCatalogTag } from '../types'

export const ZkCatalogTagType = {
  STARK: 'STARK',
  ISA: 'ISA',
  SNARK: 'SNARK',
  Curve: 'Curve',
  Field: 'Field',
  PCS: 'PCS',
  Arithmetization: 'Arithmetization',
  Other: 'Other',
} as const

export const zkCatalogTags = [
  // STARK
  {
    id: 'Boojum',
    type: ZkCatalogTagType.STARK,
    name: 'boojum',
    description: 'description',
  },
  {
    id: 'Plonky3',
    type: ZkCatalogTagType.STARK,
    name: 'Plonky3',
    description: 'description',
  },
  {
    id: 'PIL-STARK',
    type: ZkCatalogTagType.STARK,
    name: 'PIL-STARK',
    description: 'description',
  },
  {
    id: 'Stone',
    type: ZkCatalogTagType.STARK,
    name: 'Stone',
    description: 'description',
  },
  {
    id: 'ZkvmProver',
    type: ZkCatalogTagType.STARK,
    name: 'zkvm-prover',
    description: 'description',
  },
  {
    id: 'RISC0',
    type: ZkCatalogTagType.STARK,
    name: 'Risc0',
    description: 'description',
  },
  // ISA
  {
    id: 'EraVM',
    type: ZkCatalogTagType.ISA,
    name: 'EraVM',
    description: 'description',
  },
  {
    id: 'RISCV',
    type: ZkCatalogTagType.ISA,
    name: 'RISC-V',
    description: 'description',
  },
  {
    id: 'ZkASM',
    type: ZkCatalogTagType.ISA,
    name: 'zkASM',
    description: 'description',
  },
  {
    id: 'CASM',
    type: ZkCatalogTagType.ISA,
    name: 'cASM',
    description: 'description',
  },
  {
    id: 'EVM',
    type: ZkCatalogTagType.ISA,
    name: 'EVM',
    description: 'description',
  },
  {
    id: 'OpenVM',
    type: ZkCatalogTagType.ISA,
    name: 'OpenVM',
    description: 'description',
  },
  // configure rest tags here
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
  // biome-ignore lint/suspicious/noExplicitAny:
}, {} as any)

export const zkCatalogTagTypeOrder = Object.values<string>(ZkCatalogTagType)
export const zkCatalogTagsCompareFn = (a: ZkCatalogTag, b: ZkCatalogTag) => {
  const typeOrder =
    zkCatalogTagTypeOrder.indexOf(a.type) -
    zkCatalogTagTypeOrder.indexOf(b.type)
  if (typeOrder !== 0) return typeOrder
  return a.name.localeCompare(b.name)
}
