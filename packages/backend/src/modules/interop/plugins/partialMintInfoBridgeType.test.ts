import { expect } from 'earl'
import { getBestEffortBridgeTypeFromPartialMintInfo } from './partialMintInfoBridgeType'

describe(getBestEffortBridgeTypeFromPartialMintInfo.name, () => {
  it('returns burnAndMint when the source token was burned', () => {
    const result = getBestEffortBridgeTypeFromPartialMintInfo({
      srcWasBurned: true,
      dstWasMinted: undefined,
    })

    expect(result).toEqual('burnAndMint')
  })

  it('returns lockAndMint when the source token was not burned', () => {
    const result = getBestEffortBridgeTypeFromPartialMintInfo({
      srcWasBurned: false,
      dstWasMinted: undefined,
    })

    expect(result).toEqual('lockAndMint')
  })

  it('returns burnAndMint when the destination token was minted', () => {
    const result = getBestEffortBridgeTypeFromPartialMintInfo({
      srcWasBurned: undefined,
      dstWasMinted: true,
    })

    expect(result).toEqual('burnAndMint')
  })

  it('returns lockAndMint when the destination token was not minted', () => {
    const result = getBestEffortBridgeTypeFromPartialMintInfo({
      srcWasBurned: undefined,
      dstWasMinted: false,
    })

    expect(result).toEqual('lockAndMint')
  })
})
