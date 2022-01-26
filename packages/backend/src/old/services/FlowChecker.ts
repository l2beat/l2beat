import { TokenInfo } from '@l2beat/config'
import { BigNumber, providers, utils } from 'ethers'

import { ProjectInfo } from '../../model'
import { TEN_TO_18 } from '../constants'
import { LogFilter } from './api/AlchemyApi'
import { LogApi } from './api/LogApi'
import { TVLAnalysis } from './balances/model'
import { asNumber } from './common/asNumber'

export interface FlowsEntry {
  usdIn7DayNoEth: number
  usdOut7DayNoEth: number
}

export type Flows = Record<string, FlowsEntry>

const coder = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])

interface TransferEvent {
  tokenAddress: string
  blockNumber: number
  from: string
  to: string
  value: BigNumber
}

export class FlowChecker {
  constructor(private logApi: LogApi) {}

  async getFlows(
    projects: ProjectInfo[],
    tvlEntries: TVLAnalysis[]
  ): Promise<Flows> {
    const lastSevenDays = tvlEntries.slice(-7)
    const fromBlock = tvlEntries[tvlEntries.length - 8].blockNumber + 1
    const toBlock = tvlEntries[tvlEntries.length - 1].blockNumber

    const { eventsIn, eventsOut } = await this.getEvents(
      projects,
      fromBlock,
      toBlock
    )

    const inflows = this.calculateFlows(projects, lastSevenDays, eventsIn, 'to')
    const outflows = this.calculateFlows(
      projects,
      lastSevenDays,
      eventsOut,
      'from'
    )

    const result: Flows = {}
    for (const project of projects) {
      result[project.name] = {
        usdIn7DayNoEth: inflows[project.name],
        usdOut7DayNoEth: outflows[project.name],
      }
    }

    return result
  }

  private calculateFlows(
    projects: ProjectInfo[],
    lastSevenDays: TVLAnalysis[],
    events: TransferEvent[],
    inOut: 'to' | 'from'
  ): Record<string, number> {
    const entries = projects.map((project) => {
      const bridges = project.bridges.map((x) => x.address)
      const filtered = events.filter((x) => bridges.includes(x[inOut]))
      let total = BigNumber.from(0)
      for (const event of filtered) {
        for (const day of lastSevenDays) {
          if (event.blockNumber <= day.blockNumber) {
            const price =
              day.prices.token[event.tokenAddress] ?? BigNumber.from(0)
            const value = event.value.mul(price).div(TEN_TO_18)
            total = total.add(value)
            break
          }
        }
      }
      return [project.name, asNumber(total, 18, 2)] as const
    })
    return Object.fromEntries(entries)
  }

  private async getEvents(
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

    const filterIn: LogFilter = {
      address: tokens.map((x) => x.address),
      fromBlock,
      toBlock,
      topics: coder.encodeFilterTopics(coder.getEvent('Transfer'), [
        null,
        bridges,
      ]),
    }

    const filterOut: LogFilter = {
      address: tokens.map((x) => x.address),
      fromBlock,
      toBlock,
      topics: coder.encodeFilterTopics(coder.getEvent('Transfer'), [bridges]),
    }

    const [logsIn, logsOut] = await Promise.all([
      this.logApi.getLogs(filterIn, 'inflows (7d)'),
      this.logApi.getLogs(filterOut, 'outflows (7d)'),
    ])

    const eventsIn = logsIn.map(toEvent)
    const eventsOut = logsOut.map(toEvent)

    function toEvent(log: providers.Log): TransferEvent {
      const parsed = coder.parseLog(log)
      return {
        tokenAddress: log.address,
        blockNumber: log.blockNumber,
        from: parsed.args.from as string,
        to: parsed.args.to as string,
        value: parsed.args.value as BigNumber,
      }
    }

    return { eventsIn, eventsOut }
  }
}
