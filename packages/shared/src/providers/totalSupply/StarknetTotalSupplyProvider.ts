import type { Logger } from '@l2beat/backend-tools'
import type { StarknetClient } from '../../clients'

export const STARKNET_TOTAL_SUPPLY_SELECTOR =
  '0x1557182e4359a1f0c6301278e8f5b35a776ab58d39892581e357578fb287836'

export class StarknetTotalSupplyProvider {
  private logger: Logger
  constructor(
    private readonly starknetClients: StarknetClient[],
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  getTotalSupplies(
    tokens: string[],
    blockNumber: number,
    chain: string,
  ): Promise<bigint[]> {
    const client = this.starknetClients.find((r) => r.chain === chain)

    if (!client) {
      throw new Error(`Missing starknet client for ${chain}`)
    }

    const calls = tokens.map((address) => ({
      contract_address: address,
      entry_point_selector: STARKNET_TOTAL_SUPPLY_SELECTOR,
      calldata: [],
    }))

    return Promise.all(
      calls.map(async (c, i) => {
        try {
          const res = await client.call(c, blockNumber)
          return res.toString() === '0x' ? 0n : BigInt(res[0])
        } catch {
          this.logger.tag({ chain }).warn('Issue with totalSupply fetching', {
            token: tokens[i],
            blockNumber,
          })
          return 0n
        }
      }),
    )
  }
}
