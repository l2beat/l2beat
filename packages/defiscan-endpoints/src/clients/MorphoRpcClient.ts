import type { Logger } from '@l2beat/backend-tools'
import { Contract, providers } from 'ethers'

const METAMORPHO_FACTORIES = [
  '0x1897A8997241C1cD4bD0698647e4EB7213535c24',
  '0xA9c3D3a366466Fa809d1Ae982Fb2c46E5fC41101',
]
const MORPHO_BLUE = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb'

const FACTORY_ABI = ['function isMetaMorpho(address) view returns (bool)']

const VAULT_ABI = [
  'function supplyQueueLength() view returns (uint256)',
  'function supplyQueue(uint256) view returns (bytes32)',
  'function asset() view returns (address)',
]

const MORPHO_BLUE_ABI = [
  'function position(bytes32, address) view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral)',
  'function market(bytes32) view returns (uint128 totalSupplyAssets, uint128 totalSupplyShares, uint128 totalBorrowAssets, uint128 totalBorrowShares, uint128 lastUpdate, uint128 fee)',
  'function idToMarketParams(bytes32) view returns (address loanToken, address collateralToken, address oracle, address irm, uint256 lltv)',
]

export interface MorphoMarketPosition {
  marketId: string
  supplyShares: bigint
  suppliedAssets: bigint
  loanToken: string
  collateralToken: string
}

export class MorphoRpcClient {
  private readonly provider: providers.JsonRpcProvider
  private readonly factories: Contract[]
  private readonly morphoBlue: Contract
  private readonly logger: Logger

  constructor(rpcUrl: string, logger: Logger) {
    this.logger = logger
    this.provider = new providers.StaticJsonRpcProvider(rpcUrl, 1)
    this.factories = METAMORPHO_FACTORIES.map(
      (addr) => new Contract(addr, FACTORY_ABI, this.provider),
    )
    this.morphoBlue = new Contract(MORPHO_BLUE, MORPHO_BLUE_ABI, this.provider)
  }

  async isMetaMorphoVault(address: string): Promise<boolean> {
    for (const factory of this.factories) {
      const result: boolean = await factory.isMetaMorpho(address)
      if (result) return true
    }
    return false
  }

  async getVaultPositions(
    vaultAddress: string,
  ): Promise<MorphoMarketPosition[]> {
    const vault = new Contract(vaultAddress, VAULT_ABI, this.provider)

    // Step 1: Get supply queue
    const queueLength: bigint = (await vault.supplyQueueLength()).toBigInt()
    this.logger.info('Vault supply queue length', {
      vaultAddress,
      queueLength: queueLength.toString(),
    })

    const marketIds: string[] = []
    for (let i = 0; i < Number(queueLength); i++) {
      const marketId: string = await vault.supplyQueue(i)
      marketIds.push(marketId)
    }

    // Step 2 & 3: For each market, get position and market data
    const positions: MorphoMarketPosition[] = []

    for (const marketId of marketIds) {
      try {
        const [positionResult, marketResult, paramsResult] = await Promise.all([
          this.morphoBlue.position(marketId, vaultAddress),
          this.morphoBlue.market(marketId),
          this.morphoBlue.idToMarketParams(marketId),
        ])

        const supplyShares: bigint = positionResult.supplyShares.toBigInt()
        const totalSupplyAssets: bigint =
          marketResult.totalSupplyAssets.toBigInt()
        const totalSupplyShares: bigint =
          marketResult.totalSupplyShares.toBigInt()

        // Compute supplied assets: supplyShares * totalSupplyAssets / totalSupplyShares
        let suppliedAssets: bigint
        if (totalSupplyShares === 0n) {
          suppliedAssets = 0n
        } else {
          suppliedAssets =
            (supplyShares * totalSupplyAssets) / totalSupplyShares
        }

        if (supplyShares === 0n) {
          continue // Skip markets with no supply
        }

        positions.push({
          marketId,
          supplyShares,
          suppliedAssets,
          loanToken: paramsResult.loanToken,
          collateralToken: paramsResult.collateralToken,
        })
      } catch (error) {
        this.logger.warn('Failed to fetch position for market, skipping', {
          marketId,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return positions
  }
}
