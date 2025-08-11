import type { ChainApi } from '../config/chain/ChainApi'
import { RpcUopsAnalyzer } from '../modules/activity/services/uops/RpcUopsAnalyzer'
import { StarknetUopsAnalyzer } from '../modules/activity/services/uops/StarknetUopsAnalyzer'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'

export class UopsAnalyzers {
  private analyzers = new Map<string, UopsAnalyzer>()

  constructor(chains: ChainApi[]) {
    const rpcAnalyzer = new RpcUopsAnalyzer()
    const starknetAnalyzer = new StarknetUopsAnalyzer()

    for (const chain of chains) {
      if (chain.blockApis.some((x) => x.type === 'rpc')) {
        this.analyzers.set(chain.name, rpcAnalyzer)
      } else if (chain.blockApis.some((x) => x.type === 'starknet')) {
        this.analyzers.set(chain.name, starknetAnalyzer)
      }
    }
  }

  getUopsAnalyzer(chain: string): UopsAnalyzer | undefined {
    return this.analyzers.get(chain)
  }
}
