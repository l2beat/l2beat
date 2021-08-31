import { utils } from 'ethers'
import { TokenInfo } from '../../../config/build/src'
import { ProjectInfo } from '../model'
import { LogFilter } from './api/AlchemyApi'
import { LogApi } from './api/LogApi'
import { TVLAnalysis } from './balances/model'

export interface FlowsEntry {
  usdIn7DayNoEth: number
  usdOut7DayNoEth: number
}

export type Flows = Record<string, FlowsEntry>

const coder = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])

export class FlowChecker {
  constructor(private logApi: LogApi) {}

  async getFlows(
    projects: ProjectInfo[],
    tvlEntries: TVLAnalysis[]
  ): Promise<Flows> {
    const lastSevenDays = tvlEntries.slice(-7)
    const fromBlock = tvlEntries[tvlEntries.length - 8].blockNumber + 1
    const toBlock = tvlEntries[tvlEntries.length - 1].blockNumber

    const { logsIn, logsOut } = await this.getLogs(projects, fromBlock, toBlock)

    console.log(logsIn.length, logsOut.length)

    return {}
  }

  private async getLogs(
    projects: ProjectInfo[],
    fromBlock: number,
    toBlock: number
  ) {
    type TokenNotEth = TokenInfo & { address: string }
    const tokens = projects
      .flatMap((x) => x.bridges.flatMap((x) => x.tokens))
      .filter((x, i, a) => a.indexOf(x) === i)
      .filter((token): token is TokenNotEth => !!token.address)
    const bridges = projects.flatMap((x) => x.bridges.map((x) => x.address))

    const filterOut: LogFilter = {
      address: tokens.map((x) => x.address),
      fromBlock,
      toBlock,
      topics: coder.encodeFilterTopics('Transfer' as any, [bridges]),
    }

    const filterIn: LogFilter = {
      ...filterOut,
      topics: coder.encodeFilterTopics('Transfer' as any, [null, bridges]),
    }

    const [logsIn, logsOut] = await Promise.all([
      this.logApi.getLogs(filterOut, 'inflows (7d)'),
      this.logApi.getLogs(filterIn, 'outflows (7d)'),
    ])

    return { logsIn, logsOut }
  }
}
