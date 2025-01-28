import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DataStorage } from './DataStorage'
import { ValueService } from './ValueService'
import { createAmountConfig } from './mapConfig'
import {
  type BalanceOfEscrowAmountFormula,
  type Token,
  TokenId,
  type TokenValue,
  type TotalSupplyAmountFormula,
  type TvsConfig,
} from './types'

describe(ValueService.name, () => {
  describe(ValueService.prototype.calculate.name, () => {
    it('should calculate TVS - simple scenario', async () => {
      const ticker = 'ABCD'

      const amountFormula = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 18,
      } as TotalSupplyAmountFormula

      const amountConfigId = createAmountConfig(amountFormula).id

      const tvsConfig = mockObject<TvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<Token>({
            id: TokenId('tokeId'),
            ticker,
            amount: amountFormula,
            valueForProject: undefined,
            valueForTotal: undefined,
          }),
        ],
      })

      const mockTimestamp = UnixTime.now()

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(amountConfigId, mockTimestamp)
          .resolvesToOnce(10000)
          .resolvesToOnce(10000),
        getPrice: mockFn()
          .given(ticker, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual(
        new Map<number, TokenValue[]>([
          [
            mockTimestamp.toNumber(),
            [
              {
                amount: 10000,
                projectId: ProjectId('project'),
                tokenId: 'tokeId',
                value: 2000000,
                valueForProject: 2000000,
                valueForTotal: 2000000,
              },
            ],
          ],
        ]),
      )
    })

    it('should calculate TVS - wrapped token (solvBTC)', async () => {
      const wBTCContractAddress = EthereumAddress(
        '0x10e4C3460310a2F4b56C8DB0b3806Be29B15c15E',
      )
      const solvBTCContractAddress = EthereumAddress(
        '0x6E50888634562713c5F8f8AA650807cDc67Fc363',
      )
      const solvBTCEscrowAddress = EthereumAddress(
        '0xA9cF190a5b7daE4CB1b3BD68fABf310cf1982185',
      )

      const wBTCAmountFormula = {
        type: 'totalSupply',
        address: wBTCContractAddress,
        chain: 'bob',
        decimals: 18,
      } as TotalSupplyAmountFormula

      const wBTCAmountConfigId = createAmountConfig(wBTCAmountFormula).id

      const solvBTCAmountFormula = {
        type: 'totalSupply',
        address: solvBTCContractAddress,
        chain: 'bob',
        decimals: 18,
      } as TotalSupplyAmountFormula

      const solvBTCAmountConfigId = createAmountConfig(solvBTCAmountFormula).id

      const wBTCBalanceOfEscrowFormula = {
        type: 'balanceOfEscrow',
        address: wBTCContractAddress,
        chain: 'bob',
        decimals: 18,
        escrowAddress: solvBTCEscrowAddress,
      } as BalanceOfEscrowAmountFormula

      const wBTCBalanceOfEscrowConfigId = createAmountConfig(
        wBTCBalanceOfEscrowFormula,
      ).id

      const tvsConfig = mockObject<TvsConfig>({
        projectId: ProjectId('bob'),
        tokens: [
          // WBTC with amount formula as totalSupply on L2
          mockObject<Token>({
            id: TokenId('WBTC'),
            ticker: 'WBTC',
            amount: wBTCAmountFormula,
            valueForProject: undefined,
            valueForTotal: undefined,
          }),
          // solvBTC with
          // - amount formula as totalSupply on L2
          // - valueForProject formula as totalSupply of solvBTC on L2 - balance of WBTC locked in solvBTC escrow
          mockObject<Token>({
            id: TokenId('solvBTC'),
            ticker: 'solvBTC',
            amount: solvBTCAmountFormula,
            valueForProject: {
              type: 'calculation',
              operator: 'diff',
              arguments: [
                {
                  type: 'value',
                  amount: solvBTCAmountFormula,
                  ticker: 'solvBTC',
                },
                {
                  type: 'value',
                  amount: wBTCBalanceOfEscrowFormula,
                  ticker: 'WBTC',
                },
              ],
            },
            valueForTotal: undefined,
          }),
        ],
      })

      const wBTCPriceConfigId = 'WBTC'

      const solvBTCPriceConfigId = 'solvBTC'

      const mockTimestamp = UnixTime.now()

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          // totalSupply of WBTC
          .given(wBTCAmountConfigId, mockTimestamp)
          .resolvesToOnce(10000)
          .resolvesToOnce(10000)
          // totalSupply of solvBTC
          .given(solvBTCAmountConfigId, mockTimestamp)
          .resolvesToOnce(8000)
          .resolvesToOnce(8000)
          .resolvesToOnce(8000)
          // balanceOfEscrow of WBTC in solvBTC escrow
          .given(wBTCBalanceOfEscrowConfigId, mockTimestamp)
          .resolvesToOnce(5000),
        getPrice: mockFn()
          // price of WBTC
          .given(wBTCPriceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200)
          // price of solvBTC
          .given(solvBTCPriceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual(
        new Map<number, TokenValue[]>([
          [
            mockTimestamp.toNumber(),
            [
              {
                amount: 10000,
                projectId: ProjectId('bob'),
                tokenId: 'WBTC',
                value: 2000000,
                valueForProject: 2000000,
                valueForTotal: 2000000,
              },
              {
                amount: 8000,
                projectId: ProjectId('bob'),
                tokenId: 'solvBTC',
                value: 1600000,
                valueForProject: 600000,
                valueForTotal: 600000,
              },
            ],
          ],
        ]),
      )
    })
  })
})
