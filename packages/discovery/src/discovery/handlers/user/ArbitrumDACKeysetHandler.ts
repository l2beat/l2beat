import { assert } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'

export type ArbitrumDACKeysetHandlerDefinition = z.infer<
  typeof ArbitrumDACKeysetHandlerDefinition
>

export const ArbitrumDACKeysetHandlerDefinition = z.strictObject({
  type: z.literal('arbitrumDACKeyset'),
})

const abi = new utils.Interface([
  'event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes)',
])

export class ArbitrumDACKeysetHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ArbitrumDACKeysetHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Resolving Arbitrum DAC Keyset'])

    const events = await provider.getLogs(address, [
      [abi.getEventTopic('SetValidKeyset')],
    ])

    const { requiredSignatures, membersCount } = decodeLastEvent(events)

    return {
      field: this.field,
      value: {
        requiredSignatures,
        membersCount,
      },
    }
  }
}

function decodeLastEvent(events: providers.Log[]): {
  requiredSignatures: number
  membersCount: number
} {
  if (events.length === 0) {
    return {
      requiredSignatures: 0,
      membersCount: 0,
    }
  }

  const lastEvent = events.at(-1)
  assert(lastEvent !== undefined, 'Unexpected lack of event')
  const decodedEvent = abi.decodeEventLog('SetValidKeyset', lastEvent.data)

  // NOTE(radomski): Schema is not public, but we know that the first 8 bytes are the threshold and the next 8 are the keyCount
  const keysetBytes = Bytes.fromHex(decodedEvent.keysetBytes as string)
  const assummedHonestMembers = keysetBytes.slice(0, 8).toNumber()
  const membersCount = keysetBytes.slice(8, 16).toNumber()

  const requiredSignatures = membersCount - assummedHonestMembers + 1

  return {
    requiredSignatures,
    membersCount,
  }
}
