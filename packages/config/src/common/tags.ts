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
    id: 'boojum',
    type: TagType.STARK,
    name: 'boojum',
    description: 'description',
  },
  {
    id: 'plonky3',
    type: TagType.STARK,
    name: 'Plonky3',
    description: 'description',
  },
  {
    id: 'pil-stark',
    type: TagType.STARK,
    name: 'PIL-STARK',
    description: 'description',
  },
  {
    id: 'stone',
    type: TagType.STARK,
    name: 'Stone',
    description: 'description',
  },
  {
    id: 'zkvm-prover',
    type: TagType.STARK,
    name: 'zkvm-prover',
    description: 'description',
  },
  {
    id: 'risk0',
    type: TagType.STARK,
    name: 'Risc0',
    description: 'description',
  },
  // ISA
  {
    id: 'eravm',
    type: TagType.ISA,
    name: 'EraVM',
    description: 'description',
  },
  {
    id: 'risk-v',
    type: TagType.ISA,
    name: 'RISC-V',
    description: 'description',
  },
  {
    id: 'zkasm',
    type: TagType.ISA,
    name: 'zkASM',
    description: 'description',
  },
  {
    id: 'casm',
    type: TagType.ISA,
    name: 'cASM',
    description: 'description',
  },
  {
    id: 'evm',
    type: TagType.ISA,
    name: 'EVM',
    description: 'description',
  },
  {
    id: 'openvm',
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
