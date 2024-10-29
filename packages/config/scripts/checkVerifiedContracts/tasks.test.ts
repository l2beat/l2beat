import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'

import { BlockIndexerClient } from '@l2beat/shared'
import { providers } from 'ethers'
import { verifyContracts } from './tasks'

const MockProvider = mockObject<providers.JsonRpcProvider>({
  getCode: async (address: string) => {
    // Return '' (EOA) for address 0x666....
    return address[2] === '6' ? '' : '1234'
  },
})

describe('checkVerifiedContracts:tasks', () => {
  describe('verifyContracts()', () => {
    it('correctly verifies contracts not included in previouslyVerified', async () => {
      let etherscanCalls = 0
      const EthereumClientMock = {
        call: async (_: string, __: string, params: Record<string, string>) => {
          etherscanCalls++
          return [
            { SourceCode: params['address'][2] === '1' ? 'function(){}' : '' },
          ]
        },
      }

      const addressVerificationMap = await verifyContracts(
        [
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222',
          '0x3333333333333333333333333333333333333333',
          '0x4444444444444444444444444444444444444444',
          '0x5555555555555555555555555555555555555555',
          '0x6666666666666666666666666666666666666666',
        ].map(EthereumAddress),
        // previously verified:
        new Set([
          EthereumAddress('0x3333333333333333333333333333333333333333'),
        ]),
        // manually verified:
        {
          '0x5555555555555555555555555555555555555555': 'https://example.com',
        },
        EthereumClientMock as unknown as BlockIndexerClient,
        MockProvider,
        2,
        Logger.SILENT,
      )

      expect(etherscanCalls).toEqual(4)
      expect(addressVerificationMap).toEqual({
        '0x1111111111111111111111111111111111111111': true,
        '0x2222222222222222222222222222222222222222': false,
        '0x3333333333333333333333333333333333333333': true,
        '0x4444444444444444444444444444444444444444': false,
        '0x5555555555555555555555555555555555555555': true,
        '0x6666666666666666666666666666666666666666': true,
      })
    })

    it('fails on any error in any task', async () => {
      // we need to mock clock here because retries are async
      const clock = install()

      const EthereumClientMock = {
        call: async (_: EthereumAddress) => {
          throw new Error('An error occurred')
        },
      }

      const result = verifyContracts(
        [
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222',
          '0x3333333333333333333333333333333333333333',
          '0x4444444444444444444444444444444444444444',
        ].map(EthereumAddress),
        new Set(),
        {},
        EthereumClientMock as unknown as BlockIndexerClient,
        MockProvider,
        2,
        Logger.SILENT,
      )
      await clock.runAllAsync()

      await expect(result).toBeRejected()

      clock.uninstall()
    })
  })
})
