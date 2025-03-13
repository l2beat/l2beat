import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DataStorage } from '../tools/DataStorage'
import { createAmountConfig } from '../tools/extractPricesAndAmounts'
import {
  type BalanceOfEscrowAmountFormula,
  type CalculationFormula,
  type ConstAmountFormula,
  type ProjectTvsConfig,
  type Token,
  TokenId,
  type TokenValue,
  type TotalSupplyAmountFormula,
} from '../types'
import { ValueService } from './ValueService'

describe(ValueService.name, () => {
  describe(ValueService.prototype.calculate.name, () => {
    it('should calculate TVS - simple scenario', async () => {
      const priceId = 'price-ABCD'

      const amountFormula = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
      } as TotalSupplyAmountFormula

      const amountConfigId = createAmountConfig(amountFormula).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<Token>({
            id: TokenId('tokenId'),
            priceId,
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
          .resolvesToOnce(10000n)
          .resolvesToOnce(10000n),
        getPrice: mockFn()
          .given(priceId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual(
        new Map<number, TokenValue[]>([
          [
            mockTimestamp,
            [
              {
                tokenConfig: tvsConfig.tokens[0],
                amount: 10000,
                projectId: ProjectId('project'),
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
        decimals: 0,
      } as TotalSupplyAmountFormula

      const wBTCAmountConfigId = createAmountConfig(wBTCAmountFormula).id

      const solvBTCAmountFormula = {
        type: 'totalSupply',
        address: solvBTCContractAddress,
        chain: 'bob',
        decimals: 0,
      } as TotalSupplyAmountFormula

      const solvBTCAmountConfigId = createAmountConfig(solvBTCAmountFormula).id

      const wBTCBalanceOfEscrowFormula = {
        type: 'balanceOfEscrow',
        address: wBTCContractAddress,
        chain: 'bob',
        decimals: 0,
        escrowAddress: solvBTCEscrowAddress,
      } as BalanceOfEscrowAmountFormula

      const wBTCBalanceOfEscrowConfigId = createAmountConfig(
        wBTCBalanceOfEscrowFormula,
      ).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('bob'),
        tokens: [
          // WBTC with amount formula as totalSupply on L2
          mockObject<Token>({
            id: TokenId('WBTC'),
            priceId: 'price-WBTC',
            amount: wBTCAmountFormula,
            valueForProject: undefined,
            valueForTotal: undefined,
          }),
          // solvBTC with
          // - amount formula as totalSupply on L2
          // - valueForProject formula as totalSupply of solvBTC on L2 - balance of WBTC locked in solvBTC escrow
          mockObject<Token>({
            id: TokenId('solvBTC'),
            priceId: 'price-solvBTC',
            amount: solvBTCAmountFormula,
            valueForProject: {
              type: 'calculation',
              operator: 'diff',
              arguments: [
                {
                  type: 'value',
                  amount: solvBTCAmountFormula,
                  priceId: 'price-solvBTC',
                },
                {
                  type: 'value',
                  amount: wBTCBalanceOfEscrowFormula,
                  priceId: 'price-WBTC',
                },
              ],
            },
            valueForTotal: undefined,
          }),
        ],
      })

      const wBTCPriceConfigId = 'price-WBTC'

      const solvBTCPriceConfigId = 'price-solvBTC'

      const mockTimestamp = UnixTime.now()

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          // totalSupply of WBTC
          .given(wBTCAmountConfigId, mockTimestamp)
          .resolvesToOnce(10000n)
          .resolvesToOnce(10000n)
          // totalSupply of solvBTC
          .given(solvBTCAmountConfigId, mockTimestamp)
          .resolvesToOnce(8000n)
          .resolvesToOnce(8000n)
          .resolvesToOnce(8000n)
          // balanceOfEscrow of WBTC in solvBTC escrow
          .given(wBTCBalanceOfEscrowConfigId, mockTimestamp)
          .resolvesToOnce(5000n),
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
            mockTimestamp,
            [
              {
                tokenConfig: tvsConfig.tokens[0],
                projectId: ProjectId('bob'),
                amount: 10000,
                value: 2000000,
                valueForProject: 2000000,
                valueForTotal: 2000000,
              },
              {
                tokenConfig: tvsConfig.tokens[1],
                projectId: ProjectId('bob'),
                amount: 8000,
                value: 1600000,
                valueForProject: 600000,
                valueForTotal: 600000,
              },
            ],
          ],
        ]),
      )
    })

    it('should calculate TVS - amount as minimum of const and dynamic value', async () => {
      const priceId = 'price-ABCD'

      const amountFormula = {
        type: 'calculation',
        operator: 'min',
        arguments: [
          {
            type: 'const',
            value: '20000',
            decimals: 0,
          } as ConstAmountFormula,
          {
            type: 'totalSupply',
            address: EthereumAddress.random(),
            chain: 'chain',
            decimals: 0,
          } as TotalSupplyAmountFormula,
        ],
      } as CalculationFormula

      const amountConfigId = createAmountConfig(
        amountFormula.arguments[1] as TotalSupplyAmountFormula,
      ).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<Token>({
            id: TokenId('tokenId'),
            priceId,
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
          .resolvesToOnce(10000n)
          .resolvesToOnce(10000n),
        getPrice: mockFn()
          .given(priceId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual(
        new Map<number, TokenValue[]>([
          [
            mockTimestamp,
            [
              {
                tokenConfig: tvsConfig.tokens[0],
                amount: 10000,
                projectId: ProjectId('project'),
                value: 2000000,
                valueForProject: 2000000,
                valueForTotal: 2000000,
              },
            ],
          ],
        ]),
      )
    })
  })
})
