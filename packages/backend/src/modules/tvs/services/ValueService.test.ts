import { Logger } from '@l2beat/backend-tools'
import type {
  BalanceOfEscrowAmountFormula,
  CalculationFormula,
  ConstAmountFormula,
  TotalSupplyAmountFormula,
  TvsToken,
} from '@l2beat/config'
import {
  EthereumAddress,
  ProjectId,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DataStorage } from '../tools/DataStorage'
import {
  createAmountConfig,
  createPriceConfigId,
} from '../tools/extractPricesAndAmounts'
import type { ProjectTvsConfig } from '../types'
import { ValueService } from './ValueService'

describe(ValueService.name, () => {
  describe(ValueService.prototype.calculate.name, () => {
    it('should calculate TVS - simple scenario', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

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
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
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
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual([
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[0].id,
          amount: 10000,
          projectId: ProjectId('project'),
          value: 2000000,
          valueForProject: 2000000,
          valueForSummary: 2000000,
        },
      ])
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
          mockObject<TvsToken>({
            id: TokenId('WBTC'),
            priceId: 'price-WBTC',
            amount: wBTCAmountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
          // solvBTC with
          // - amount formula as totalSupply on L2
          // - valueForProject formula as totalSupply of solvBTC on L2 - balance of WBTC locked in solvBTC escrow
          mockObject<TvsToken>({
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
            valueForSummary: undefined,
          }),
        ],
      })

      const wBTCPriceConfigId = createPriceConfigId('price-WBTC')

      const solvBTCPriceConfigId = createPriceConfigId('price-solvBTC')

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

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual([
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[0].id,
          projectId: ProjectId('bob'),
          amount: 10000,
          value: 2000000,
          valueForProject: 2000000,
          valueForSummary: 2000000,
        },
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[1].id,
          projectId: ProjectId('bob'),
          amount: 8000,
          value: 1600000,
          valueForProject: 600000,
          valueForSummary: 600000,
        },
      ])
    })

    it('should calculate TVS - amount as minimum of const and dynamic value', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

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
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
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
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual([
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[0].id,
          amount: 10000,
          projectId: ProjectId('project'),
          value: 2000000,
          valueForProject: 2000000,
          valueForSummary: 2000000,
        },
      ])
    })

    it('should calculate TVS - fallback to 0 if amount not in range', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

      const mockTimestamp = UnixTime(200)

      const amountFormulaInRange = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(100),
      } as TotalSupplyAmountFormula

      const amountInRangeConfigId = createAmountConfig(amountFormulaInRange).id

      const amountFormulaNotInRange = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(50),
        untilTimestamp: UnixTime(150),
      } as TotalSupplyAmountFormula

      const amountNotInRangeConfigId = createAmountConfig(
        amountFormulaNotInRange,
      ).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: {
              type: 'calculation',
              operator: 'sum',
              arguments: [amountFormulaInRange, amountFormulaNotInRange],
            },
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
        ],
      })

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(amountInRangeConfigId, mockTimestamp)
          .resolvesToOnce(10000n)
          .resolvesToOnce(10000n)
          .given(amountNotInRangeConfigId, mockTimestamp)
          .resolvesToOnce(undefined)
          .resolvesToOnce(undefined),
        getPrice: mockFn()
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual([
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[0].id,
          amount: 10000,
          projectId: ProjectId('project'),
          value: 2000000,
          valueForProject: 2000000,
          valueForSummary: 2000000,
        },
      ])
    })

    it('should throw if price not found for timestamp', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

      const amountFormula = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(100),
        untilTimestamp: UnixTime(300),
      } as TotalSupplyAmountFormula

      const amountConfigId = createAmountConfig(amountFormula).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
        ],
      })

      const mockTimestamp = UnixTime.now()

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(amountConfigId, mockTimestamp)
          .resolvesToOnce(10000n),
        getPrice: mockFn()
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(undefined),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      await expect(
        async () => await valueService.calculate(tvsConfig, [mockTimestamp]),
      ).toBeRejected()
    })

    it('should throw if amount not found and it is within range', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

      const amountFormula = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(100),
      } as TotalSupplyAmountFormula

      const amountConfigId = createAmountConfig(amountFormula).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
        ],
      })

      const mockTimestamp = UnixTime(200)

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(amountConfigId, mockTimestamp)
          .resolvesToOnce(undefined)
          .resolvesToOnce(undefined),
        getPrice: mockFn()
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(100)
          .resolvesToOnce(100),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      await expect(
        async () => await valueService.calculate(tvsConfig, [mockTimestamp]),
      ).toBeRejectedWith(
        `Amount not found for ${amountConfigId} within configured range (timestamp: ${mockTimestamp}, since: ${amountFormula.sinceTimestamp}, until: ${amountFormula.untilTimestamp})`,
      )
    })

    it('should calculate TVS - min formula with both arguments resolving to 0', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

      const totalSupplyFormula = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
      } as TotalSupplyAmountFormula

      const constFormula = {
        type: 'const',
        value: '0',
        decimals: 0,
      } as ConstAmountFormula

      const amountFormula = {
        type: 'calculation',
        operator: 'min',
        arguments: [constFormula, totalSupplyFormula],
      } as CalculationFormula

      const totalSupplyConfigId = createAmountConfig(totalSupplyFormula).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
        ],
      })

      const mockTimestamp = UnixTime.now()

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(totalSupplyConfigId, mockTimestamp)
          .resolvesToOnce(0n)
          .resolvesToOnce(0n),
        getPrice: mockFn()
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(200)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      const result = await valueService.calculate(tvsConfig, [mockTimestamp])

      expect(result).toEqual([
        {
          timestamp: mockTimestamp,
          tokenId: tvsConfig.tokens[0].id,
          amount: 0,
          projectId: ProjectId('project'),
          value: 0,
          valueForProject: 0,
          valueForSummary: 0,
        },
      ])
    })

    it('should throw when min formula has both arguments resolving to undefined', async () => {
      const priceId = 'price-ABCD'
      const priceConfigId = createPriceConfigId(priceId)

      // First totalSupply formula that will resolve to undefined
      const totalSupplyFormula1 = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(300), // This will make it out of range
      } as TotalSupplyAmountFormula

      // Second totalSupply formula that will resolve to undefined
      const totalSupplyFormula2 = {
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'chain',
        decimals: 0,
        sinceTimestamp: UnixTime(300), // This will make it out of range
      } as TotalSupplyAmountFormula

      const amountFormula = {
        type: 'calculation',
        operator: 'min',
        arguments: [totalSupplyFormula1, totalSupplyFormula2],
      } as CalculationFormula

      const totalSupplyConfigId1 = createAmountConfig(totalSupplyFormula1).id
      const totalSupplyConfigId2 = createAmountConfig(totalSupplyFormula2).id

      const tvsConfig = mockObject<ProjectTvsConfig>({
        projectId: ProjectId('project'),
        tokens: [
          mockObject<TvsToken>({
            id: TokenId('tokenId'),
            priceId,
            amount: amountFormula,
            valueForProject: undefined,
            valueForSummary: undefined,
          }),
        ],
      })

      const mockTimestamp = UnixTime(200) // Earlier than the sinceTimestamp

      const mockDataStorage = mockObject<DataStorage>({
        getAmount: mockFn()
          .given(totalSupplyConfigId1, mockTimestamp)
          .resolvesToOnce(undefined)
          .given(totalSupplyConfigId2, mockTimestamp)
          .resolvesToOnce(undefined),
        getPrice: mockFn()
          .given(priceConfigId, mockTimestamp)
          .resolvesToOnce(200),
      })

      const valueService = new ValueService(mockDataStorage, Logger.SILENT)

      // Since both arguments resolve to undefined and are out of range,
      // we expect the calculation to throw an error
      await expect(
        async () => await valueService.calculate(tvsConfig, [mockTimestamp]),
      ).toBeRejected()
    })
  })
})
