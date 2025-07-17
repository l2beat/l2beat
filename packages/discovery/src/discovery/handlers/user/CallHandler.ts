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
    const resolved = resolveDependencies(this.definition, referenceInput)
    const callResult = await callMethod(
      provider,
      resolved.address ?? currentContractAddress,
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
): {
  method: string | undefined
  args: ContractValue[]
  address: ChainSpecificAddress | undefined
} {
  const args = definition.args.map((x) => resolveReference(x, referenceInput))
  const address = resolveReference(definition.address, referenceInput)
  return {
    method: definition.method,
    args,
    address:
      address !== undefined
        ? ChainSpecificAddress(address.toString())
        : undefined,
  }
}

function isViewFragment(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}
