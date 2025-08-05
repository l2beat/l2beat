import type { EthereumAddress } from '@l2beat/shared-pure'

export function createWormholeSequence(
  emitterChainId: number,
  emitterAddress: EthereumAddress,
  sequence: bigint,
) {
  return `${emitterChainId}_${emitterAddress}_${sequence}`
}

// For now we skip differentiation between Transfer and TransferWithPayload
// https://etherscan.deth.net/address/0x3ee18b2214aff97000d974cf647e7c347e8fa585
export function decodeWormholeTransfer(payload: string) {
  // Remove '0x' prefix if present
  const data = payload.startsWith('0x') ? payload.slice(2) : payload

  // Convert hex string to buffer for easier parsing
  const buffer = Buffer.from(data, 'hex')

  let offset = 0

  // Parse payloadID (uint8 - 1 byte)
  const payloadID = buffer.readUInt8(offset)
  offset += 1
  console.log(payloadID)

  // Parse amount (uint256 - 32 bytes)
  const amount = BigInt(
    '0x' + buffer.slice(offset, offset + 32).toString('hex'),
  )
  offset += 32
  console.log(amount)

  // Parse tokenAddress (bytes32 - 32 bytes)
  const tokenAddress = '0x' + buffer.slice(offset, offset + 32).toString('hex')
  offset += 32
  console.log(tokenAddress)

  // Parse tokenChain (uint16 - 2 bytes)
  const tokenChain = buffer.readUInt16BE(offset)
  offset += 2
  console.log(tokenChain)

  // Parse to (bytes32 - 32 bytes)
  const to = '0x' + buffer.slice(offset, offset + 32).toString('hex')
  offset += 32
  console.log(to)

  // Parse toChain (uint16 - 2 bytes)
  const toChain = buffer.readUInt16BE(offset)
  offset += 2
  console.log(toChain)

  return {
    payloadID,
    amount,
    tokenAddress,
    tokenChain,
    to,
    toChain,
  }
}
