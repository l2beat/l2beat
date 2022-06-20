import { EthereumAddress, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { Token } from '../../model/Token'
import { BalanceRepository } from '../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../peripherals/database/ReportRepository'

interface Status {
  name: string
  timestamp: string
  value: string
  status: {
    isSynced: boolean
    message: string
  }
}
const HEAD =
  '<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"></head>'

export class StatusController {
  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportsRepository: ReportRepository,
    private tokens: Token[],
    private projects: ProjectInfo[],
  ) {}

  async getPricesStatus() {
    const latestByToken = await this.priceRepository.getLatestByToken()

    const statuses = this.tokens.map((token) => {
      const latest = latestByToken.get(token.id)

      return {
        name: latest ? latest.assetId.toString() : token.coingeckoId.toString(),
        timestamp: latest ? unixTimeToString(latest.timestamp) : '',
        value: latest ? latest.priceUsd.toString() : '',
        status: latest
          ? getSyncStatus(latest.timestamp)
          : { isSynced: false, message: '! no prices' },
      }
    })

    return HEAD + generateTable(statuses)
  }

  async getBalancesStatus() {
    const holderLatest = await this.balanceRepository.getLatestPerHolder()
    return this.projects.flatMap(({ bridges, name }) =>
      bridges.map(({ address }) => ({
        name,
        address,
        tokens:
          holderLatest.get(EthereumAddress(address))?.map((latest) => ({
            assetId: latest.assetId,
            balance: latest.balance.toString(),
            blockNumber: latest.blockNumber.toString(),
            timestamp: unixTimeToString(latest.timestamp),
            syncStatus: getSyncStatus(latest.timestamp),
          })) ?? [],
      })),
    )
  }

  async getReportsStatus() {
    const bridgeLatest = await this.reportsRepository.getLatestPerBridge()
    return this.projects.flatMap(({ bridges, name }) =>
      bridges.map(({ address }) => ({
        name,
        address,
        tokens:
          bridgeLatest.get(EthereumAddress(address))?.map((latest) => ({
            assetId: latest.asset,
            balance: latest.balance.toString(),
            usd: latest.balanceUsd.toString(),
            eth: latest.balanceEth.toString(),
            blockNumber: latest.blockNumber.toString(),
            timestamp: unixTimeToString(latest.timestamp),
            syncStatus: getSyncStatus(latest.timestamp),
          })) ?? [],
      })),
    )
  }
}

const unixTimeToString = (date: UnixTime) => {
  return date.toDate().toString().slice(4, 21)
}

const SECONDS_PER_HOUR = 60 * 60
const getSyncStatus = (
  date: UnixTime,
): {
  isSynced: boolean
  message: string
} => {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')

  const diff = now.toNumber() - date.toNumber()

  if (diff === 0) {
    return { isSynced: true, message: '✔' }
  }

  if (diff > 0 && diff < 24 * SECONDS_PER_HOUR) {
    return {
      isSynced: false,
      message: `out of sync for ${diff / SECONDS_PER_HOUR} hour(s)`,
    }
  }

  if (diff >= 24 * SECONDS_PER_HOUR) {
    return {
      isSynced: false,
      message: `out of sync for ${Math.floor(
        diff / (24 * SECONDS_PER_HOUR),
      )} day(s)`,
    }
  }

  return { isSynced: false, message: '? price synced ahead of time' }
}

const generateTable = (statuses: Status[]) => {
  const tableHeader =
    '<table><tr><th>Name</th><th>Last synced</th><th>Latest value</th><th>Status</th></tr>'

  const rows = statuses.map(
    (status) =>
      `<tr>
        <td>${status.name}</td>
        <td>${status.timestamp}</td>
        <td>${status.value}</td>
        <td style="color:${status.status.isSynced ? 'green' : 'red'}">${
        status.status.message
      }</td>
      </tr>`,
  )

  return tableHeader + rows.join('') + '</table>'
}
