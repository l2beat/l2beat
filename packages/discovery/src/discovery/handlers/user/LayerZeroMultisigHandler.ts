import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'
import { toEventFragment } from '../utils/toEventFragment'
import { ConstructorArgsHandler } from './ConstructorArgsHandler'

export type LayerZeroMultisigHandlerDefinition = v.infer<
  typeof LayerZeroMultisigHandlerDefinition
>

export const LayerZeroMultisigHandlerDefinition = v.strictObject({
  type: v.literal('layerZeroMultisig'),
})

const UPDATE_SIGNER_EVENT_FRAGMENT = toEventFragment(
  'event UpdateSigner(address _signer, bool _active)',
)
const SIGNER_KEY = '_signer'
const FLAG_KEY = '_active'

const UPDATE_QUORUM_EVENT_FRAGMENT = toEventFragment(
  'event UpdateQuorum(uint64 _quorum)',
)

const QUORUM_KEY = '_quorum'

const ABI = new utils.Interface([
  UPDATE_SIGNER_EVENT_FRAGMENT,
  UPDATE_QUORUM_EVENT_FRAGMENT,
])

export class LayerZeroMultisigHandler implements Handler {
  readonly dependencies: string[] = []
  readonly constructorArgsHandler: ConstructorArgsHandler

  constructor(
    readonly field: string,
    abi: string[],
  ) {
    this.constructorArgsHandler = new ConstructorArgsHandler(
      'constructorArgs',
      {
        type: 'constructorArgs',
        nameArgs: true,
      },
      abi,
    )
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const constructorArgs = await this.constructorArgsHandler.execute(
      provider,
      address,
    )

    async function getLogs(topic: string): Promise<providers.Log[]> {
      return await provider.getLogs(address, [ABI.getEventTopic(topic)])
    }
    const [signer_logs, quorum_logs] = await Promise.all([
      getLogs(ABI.getEventTopic(UPDATE_SIGNER_EVENT_FRAGMENT)),
      getLogs(ABI.getEventTopic(UPDATE_QUORUM_EVENT_FRAGMENT)),
    ])

    const ctorValue = constructorArgs.value
    assert(ctorValue !== undefined, 'constructorArgs.value is undefined')
    assert(
      typeof ctorValue === 'object' &&
        !Array.isArray(ctorValue) &&
        isNotChainSpecificAddress(ctorValue),
      'constructorArgs.value is not an object',
    )
    assert(Array.isArray(ctorValue._signers), 'signers is not an array')
    const signers = new Set<ContractValue>(ctorValue._signers)

    for (const signerLog of signer_logs) {
      const parsedLog = ABI.parseLog(signerLog)
      const signer = toContractValue(parsedLog.args[SIGNER_KEY])
      const flag = toContractValue(parsedLog.args[FLAG_KEY])
      if (flag) {
        signers.add(signer)
      } else {
        signers.delete(signer)
      }
    }

    assert(ctorValue._quorum !== undefined, 'quorum is undefined')
    let quorum: ContractValue = ctorValue._quorum
    const lastQuorumLog = quorum_logs.at(-1)
    if (lastQuorumLog) {
      const parsedLog = ABI.parseLog(lastQuorumLog)
      quorum = toContractValue(parsedLog.args[QUORUM_KEY])
    }

    return {
      field: this.field,
      value: {
        signers: [...signers],
        quorum: +quorum,
      },
    }
  }
}

function isNotChainSpecificAddress<T extends object>(
  value: T | ChainSpecificAddress,
): value is T {
  return typeof value !== 'string'
}
