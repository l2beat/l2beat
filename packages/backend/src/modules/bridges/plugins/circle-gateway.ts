/*
Circle Gateway plugin
Note - here the transfer of USDC is via burn/mint, but mint on DST happens before burn on SRC.
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { CCTP_NETWORKS } from './cctp'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  findChain,
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

export const AttestationUsed = createBridgeEventType<{
  token: EthereumAddress
  transferSpecHash: `0x${string}`
  $dstChain: string
  value: string
}>('circle-gateway.AttestationUsed')

export const GatewayBurned = createBridgeEventType<{
  token: EthereumAddress
  transferSpecHash: `0x${string}`
  $srcChain: string
  value: string
}>('circle-gateway.GatewayBurned')

export class CircleGatewayPlugIn implements BridgePlugin {
  name = 'circle-gateway'

  capture(input: LogToCapture) {
    const gatewayBurned = parseGatewayBurned(input.log, null)
    if (gatewayBurned)
      return GatewayBurned.create(input.ctx, {
        token: EthereumAddress(gatewayBurned.token),
        transferSpecHash: gatewayBurned.transferSpecHash,
        $srcChain: findChain(
          CCTP_NETWORKS,
          (x) => x.cctpdomain,
          Number(gatewayBurned.destinationDomain), // yes, that's not a mistake
        ),
        value: gatewayBurned.value.toString(),
      })

    const attestationUsed = parseAttestationUsed(input.log, null)
    if (attestationUsed)
      return AttestationUsed.create(input.ctx, {
        token: EthereumAddress(attestationUsed.token),
        transferSpecHash: attestationUsed.transferSpecHash,
        $dstChain: findChain(
          CCTP_NETWORKS,
          (x) => x.cctpdomain,
          Number(attestationUsed.sourceDomain), // yes, that's not a mistake
        ),
        value: attestationUsed.value.toString(),
      })
  }

  matchTypes = [GatewayBurned]
  match(
    gatewayBurned: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (GatewayBurned.checkType(gatewayBurned)) {
      const attestationUsed = db.find(AttestationUsed, {
        transferSpecHash: gatewayBurned.args.transferSpecHash,
      })
      if (!attestationUsed) {
        return
      }

      return [
        Result.Message('circle-gateway.Message', [
          attestationUsed,
          gatewayBurned,
        ]),
        Result.Transfer('circle-gateway.Transfer', {
          // NOTE: TRANSFER has an opposite direction than MESSAGE
          srcEvent: gatewayBurned,
          srcTokenAddress: gatewayBurned.args.token,
          srcAmount: gatewayBurned.args.value,
          dstEvent: attestationUsed,
          dstAmount: attestationUsed.args.value,
          dstTokenAddress: attestationUsed.args.token,
        }),
      ]
    }
  }
}
