import { assert } from '@l2beat/backend-tools'
import { providers, utils } from 'ethers'
import * as z from 'zod'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ClassicHandler, HandlerResult } from '../Handler'

export type ArbitrumDACKeysetHandlerDefinition = z.infer<
  typeof ArbitrumDACKeysetHandlerDefinition
>

export const ArbitrumDACKeysetHandlerDefinition = z.strictObject({
  type: z.literal('arbitrumDACKeyset'),
})

const abi = new utils.Interface([
  'event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes)',
])

export class ArbitrumDACKeysetHandler implements ClassicHandler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ArbitrumDACKeysetHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Resolving Arbitrum DAC Keyset'])

    const events = await provider.getLogs(
      address,
      [[abi.getEventTopic('SetValidKeyset')]],
      0,
      blockNumber,
    )

    const { threshold, keyCount } = decodeLastEvent(events)

    return {
      field: this.field,
      value: {
        threshold: threshold,
        keyCount: keyCount,
      },
    }
  }
}

function decodeLastEvent(events: providers.Log[]): {
  threshold: number
  keyCount: number
} {
  if (events.length === 0) {
    return {
      threshold: 0,
      keyCount: 0,
    }
  }

  const lastEvent = events.at(-1)
  assert(lastEvent !== undefined, 'Unexpected lack of event')
  const decodedEvent = abi.decodeEventLog('SetValidKeyset', lastEvent.data)

  // NOTE(radomski): Schema is not public, but we know that the first 8 bytes are the threshold and the next 8 are the keyCount
  const keysetBytes = Bytes.fromHex(decodedEvent.keysetBytes as string)
  const threshold = keysetBytes.slice(0, 8).toNumber()
  const keyCount = keysetBytes.slice(8, 16).toNumber()

  return {
    threshold,
    keyCount,
  }
}
