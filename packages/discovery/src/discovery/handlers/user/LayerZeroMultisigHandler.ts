import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import { z } from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'
import { toEventFragment } from '../utils/toEventFragment'
import { ConstructorArgsHandler } from './ConstructorArgsHandler'

export type LayerZeroMultisigHandlerDefinition = z.infer<
  typeof LayerZeroMultisigHandlerDefinition
>

export const LayerZeroMultisigHandlerDefinition = z.strictObject({
  type: z.literal('layerZeroMultisig'),
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

export class LayerZeroMultisigHandler implements ClassicHandler {
  readonly dependencies: string[] = []
  readonly constructorArgsHandler: ConstructorArgsHandler

  constructor(
    readonly field: string,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    this.constructorArgsHandler = new ConstructorArgsHandler(
      'constructorArgs',
      {
        type: 'constructorArgs',
        nameArgs: true,
      },
      abi,
      logger,
    )
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    const constructorArgs = await this.constructorArgsHandler.execute(
      provider,
      address,
    )

    this.logger.logExecution(this.field, [
      'Querying ',
      UPDATE_SIGNER_EVENT_FRAGMENT.name,
      ' and ',
      UPDATE_QUORUM_EVENT_FRAGMENT.name,
    ])

    async function getLogs(topic: string): Promise<providers.Log[]> {
      return await provider.getLogs(
        address,
        [ABI.getEventTopic(topic)],
        0,
        blockNumber,
      )
    }
    const [signer_logs, quorum_logs] = await Promise.all([
      getLogs(ABI.getEventTopic(UPDATE_SIGNER_EVENT_FRAGMENT)),
      getLogs(ABI.getEventTopic(UPDATE_QUORUM_EVENT_FRAGMENT)),
    ])

    const ctorValue = constructorArgs.value
    assert(ctorValue !== undefined, 'constructorArgs.value is undefined')
    assert(
      typeof ctorValue === 'object' && !Array.isArray(ctorValue),
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
