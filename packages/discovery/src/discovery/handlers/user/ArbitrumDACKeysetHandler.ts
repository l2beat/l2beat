import { assert, Bytes, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import { base64 } from 'ethers/lib/utils'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ArbitrumDACKeysetHandlerDefinition = v.infer<
  typeof ArbitrumDACKeysetHandlerDefinition
>

export const ArbitrumDACKeysetHandlerDefinition = v.strictObject({
  type: v.literal('arbitrumDACKeyset'),
})

const abi = new utils.Interface([
  'event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes)',
])

export class ArbitrumDACKeysetHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ArbitrumDACKeysetHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const events = await provider.getLogs(address, [
      [abi.getEventTopic('SetValidKeyset')],
    ])

    const { requiredSignatures, membersCount, blsSignatures } =
      decodeLastEvent(events)

    return {
      field: this.field,
      value: {
        requiredSignatures,
        membersCount,
        blsSignatures,
      },
    }
  }
}

function decodeLastEvent(events: providers.Log[]): {
  requiredSignatures: number
  membersCount: number
  blsSignatures: string[]
} {
  if (events.length === 0) {
    return {
      requiredSignatures: 0,
      membersCount: 0,
      blsSignatures: [],
    }
  }

  const lastEvent = events.at(-1)
  assert(lastEvent !== undefined, 'Unexpected lack of event')
  const decodedEvent = abi.decodeEventLog('SetValidKeyset', lastEvent.data)

  // NOTE(radomski): Schema is not public, but we know that the first 8 bytes are the threshold and the next 8 are the keyCount
  const keysetBytes = Bytes.fromHex(decodedEvent.keysetBytes as string)
  const assumedHonestMembers = keysetBytes.slice(0, 8).toNumber()
  const membersCount = keysetBytes.slice(8, 16).toNumber()

  const requiredSignatures = membersCount - assumedHonestMembers + 1

  const blsSignatures: string[] = []
  let head = 16
  for (let i = 0; i < membersCount; i++) {
    const size = keysetBytes.slice(head, head + 2).toNumber()
    head += 2

    blsSignatures.push(
      base64.encode(keysetBytes.slice(head, head + size).toString()),
    )
    head += size
  }

  assert(head === keysetBytes.length)

  return {
    requiredSignatures,
    membersCount,
    blsSignatures,
  }
}
