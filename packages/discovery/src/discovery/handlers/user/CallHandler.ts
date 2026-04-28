import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import { declareHandler, type Handler, type HandlerResult } from '../Handler'
import {
  generateReferenceInput,
  getReferencedName,
  type ReferenceInput,
  resolveReference,
} from '../reference'
import { callMethod, EXEC_REVERT_MSG } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'

export type CallHandlerDefinition = v.infer<typeof CallHandlerDefinition>
export const CallHandlerDefinition = v.strictObject({
  type: v.literal('call'),
  method: v.string().optional(),
  args: v.array(v.union([v.string(), v.number()])),
  ignoreRelative: v.boolean().optional(),
  expectRevert: v.boolean().optional(),
  address: v.string().optional(),
})

export class CallHandler implements Handler {
  readonly dependencies: string[] = []
  readonly fragment: utils.FunctionFragment

  constructor(
    readonly field: string,
    private readonly definition: CallHandlerDefinition,
    abi: string[],
  ) {
    for (const arg of this.definition.args) {
      const dependency = getReferencedName(arg)
      if (dependency) {
        this.dependencies.push(dependency)
      }
    }
    const addressDependency = getReferencedName(this.definition.address)
    if (addressDependency) {
      this.dependencies.push(addressDependency)
    }
    const arity = definition.args.length
    this.fragment = getFunctionFragment(
      definition.method ?? field,
      abi,
      (x) => isViewFragment(x) && x.inputs.length === arity,
    )
  }

  getMethod(): string {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    currentContractAddress: ChainSpecificAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const referenceInput = generateReferenceInput(
      previousResults,
      provider,
      currentContractAddress,
    )
    const resolved = resolveDependencies(
      this.definition,
      referenceInput,
      currentContractAddress,
    )
    const targetAddress = resolved.address ?? currentContractAddress
    if (isZeroAddress(targetAddress)) {
      return {
        field: this.field,
        value: EthereumAddress.ZERO,
        ignoreRelative: this.definition.ignoreRelative,
      }
    }
    const callResult = await callMethod(
      provider,
      targetAddress,
      this.fragment,
      resolved.args,
    )

    if (this.definition.expectRevert && callResult.error === EXEC_REVERT_MSG) {
      return {
        field: this.field,
        value: 'EXPECT_REVERT',
        ignoreRelative: this.definition.ignoreRelative,
      }
    }

    return {
      field: this.field,
      ...callResult,
      fragment: this.fragment,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function resolveDependencies(
  definition: CallHandlerDefinition,
  referenceInput: ReferenceInput,
  currentContractAddress: ChainSpecificAddress,
): {
  method: string | undefined
  args: ContractValue[]
  address: ChainSpecificAddress | undefined
} {
  const args = definition.args.map((x) => resolveReference(x, referenceInput))
  const addressToCall = resolveReference(definition.address, referenceInput)

  if (addressToCall === undefined) {
    return { method: definition.method, args, address: undefined }
  }

  assert(
    typeof addressToCall === 'string',
    `Address to call must be a string - ${addressToCall} given`,
  )

  // Handler results are raw addresses (no chain prefix).
  // Derive the chain from the current contract's ChainSpecificAddress.
  if (!ChainSpecificAddress.check(addressToCall)) {
    const chain = ChainSpecificAddress.chain(currentContractAddress)
    return {
      method: definition.method,
      args,
      address: ChainSpecificAddress.from(chain, addressToCall),
    }
  }

  return {
    method: definition.method,
    args,
    address: ChainSpecificAddress(addressToCall),
  }
}

function isZeroAddress(address: ChainSpecificAddress): boolean {
  return ChainSpecificAddress.address(address) === EthereumAddress.ZERO
}

function isViewFragment(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}

export const CallHandlerBundle = declareHandler('call', {
  definition: CallHandlerDefinition,
  create: ({ field, definition, abi }) =>
    new CallHandler(field, definition, abi),
})
