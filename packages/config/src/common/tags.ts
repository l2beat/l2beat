import type { Tag } from '../types'

export const TagType = {
  STARK: 'STARK',
  ISA: 'ISA',
  SNARK: 'SNARK',
  Curve: 'Curve',
  Field: 'Field',
  PCS: 'PCS',
  Arithmetization: 'Arithmetization',
  Other: 'Other',
} as const

export const tags = [
  // STARK
  {
    id: 'Boojum',
    type: TagType.STARK,
    name: 'boojum',
    description: 'description',
  },
  {
    id: 'Plonky3',
    type: TagType.STARK,
    name: 'Plonky3',
    description: 'description',
  },
  {
    id: 'PIL-STARK',
    type: TagType.STARK,
    name: 'PIL-STARK',
    description: 'description',
  },
  {
    id: 'Stone',
    type: TagType.STARK,
    name: 'Stone',
    description: 'description',
  },
  {
    id: 'ZkvmProver',
    type: TagType.STARK,
    name: 'zkvm-prover',
    description: 'description',
  },
  {
    id: 'RISC0',
    type: TagType.STARK,
    name: 'Risc0',
    description: 'description',
  },
  // ISA
  {
    id: 'EraVM',
    type: TagType.ISA,
    name: 'EraVM',
    description: 'description',
  },
  {
    id: 'RISCV',
    type: TagType.ISA,
    name: 'RISC-V',
    description: 'description',
  },
  {
    id: 'ZkASM',
    type: TagType.ISA,
    name: 'zkASM',
    description: 'description',
  },
  {
    id: 'CASM',
    type: TagType.ISA,
    name: 'cASM',
    description: 'description',
  },
  {
    id: 'EVM',
    type: TagType.ISA,
    name: 'EVM',
    description: 'description',
  },
  {
    id: 'OpenVM',
    type: TagType.ISA,
    name: 'OpenVM',
    description: 'description',
  },
  // configure rest tags here
] as const satisfies Tag[]

type AnyTag = (typeof tags)[number]

export const TAGS: {
  [T in keyof typeof TagType]: {
    [K in Extract<AnyTag, { type: T }>['id']]: Tag
  }
} = tags.reduce((acc, tag) => {
  if (!acc[tag.type]) acc[tag.type] = {}
  acc[tag.type][tag.id] = tag
  return acc
  // biome-ignore lint/suspicious/noExplicitAny:
}, {} as any)

export const tagTypeOrder = Object.values<string>(TagType)
export const tagsCompareFn = (a: Tag, b: Tag) => {
  const typeOrder = tagTypeOrder.indexOf(a.type) - tagTypeOrder.indexOf(b.type)
  if (typeOrder !== 0) return typeOrder
  return a.name.localeCompare(b.name)
}
