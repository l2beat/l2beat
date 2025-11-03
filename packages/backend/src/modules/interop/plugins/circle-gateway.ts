/*
Circle Gateway plugin
Note - here the transfer of USDC is via burn/mint, but mint on DST happens before burn on SRC.
*/

import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV2Config } from './cctp/cctp.config'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseAttestationUsed = createEventParser(
  'event AttestationUsed(address indexed token, address indexed recipient, bytes32 indexed transferSpecHash, uint32 sourceDomain, bytes32 sourceDepositor, bytes32 sourceSigner, uint256 value)',
)

const parseGatewayBurned = createEventParser(
  'event GatewayBurned(address indexed token, address indexed depositor, bytes32 indexed transferSpecHash, uint32 destinationDomain, bytes32 destinationRecipient, address signer, uint256 value, uint256 fee, uint256 fromAvailable, uint256 fromWithdrawing)',
)

export const AttestationUsed = createInteropEventType<{
  token: Address32
  transferSpecHash: `0x${string}`
  $dstChain: string
  value: string
}>('circle-gateway.AttestationUsed')

export const GatewayBurned = createInteropEventType<{
  token: Address32
  transferSpecHash: `0x${string}`
  $srcChain: string
  value: string
}>('circle-gateway.GatewayBurned')

export class CircleGatewayPlugIn implements InteropPlugin {
  name = 'circle-gateway'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const networks = this.configs.get(CCTPV2Config)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    const gatewayBurned = parseGatewayBurned(input.log, null)
    if (gatewayBurned)
      return [
        GatewayBurned.create(input.ctx, {
          token: Address32.from(gatewayBurned.token),
          transferSpecHash: gatewayBurned.transferSpecHash,
          $srcChain: findChain(
            networks,
            (x) => x.domain,
            Number(gatewayBurned.destinationDomain), // yes, that's not a mistake
          ),
          value: gatewayBurned.value.toString(),
        }),
      ]

    const attestationUsed = parseAttestationUsed(input.log, null)
    if (attestationUsed)
      return [
        AttestationUsed.create(input.ctx, {
          token: Address32.from(attestationUsed.token),
          transferSpecHash: attestationUsed.transferSpecHash,
          $dstChain: findChain(
            networks,
            (x) => x.domain,
            Number(attestationUsed.sourceDomain), // yes, that's not a mistake
          ),
          value: attestationUsed.value.toString(),
        }),
      ]
  }

  matchTypes = [GatewayBurned]
  match(
    gatewayBurned: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (GatewayBurned.checkType(gatewayBurned)) {
      const attestationUsed = db.find(AttestationUsed, {
        transferSpecHash: gatewayBurned.args.transferSpecHash,
      })
      if (!attestationUsed) {
        return
      }

      return [
        Result.Message('circle-gateway.Message', {
          app: 'circle-gateway',
          srcEvent: attestationUsed,
          dstEvent: gatewayBurned,
        }),
        Result.Transfer('circle-gateway.Transfer', {
          // NOTE: TRANSFER has an opposite direction than MESSAGE
          srcEvent: gatewayBurned,
          srcTokenAddress: gatewayBurned.args.token,
          srcAmount: BigInt(gatewayBurned.args.value),
          dstEvent: attestationUsed,
          dstAmount: BigInt(attestationUsed.args.value),
          dstTokenAddress: attestationUsed.args.token,
        }),
      ]
    }
  }
}
