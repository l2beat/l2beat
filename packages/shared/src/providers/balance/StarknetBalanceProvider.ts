import type { Logger } from '@l2beat/backend-tools'
import type { StarknetClient } from '../../clients'

export const STARKNET_BALANCE_OF_SELECTOR =
  '0x035a73cd311a05d46deda634c5ee045db92f811b4e74bca4437fcb5302b7af33'

export class StarknetBalanceProvider {
  private logger: Logger

  constructor(
    private readonly starknetClients: StarknetClient[],
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  getBalances(
    balances: { token: string; holder: string }[],
    blockNumber: number,
    chain: string,
  ): Promise<bigint[]> {
    const client = this.starknetClients.find((r) => r.chain === chain)

    if (!client) {
      throw new Error(`Missing starknet client for ${chain}`)
    }

    return Promise.all(
      balances.map(async ({ token, holder }) => {
        try {
          const result = await client.call(
            {
              contract_address: token,
              entry_point_selector: STARKNET_BALANCE_OF_SELECTOR,
              calldata: [holder],
            },
            blockNumber,
          )
          return decodeStarknetUint256(result)
        } catch {
          this.logger.tag({ chain }).warn('Issue with balanceOf fetching', {
            token,
            holder,
            blockNumber,
          })
          return 0n
        }
      }),
    )
  }
}

export function decodeStarknetUint256(result: string[]): bigint {
  const low = BigInt(result[0] ?? 0)
  const high = BigInt(result[1] ?? 0)
  return low + (high << 128n)
}
