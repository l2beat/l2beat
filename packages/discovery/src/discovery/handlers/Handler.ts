import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Parser } from '@l2beat/validate'
import type { utils } from 'ethers'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'

export interface HandlerResult {
  field: string
  value?: ContractValue
  error?: string
  fragment?: utils.FunctionFragment
  ignoreRelative?: boolean
}

export interface Handler {
  field: string
  dependencies: string[]
  execute(
    provider: IProvider,
    address: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult>
}

export function declareHandler<
  HandlerType extends string,
  DefinitionSchema extends { type: HandlerType },
  HandlerClass,
>(
  idOrType: HandlerType,
  base: {
    clazz: HandlerClass
    definition: Parser<DefinitionSchema>
  },
  documentation?: {
    description?: string
    examples?: string[]
  },
): HandlerDeclaration<HandlerType, HandlerClass, DefinitionSchema> {
  return {
    type: idOrType,
    clazz: base.clazz,
    definition: base.definition,
    documentation,
  }
}
export interface HandlerDeclaration<
  HandlerType extends string = string,
  HandlerClass = unknown,
  DefinitionSchema = unknown,
> {
  type: HandlerType
  clazz: HandlerClass
  definition: Parser<DefinitionSchema>
  documentation?: {
    description?: string
    examples?: string[]
  }
}

// Preserves tuple type order
export function mapTuple<T extends readonly unknown[], R>(
  tuple: T,
  fn: (value: T[number], index: number) => R,
): { [K in keyof T]: R } {
  return tuple.map(fn) as { [K in keyof T]: R }
}
