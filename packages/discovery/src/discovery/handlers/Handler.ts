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

export type HandlerExample = {
  title: string
  description?: string
  code: string
}

/**
 * Helper function to enforce type safety when declaring a handler.
 *
 * @example
 * ```ts
 * declareHandler('storage', {
 *   definition: StorageHandlerDefinition,
 *   create: ({ field, definition, abi }) =>
 *     new StorageHandler(field, definition, abi),
 * })
 * ```
 * @note Enforces that the schema definition must have a `type` field that matches the handler type.
 */
export type HandlerFactoryDeps<DefinitionSchema> = {
  field: string
  definition: DefinitionSchema
  abi: string[]
}

export type HandlerFactory<DefinitionSchema> = (
  deps: HandlerFactoryDeps<DefinitionSchema>,
) => Handler

export function declareHandler<
  HandlerType extends string,
  DefinitionSchema extends { type: HandlerType },
>(
  idOrType: HandlerType,
  base: {
    definition: Parser<DefinitionSchema>
    create: HandlerFactory<DefinitionSchema>
  },
  documentation?: {
    description?: string
    examples?: HandlerExample[]
  },
): HandlerDeclaration<HandlerType, DefinitionSchema> {
  return {
    type: idOrType,
    definition: base.definition,
    create: base.create,
    documentation,
  }
}
export interface HandlerDeclaration<
  HandlerType extends string = string,
  DefinitionSchema = unknown,
> {
  type: HandlerType
  definition: Parser<DefinitionSchema>
  create(deps: HandlerFactoryDeps<DefinitionSchema>): Handler
  documentation?: {
    description?: string
    examples?: HandlerExample[]
  }
}

// Preserves tuple type order
export function mapTuple<T extends readonly unknown[], R>(
  tuple: T,
  fn: (value: T[number], index: number) => R,
): { [K in keyof T]: R } {
  return tuple.map(fn) as { [K in keyof T]: R }
}
