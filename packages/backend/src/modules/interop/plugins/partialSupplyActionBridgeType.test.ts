import { expect } from 'earl'
import { getBestEffortBridgeTypeFromPartialSupplyAction } from './partialSupplyActionBridgeType'

describe(getBestEffortBridgeTypeFromPartialSupplyAction.name, () => {
  it('returns burnAndMint when the source token was burned', () => {
    const result = getBestEffortBridgeTypeFromPartialSupplyAction({
      srcWasBurned: true,
      dstWasMinted: undefined,
    })

    expect(result).toEqual('burnAndMint')
  })

  it('returns lockAndMint when the source token was not burned', () => {
    const result = getBestEffortBridgeTypeFromPartialSupplyAction({
      srcWasBurned: false,
      dstWasMinted: undefined,
    })

    expect(result).toEqual('lockAndMint')
  })

  it('returns burnAndMint when the destination token was minted', () => {
    const result = getBestEffortBridgeTypeFromPartialSupplyAction({
      srcWasBurned: undefined,
      dstWasMinted: true,
    })

    expect(result).toEqual('burnAndMint')
  })

  it('returns lockAndMint when the destination token was not minted', () => {
    const result = getBestEffortBridgeTypeFromPartialSupplyAction({
      srcWasBurned: undefined,
      dstWasMinted: false,
    })

    expect(result).toEqual('lockAndMint')
  })

  it('returns undefined when the supply action is unknown', () => {
    const result = getBestEffortBridgeTypeFromPartialSupplyAction({
      srcWasBurned: undefined,
      dstWasMinted: undefined,
    })

    expect(result).toEqual(undefined)
  })
})
