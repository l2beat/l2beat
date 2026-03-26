import { utils } from 'ethers'

export interface DerivedPortalDeposit {
  sourceHash: `0x${string}`
  l2TxHash: `0x${string}`
  mint: bigint
  value: bigint
  gasLimit: bigint
  isCreation: boolean
  data: string
}

// `opaqueData` is packed by the portal, so version 0 must be decoded manually.
export function derivePortalDeposit(params: {
  from: string
  to: string
  version: bigint
  opaqueData: string
  blockHash: string
  logIndex: number
}): DerivedPortalDeposit | undefined {
  if (params.version !== 0n) {
    return
  }

  const opaqueData = utils.arrayify(params.opaqueData)
  const minimumLength = 32 + 32 + 8 + 1
  if (opaqueData.length < minimumLength) {
    return
  }

  const mint = BigInt(utils.hexlify(opaqueData.slice(0, 32)))
  const value = BigInt(utils.hexlify(opaqueData.slice(32, 64)))
  const gasLimit = BigInt(utils.hexlify(opaqueData.slice(64, 72)))
  const isCreation = opaqueData[72] !== 0
  const data = utils.hexlify(opaqueData.slice(73))

  const depositIdHash = utils.keccak256(
    utils.solidityPack(
      ['bytes32', 'uint256'],
      [params.blockHash, params.logIndex],
    ),
  )
  const sourceHash = utils.keccak256(
    utils.solidityPack(
      ['bytes32', 'bytes32'],
      [utils.hexZeroPad('0x', 32), depositIdHash],
    ),
  ) as `0x${string}`
  const l2TxHash = utils.keccak256(
    utils.hexConcat([
      '0x7e',
      utils.RLP.encode([
        sourceHash,
        params.from,
        isCreation ? '0x' : params.to,
        toMinimalHex(mint),
        toMinimalHex(value),
        toMinimalHex(gasLimit),
        '0x',
        data,
      ]),
    ]),
  ) as `0x${string}`

  return {
    sourceHash,
    l2TxHash,
    mint,
    value,
    gasLimit,
    isCreation,
    data,
  }
}

function toMinimalHex(value: bigint): string {
  return utils.hexlify(utils.stripZeros(utils.arrayify(utils.hexlify(value))))
}
