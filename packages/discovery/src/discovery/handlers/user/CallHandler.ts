import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
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
        value: ZERO_ADDRESS,
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
  const address = resolveReference(definition.address, referenceInput)
  if (address === undefined) {
    return { method: definition.method, args, address: undefined }
  }
  const addressStr = address.toString()
  // Handler results are raw addresses (no chain prefix).
  // Derive the chain from the current contract's ChainSpecificAddress.
  if (!addressStr.includes(':')) {
    const chain = currentContractAddress.split(':')[0]
    return {
      method: definition.method,
      args,
      address: ChainSpecificAddress(`${chain}:${addressStr}`),
    }
  }
  return {
    method: definition.method,
    args,
    address: ChainSpecificAddress(addressStr),
  }
}

const ZERO_ADDRESS = '0x' + '0'.repeat(40)
function isZeroAddress(address: ChainSpecificAddress): boolean {
  return address.endsWith(ZERO_ADDRESS)
}

function isViewFragment(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}
