import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { SvmBlock, SvmBlockClient } from '../../clients'
import { getBlockNumberAtOrBefore } from '../../tools/getBlockNumberAtOrBefore'

export class SvmBlockProvider {
  constructor(
    readonly chain: string,
    private readonly clients: SvmBlockClient[],
  ) {
    assert(clients.length > 0, 'Clients cannot be empty')
  }

  async getLatestSlotNumber(): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getLatestSlotNumber()
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing SVM RPC client for ${this.chain}`)
  }

  async getBlockWithTransactions(slot: number): Promise<SvmBlock | undefined> {
    for (const [index, client] of this.clients.entries()) {
      try {
        return await client.getBlockWithTransactions(slot)
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing SVM RPC client for ${this.chain}`)
  }

  async getSlotNumberAtOrBefore(
    timestamp: UnixTime,
    start = 0,
  ): Promise<number> {
    for (const [index, client] of this.clients.entries()) {
      try {
        const end = await client.getLatestSlotNumber()

        return await getBlockNumberAtOrBefore(
          timestamp,
          start,
          end,
          (number: number) => client.getSlotTime(number),
        )
      } catch (error) {
        if (index === this.clients.length - 1) throw error
      }
    }

    throw new Error(`Missing SVM RPC client for ${this.chain}`)
  }
}
