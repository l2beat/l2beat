import { assert } from '@l2beat/shared-pure'

export function calculateCallDataGasUsed(inputData: string): number {
  assert(
    inputData.startsWith('0x') || /^(0x)?[0-9a-fA-F]+$/.test(inputData),
    'Invalid input data',
  )

  const bytesData = Array.from(Buffer.from(inputData.slice(2), 'hex'))

  const zeroBytes = bytesData.filter((byte) => byte === 0).length
  const nonZeroBytes = bytesData.length - zeroBytes

  const callDataGasUsed = zeroBytes * 4 + nonZeroBytes * 16

  return callDataGasUsed
}
