import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { ParamType } from 'ethers/lib/utils'
import { toFunctionFragment } from '../handlers/utils/toFunctionFragment'

export type Type = BaseType | ArrayType | TupleType

export interface BaseType {
  kind: 'base'
  typeName: string
}

export interface ArrayType {
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
  return getReturnType(fragment)
}

export function getReturnType(fragment: utils.FunctionFragment): TupleType {
  assert(fragment.outputs !== undefined)

  return {
    kind: 'tuple',
    elements: fragment.outputs.map((output) => ({
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
