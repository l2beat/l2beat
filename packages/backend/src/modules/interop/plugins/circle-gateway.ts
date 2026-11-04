/*
Circle Gateway plugin
Note - here the transfer of USDC is via burn/mint, but mint on DST happens before burn on SRC.
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV2Config } from './cctp/cctp.config'
import {
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

// https://developers.circle.com/gateway/references/contract-addresses
// Same addresses on every supported chain
const GATEWAY_WALLET = EthereumAddress(
  '0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE',
)
const GATEWAY_MINTER = EthereumAddress(
  '0x2222222d7164433c4C09B0b0D809a9b52C04C205',
)

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
  value: bigint
}>('circle-gateway.AttestationUsed', { direction: 'incoming' })

export const GatewayBurned = createInteropEventType<{
  token: Address32
  transferSpecHash: `0x${string}`
  $srcChain: string
  value: bigint
}>('circle-gateway.GatewayBurned', { direction: 'outgoing' })

export class CircleGatewayPlugIn implements InteropPlugin {
  readonly name = 'circle-gateway'

  constructor(
    private configs: InteropConfigStore,
    private oneSidedChains: string[] = [],
  ) {}

  capture(input: LogToCapture) {
    const networks = this.configs.get(CCTPV2Config)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) return

    const gatewayBurned = parseGatewayBurned(input.log, [GATEWAY_WALLET])
    if (gatewayBurned)
      return [
        GatewayBurned.create(input, {
          token: Address32.from(gatewayBurned.token),
          transferSpecHash: gatewayBurned.transferSpecHash,
          $srcChain: findChain(
            networks,
            (x) => x.domain,
            Number(gatewayBurned.destinationDomain), // yes, that's not a mistake
          ),
          value: gatewayBurned.value,
        }),
      ]

    const attestationUsed = parseAttestationUsed(input.log, [GATEWAY_MINTER])
    if (attestationUsed)
      return [
        AttestationUsed.create(input, {
          token: Address32.from(attestationUsed.token),
          transferSpecHash: attestationUsed.transferSpecHash,
          $dstChain: findChain(
            networks,
            (x) => x.domain,
            Number(attestationUsed.sourceDomain), // yes, that's not a mistake
          ),
          value: attestationUsed.value,
        }),
      ]
  }

  matchTypes = [GatewayBurned, AttestationUsed]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (GatewayBurned.checkType(event)) {
      const gatewayBurned = event
      const attestationUsed = db.find(AttestationUsed, {
        transferSpecHash: gatewayBurned.args.transferSpecHash,
      })
      if (!attestationUsed) {
        // $srcChain is the message source, i.e. the transfer destination
        const dstChain = gatewayBurned.args.$srcChain
        if (!this.oneSidedChains.includes(dstChain)) return

        return [
          Result.Transfer('circle-gateway.Transfer', {
            srcEvent: gatewayBurned,
            srcTokenAddress: gatewayBurned.args.token,
            srcAmount: gatewayBurned.args.value,
            dstChain,
            dstWasMinted: true,
            srcWasBurned: true,
          }),
        ]
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
          srcAmount: gatewayBurned.args.value,
          dstEvent: attestationUsed,
          dstAmount: attestationUsed.args.value,
          dstTokenAddress: attestationUsed.args.token,
          dstWasMinted: true,
          srcWasBurned: true,
        }),
      ]
    }

    if (AttestationUsed.checkType(event)) {
      // $dstChain is the message destination, i.e. the transfer source
      const srcChain = event.args.$dstChain
      if (!this.oneSidedChains.includes(srcChain)) return

      return [
        Result.Transfer('circle-gateway.Transfer', {
          srcChain,
          dstEvent: event,
          dstAmount: event.args.value,
          dstTokenAddress: event.args.token,
          dstWasMinted: true,
          srcWasBurned: true,
        }),
      ]
    }
  }
}
