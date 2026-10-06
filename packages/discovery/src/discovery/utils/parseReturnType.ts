import { assert } from '@l2beat/shared-pure'
import type { ParamType } from 'ethers/lib/utils'

export type Type = BaseType | ArrayType | TupleType

interface BaseType {
  kind: 'base'
  typeName: string
}

interface ArrayType {
  kind: 'array'
  length: number | 'dynamic'
  childType: Type
}

export interface TupleType {
  kind: 'tuple'
  elements: {
    name?: string
    type: Type
  }[]
}

export function toInternalType(args: ParamType[] | undefined): TupleType {
  assert(args !== undefined, 'Fragment must have arguments')

  return {
    kind: 'tuple',
    elements: args.map((output) => ({
      name: output.name === null ? undefined : output.name,
      type: parseEthersParamType(output),
    })),
  }
}

function parseEthersParamType(paramType: ParamType): Type {
  if (paramType.arrayLength !== null) {
    return {
      kind: 'array',
      length: paramType.arrayLength === -1 ? 'dynamic' : paramType.arrayLength,
      childType: parseEthersParamType(paramType.arrayChildren),
    }
  }

  if (paramType.components !== null) {
    return {
      kind: 'tuple',
      elements: paramType.components.map((output) => ({
        name: output.name === null ? undefined : output.name,
        type: parseEthersParamType(output),
      })),
    }
  }

  return {
    kind: 'base',
    typeName: paramType.type,
  }
}
