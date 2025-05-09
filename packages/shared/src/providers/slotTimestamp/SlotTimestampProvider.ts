import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { SvmBlockProvider } from '../block/SvmBlockProvider'

interface Dependencies {
  readonly svmBlockProviders: SvmBlockProvider[]
}

export class SlotTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  async getSlotNumberAtOrBefore(
    timestamp: UnixTime,
    chain: string,
    startSlot: number,
  ): Promise<number> {
    const provider = this.$.svmBlockProviders.find((b) => b.chain === chain)

    assert(provider, `Missing SvmBlockProvider for ${chain}`)
    return await provider.getSlotNumberAtOrBefore(timestamp, startSlot)
  }
}
