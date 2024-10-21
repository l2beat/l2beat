import { expect, mockObject } from 'earl'
import { StarknetTransaction } from '../../../../../peripherals/starknet/schemas'
import { StarknetUopsAnalyzer } from './StarknetUopsAnalyzer'

describe(StarknetUopsAnalyzer.name, () => {
  const analyzer = new StarknetUopsAnalyzer()

  describe(StarknetUopsAnalyzer.prototype.analyzeBlock.name, () => {
    it('gets the operations count', () => {
      const block = {
        number: 3001,
        transactions: [
          mockObject<StarknetTransaction>({
            type: 'DEPLOY_ACCOUNT',
            calldata: undefined,
          }),
          mockObject<StarknetTransaction>({
            type: 'INVOKE',
            calldata: ['0x1', '0x12123'],
          }),
          mockObject<StarknetTransaction>({
            type: 'INVOKE',
            calldata: ['0x2', '0x12123'],
          }),
          mockObject<StarknetTransaction>({
            type: 'INVOKE',
            calldata: ['0x3', '0x12123'],
          }),
        ],
      }
      const { transactionsLength, uopsLength } = analyzer.analyzeBlock(block)

      expect(transactionsLength).toEqual(4)
      expect(uopsLength).toEqual(7)
    })
  })

  describe(StarknetUopsAnalyzer.prototype.getOperationsCount.name, () => {
    it('should handle DEPLOY_ACCOUNT transaction', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'DEPLOY_ACCOUNT',
      })
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle block number lower than 3000', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'abc',
      })
      const result = analyzer.getOperationsCount(tx, 100)
      expect(result).toEqual(1)
    })

    it('should handle tx other than INVOKE', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'abc',
      })
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(0)
    })

    it('should handle tx INVOKE without calldata', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'INVOKE',
        calldata: undefined,
      })
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(0)
    })

    it('should handle tx INVOKE without calldata', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'INVOKE',
        calldata: undefined,
      })
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(0)
    })

    it('should handle tx INVOKE with calldata', () => {
      const tx = mockObject<StarknetTransaction>({
        type: 'INVOKE',
        calldata: ['0x3', '0x12123'],
      })
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(3)
    })
  })
})
