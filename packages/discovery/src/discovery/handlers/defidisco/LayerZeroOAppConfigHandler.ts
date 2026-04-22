import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type LayerZeroOAppConfigHandlerDefinition = v.infer<
  typeof LayerZeroOAppConfigHandlerDefinition
>
export const LayerZeroOAppConfigHandlerDefinition = v.strictObject({
  type: v.literal('layerZeroOAppConfig'),
  endpoint: v.string(),
  includeEnforcedOptions: v.boolean().optional(),
  extraEids: v.array(v.number()).optional(),
})

const peerSetAbi = 'event PeerSet(uint32 eid, bytes32 peer)'
const peersFragment = utils.FunctionFragment.from(
  'peers(uint32) view returns (bytes32)',
)
const enforcedOptionsFragment = utils.FunctionFragment.from(
  'enforcedOptions(uint32, uint16) view returns (bytes)',
)
const delegatesFragment = utils.FunctionFragment.from(
  'delegates(address) view returns (address)',
)
const getSendLibraryFragment = utils.FunctionFragment.from(
  'getSendLibrary(address, uint32) view returns (address)',
)
const getReceiveLibraryFragment = utils.FunctionFragment.from(
  'getReceiveLibrary(address, uint32) view returns (address, bool)',
)
const getConfigFragment = utils.FunctionFragment.from(
  'getConfig(address, address, uint32, uint32) view returns (bytes)',
)

const ULN_CONFIG_TYPE = 2
const EXECUTOR_CONFIG_TYPE = 1
const MSG_TYPE_SEND = 1
const MSG_TYPE_SEND_AND_CALL = 2

const ULN_TUPLE =
  'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)'
const EXECUTOR_TUPLE = 'tuple(uint32 maxMessageSize, address executor)'

const ZERO_BYTES32 = '0x' + '00'.repeat(32)
const ZERO_ADDRESS = EthereumAddress.ZERO.toString()

/**
 * Captures the full LayerZero V2 OApp security stack that is not reachable
 * via zero-arg view calls: peers, delegate, send/receive libraries, and the
 * ULN/Executor configs stored on the endpoint per (oapp, remote eid).
 *
 * EIDs are enumerated from the OApp's own PeerSet events (idempotent,
 * history-complete), plus any extras supplied in the config. Zero-peer
 * entries are dropped so the output stays clean.
 *
 * ULN/Executor configs are ABI-decoded so watch-mode diffs surface the
 * actual DVN set / threshold / executor changes instead of a bytes blob.
 */
export class LayerZeroOAppConfigHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: LayerZeroOAppConfigHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    try {
      const endpoint = ChainSpecificAddress(this.definition.endpoint)
      const chain = ChainSpecificAddress.chain(address)
      const oappHex = ChainSpecificAddress.address(address).toString()

      const peerEvents = await provider.getEvents(address, peerSetAbi, [])
      const discoveredEids = new Set<number>()
      for (const { event } of peerEvents) {
        const eid = event.eid ?? event['eid']
        if (eid !== undefined) {
          discoveredEids.add(Number(eid))
        }
      }
      for (const eid of this.definition.extraEids ?? []) {
        discoveredEids.add(eid)
      }
      const eids = [...discoveredEids].sort((a, b) => a - b)

      const delegate = await provider
        .callMethod<string>(endpoint, delegatesFragment, [oappHex])
        .catch(() => undefined)

