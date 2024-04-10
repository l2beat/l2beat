import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../../peripherals/starknet/StarknetClient'
import { LivenessRepository } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { StarknetFinalityAnalyzer } from './StarknetFinalityAnalyzer'

describe(StarknetFinalityAnalyzer.name, () => {
  describe(StarknetFinalityAnalyzer.prototype.getFinality.name, () => {
    it('should return timestamp differences between l1 and l2 blocks', async () => {
      const TX_HASH =
        '0xd9ac85a5a989aaa9e238065f5a3e7f0d59f4836ab0796c2a356bb52384190b80'
      const L1_TIMESTAMP = 1800000000

      /**
       * @see mockBytesResponse
       */
      const L2_BLOCK = 629481
      const L2_TIMESTAMP = 1712099039

      const l2Client = mockObject<StarknetClient>({
        getBlock: mockFn().resolvesTo({
          timestamp: new UnixTime(L2_TIMESTAMP),
        }),
      })

      const projectId = ProjectId('scroll')
      const rpcClient = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: mockBytesResponse,
        }),
      })
      const livenessRepository = mockObject<LivenessRepository>({})

      const analyzer = new StarknetFinalityAnalyzer(
        rpcClient,
        livenessRepository,
        projectId,
        l2Client,
      )

      const result = await analyzer.getFinality({
        txHash: TX_HASH,
        timestamp: new UnixTime(L1_TIMESTAMP),
      })

      expect(result).toEqual([L1_TIMESTAMP - L2_TIMESTAMP])
      expect(l2Client.getBlock).toHaveBeenNthCalledWith(1, L2_BLOCK)
    })
  })
})

/**
 * Slice of actual transcation under hash `0x19e3dfcb0c99fbd9b53a6b74b3f446da216aef7bfbb1033c888fe26a330f4626`
 * Program output array has been reduced to contain at most slot with block number (3 items)
 * KZG Proof replaced with 0xdeadbeef since it is irrelevant
 *
 * Block preserved: 629481
 * Timestamp of preserved block: 1712099039
 * */
const mockBytesResponse =
  '0xb72d42a1000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003031371df81e0c22970165f5b9bc341a94c365b0d47875b7330105ac4888a2153046a819fb3896105879335e473a4467d6959c6c3a0834b9fb7250d2a62887c5b0000000000000000000000000000000000000000000000000000000000099ae90000000000000000000000000000000000000000000000000000000000000004deadbeef00000000000000000000000000000000000000000000000000000000'
