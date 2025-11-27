import { assert } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import { toFunctionFragment } from '../handlers/utils/toFunctionFragment.js'

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

export function parseReturnType(returnType: string): TupleType {
  assert(
    returnType.startsWith('(') && returnType.endsWith(')'),
    'Return type must have parentheses around it',
  )
  const virtualMethod = `function f() returns ${returnType}`
  const fragment = toFunctionFragment(virtualMethod)
  return toInternalType(fragment.outputs)
}

export function toInternalType(args: utils.ParamType[] | undefined): TupleType {
  assert(args !== undefined, 'Fragment must have arguments')

  return {
    kind: 'tuple',
    elements: args.map((output) => ({
      name: output.name === null ? undefined : output.name,
      type: parseEthersParamType(output),
    })),
  }
}

function parseEthersParamType(paramType: utils.ParamType): Type {
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