      const perEid: Record<string, unknown> = {}
      for (const eid of eids) {
        const peer = await provider
          .callMethod<string>(address, peersFragment, [eid])
          .catch(() => undefined)
        if (!peer || peer === ZERO_BYTES32) continue

        const entry: Record<string, unknown> = { peer }

        const sendLib = await provider
          .callMethod<string>(endpoint, getSendLibraryFragment, [oappHex, eid])
          .catch(() => undefined)
        if (sendLib && sendLib !== ZERO_ADDRESS) {
          entry.sendLibrary = prefixAddress(chain, sendLib)
          const sendUlnBytes = await readConfigBytes(
            provider,
            endpoint,
            oappHex,
            sendLib,
            eid,
            ULN_CONFIG_TYPE,
          )
          if (sendUlnBytes) {
            entry.sendUlnConfig = decodeUlnConfig(sendUlnBytes, chain)
          }
          const executorBytes = await readConfigBytes(
            provider,
            endpoint,
            oappHex,
            sendLib,
            eid,
            EXECUTOR_CONFIG_TYPE,
          )
          if (executorBytes) {
            entry.executorConfig = decodeExecutorConfig(executorBytes, chain)
          }
        }

        const receiveLib = await provider
          .callMethod<[string, boolean]>(endpoint, getReceiveLibraryFragment, [
            oappHex,
            eid,
          ])
          .catch(() => undefined)
        if (receiveLib && receiveLib[0] !== ZERO_ADDRESS) {
          entry.receiveLibrary = prefixAddress(chain, receiveLib[0])
          entry.receiveLibraryIsDefault = receiveLib[1]
          const recvUlnBytes = await readConfigBytes(
            provider,
            endpoint,
            oappHex,
            receiveLib[0],
            eid,
            ULN_CONFIG_TYPE,
          )
          if (recvUlnBytes) {
            entry.receiveUlnConfig = decodeUlnConfig(recvUlnBytes, chain)
          }
        }

        if (this.definition.includeEnforcedOptions) {
          const [send, sendAndCall] = await Promise.all([
            provider
              .callMethod<string>(address, enforcedOptionsFragment, [
                eid,
                MSG_TYPE_SEND,
              ])
              .catch(() => undefined),
            provider
              .callMethod<string>(address, enforcedOptionsFragment, [
                eid,
                MSG_TYPE_SEND_AND_CALL,
              ])
              .catch(() => undefined),
          ])
          entry.enforcedOptions = {
            send: send ?? '0x',
            sendAndCall: sendAndCall ?? '0x',
          }
        }

        perEid[String(eid)] = entry
      }

      const value: Record<string, unknown> = { perEid }
      if (delegate) {
        value.delegate = prefixAddress(chain, delegate)
      }
      return { field: this.field, value: value as never }
    } catch (e) {
      return {
        field: this.field,
        error: e instanceof Error ? e.message : 'Unknown error',
      }
    }
  }
}

async function readConfigBytes(
  provider: IProvider,
  endpoint: ChainSpecificAddress,
  oapp: string,
  lib: string,
  eid: number,
  configType: number,
): Promise<string | undefined> {
  const raw = await provider
    .callMethod<string>(endpoint, getConfigFragment, [
      oapp,
      lib,
      eid,
      configType,
    ])
    .catch(() => undefined)
  if (!raw || raw === '0x') return undefined
  return raw
}

function decodeUlnConfig(hex: string, chain: string) {
  const [decoded] = utils.defaultAbiCoder.decode([ULN_TUPLE], hex) as [
    {
      confirmations: BigNumber
      requiredDVNCount: number
      optionalDVNCount: number
      optionalDVNThreshold: number
      requiredDVNs: string[]
      optionalDVNs: string[]
    },
  ]
  return {
    confirmations: decoded.confirmations.toString(),
    requiredDVNCount: decoded.requiredDVNCount,
    optionalDVNCount: decoded.optionalDVNCount,
    optionalDVNThreshold: decoded.optionalDVNThreshold,
    requiredDVNs: decoded.requiredDVNs.map((a) => prefixAddress(chain, a)),
    optionalDVNs: decoded.optionalDVNs.map((a) => prefixAddress(chain, a)),
  }
}

function decodeExecutorConfig(hex: string, chain: string) {
  const [decoded] = utils.defaultAbiCoder.decode([EXECUTOR_TUPLE], hex) as [
    { maxMessageSize: number; executor: string },
  ]
  return {
    maxMessageSize: decoded.maxMessageSize,
    executor: prefixAddress(chain, decoded.executor),
  }
}

function prefixAddress(chain: string, addr: string): string {
  return ChainSpecificAddress.from(chain, EthereumAddress(addr)).toString()
}
