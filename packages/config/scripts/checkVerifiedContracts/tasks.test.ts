import { EtherscanClient, Logger } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { verifyContracts } from './tasks'

describe('checkVerifiedContracts:tasks', () => {
  describe('verifyContracts()', () => {
    it('correctly verifies contracts not included in previouslyVerified', async () => {
      let etherscanCalls = 0
      const EthereumClientMock = {
        getContractSource: async (address: EthereumAddress) => {
          etherscanCalls++
          return { SourceCode: address[2] === '1' ? 'function(){}' : '' }
        },
      }

      const addressVerificationMap = await verifyContracts(
        [
          '0x1111111111111111111111111111111111111111',
          '0x2222222222222222222222222222222222222222',
          '0x3333333333333333333333333333333333333333',
          '0x4444444444444444444444444444444444444444',
          '0x5555555555555555555555555555555555555555',
        ].map(EthereumAddress),
        // previously verified:
        new Set([
          EthereumAddress('0x3333333333333333333333333333333333333333'),
        ]),
        // manually verified:
        new Set([
          EthereumAddress('0x5555555555555555555555555555555555555555'),
        ]),
        EthereumClientMock as unknown as EtherscanClient,
        2,
        Logger.SILENT,
      )

      expect(etherscanCalls).toEqual(3)
      expect(addressVerificationMap).toEqual({
        '0x1111111111111111111111111111111111111111': true,
        '0x2222222222222222222222222222222222222222': false,
        '0x3333333333333333333333333333333333333333': true,
        '0x4444444444444444444444444444444444444444': false,
        '0x5555555555555555555555555555555555555555': true,
      })
    })

    it('fails on any error in any task', async () => {
      // we need to mock clock here because retries are async
      const clock = install()

      const EthereumClientMock = {
        getContractSource: async (_: EthereumAddress) => {
          throw new Error('An error occured')
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
        new Set(),
        EthereumClientMock as unknown as EtherscanClient,
        2,
        Logger.SILENT,
      )
      await clock.runAllAsync()

      await expect(result).toBeRejected()

      clock.uninstall()
    })
  })
})
