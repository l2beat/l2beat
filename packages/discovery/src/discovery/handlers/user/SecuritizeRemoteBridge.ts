import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type SecuritizeRemoteBridgeHandlerDefinition = v.infer<
  typeof SecuritizeRemoteBridgeHandlerDefinition
>
export const SecuritizeRemoteBridgeHandlerDefinition = v.strictObject({
  type: v.literal('securitizeRemoteBridge'),
})

const abi = new utils.Interface([
  'event BridgeAddressAdd(uint16 chainId, address bridgeAddress)',
  'event BridgeAddressRemove(uint16 chainId)',
  'event BridgeAddressAdded(uint16 chainId, address bridgeAddress)',
  'event BridgeAddressRemoved(uint16 chainId)',
])

export const wormholeToShortName: Record<number, string> = {
  2: 'eth',
  4: 'bnb',
  5: 'matic',
  6: 'avax',
  14: 'celo',
  23: 'arb1',
  24: 'oeth',
  30: 'base',
  34: 'scr',
  35: 'mantle',
  38: 'linea',
  44: 'unichain',
  46: 'ink',
}

export class SecuritizeRemoteBridgeHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: SecuritizeRemoteBridgeHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const topics = [
      [
        abi.getEventTopic('BridgeAddressAdd'),
        abi.getEventTopic('BridgeAddressAdded'),
        abi.getEventTopic('BridgeAddressRemove'),
        abi.getEventTopic('BridgeAddressRemoved'),
      ],
    ]
    const logs = await provider.getLogs(address, topics)
    const actions = logs.map((l) => parseLog(l))
    const mapping = new Map<string, string>()
    console.log('skidi', logs, topics, actions)

    for (const action of actions) {
      if (action.action === 'add') {
        mapping.set(
          action.chain,
          ChainSpecificAddress.from(action.chain, action.address),
        )
      } else {
        mapping.delete(action.chain)
      }
    }

    return {
      field: this.field,
      value: [...mapping.values()],
    }
  }
}

interface AddLog {
  readonly action: 'add'
  readonly chain: string
  readonly address: EthereumAddress
}

interface RemoveLog {
  readonly action: 'remove'
  readonly chain: string
}

function parseLog(log: providers.Log): AddLog | RemoveLog {
  const event = abi.parseLog(log)
  const chain = wormholeToShortName[event.args.chainId]
  assert(chain !== undefined, `Unknown wormhole chain ${event.args.chainId}`)

  if (
    event.name === 'BridgeAddressAdded' ||
    event.name === 'BridgeAddressAdd'
  ) {
    const address = EthereumAddress(event.args.bridgeAddress)
    return { action: 'add', chain, address } as const
  }
  if (
    event.name === 'BridgeAddressRemoved' ||
    event.name === 'BridgeAddressRemove'
  ) {
    return { action: 'remove', chain } as const
  }

  assert(false)
}
