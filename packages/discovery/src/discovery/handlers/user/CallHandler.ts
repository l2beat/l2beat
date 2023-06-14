import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, resolveReference } from '../reference'
import { callMethod, EXEC_REVERT_MSG } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'

export type CallHandlerDefinition = z.infer<typeof CallHandlerDefinition>
export const CallHandlerDefinition = z.strictObject({
  type: z.literal('call'),
  method: z.optional(z.string()),
  args: z.array(z.union([z.string(), z.number()])),
  ignoreRelative: z.optional(z.boolean()),
  expectRevert: z.optional(z.boolean()),
})

export class CallHandler implements Handler {
  readonly dependencies: string[] = []
  readonly fragment: utils.FunctionFragment

  constructor(
    readonly field: string,
    private readonly definition: CallHandlerDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    for (const arg of this.definition.args) {
      const dependency = getReferencedName(arg)
      if (dependency) {
        this.dependencies.push(dependency)
      }
    }
    const arity = definition.args.length
    this.fragment = getFunctionFragment(
      definition.method ?? field,
      abi,
      (x) => isViewFragment(x) && x.inputs.length === arity,
    )
  }

  getMethod() {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const resolved = resolveDependencies(this.definition, previousResults)
    this.logger.logExecution(this.field, [
      'Calling ',
      `${this.fragment.name}(${resolved.args
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        .map((x) => x.toString())
        .join(', ')})`,
    ])
    const callResult = await callMethod(
      provider,
      address,
      this.fragment,
      resolved.args,
      blockNumber,
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
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function resolveDependencies(
  definition: CallHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
) {
  const args = definition.args.map((x) => resolveReference(x, previousResults))
  return {
    method: definition.method,
    args,
  }
}

function isViewFragment(fragment: utils.FunctionFragment) {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}
