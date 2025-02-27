import type { Block } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { StarknetUopsAnalyzer } from './StarknetUopsAnalyzer'

describe(StarknetUopsAnalyzer.name, () => {
  const analyzer = new StarknetUopsAnalyzer()

  describe(StarknetUopsAnalyzer.prototype.calculateUops.name, () => {
    it('gets the operations count', () => {
      const block = mockObject<Block>({
        number: 3001,
        transactions: [
          mockTx('DEPLOY_ACCOUNT'),
          mockTx('INVOKE', ['0x1', '0x12123']),
          mockTx('INVOKE', ['0x2', '0x12123']),
          mockTx('INVOKE', ['0x3', '0x12123']),
        ],
      })
      const uops = analyzer.calculateUops(block)

      expect(uops).toEqual(7)
    })
  })

  describe(StarknetUopsAnalyzer.prototype.getOperationsCount.name, () => {
    it('should handle DEPLOY_ACCOUNT transaction', () => {
      const tx = mockTx('DEPLOY_ACCOUNT')

      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle block number lower than 3000', () => {
      const tx = mockTx('abc')
      const result = analyzer.getOperationsCount(tx, 100)
      expect(result).toEqual(1)
    })

    it('should handle tx other than INVOKE', () => {
      const tx = mockTx('abc')
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle tx INVOKE without calldata', () => {
      const tx = mockTx('INVOKE')
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(1)
    })

    it('should handle tx INVOKE with calldata', () => {
      const tx = mockTx('INVOKE', ['0x3', '0x12123'])
      const result = analyzer.getOperationsCount(tx, 3001)
      expect(result).toEqual(3)
    })
  })
})

function mockTx(type: string, data?: string[]) {
  return {
    type,
    data,
    hash: '0x0',
  }
}
