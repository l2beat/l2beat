import { EthereumAddress, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { Token } from '../../../model/Token'
import { BalanceRepository } from '../../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { Status } from './Status'
import { renderStatusPage } from './view/StatusPage'

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

    const statuses = this.tokens
      .map((token): Status => {
        const latest = latestByToken.get(token.id)

        return {
          name: token.coingeckoId.toString(),
          timestamp: latest?.timestamp,
          value: latest?.priceUsd.toString(),
          isSynced: isSynced(latest?.timestamp),
        }
      })
      .sort((a, b) => Number(a.isSynced) - Number(b.isSynced))

    return renderStatusPage({ title: 'Prices', statuses })
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
            timestamp: unixTimeToString(latest.timestamp),
            syncStatus: getSyncStatus(latest.timestamp),
          })) ?? [],
      })),
    )
  }

  async getReportsStatus() {
    const projectLatest = await this.reportsRepository.getLatestPerProject()
    return this.projects.map(({ projectId }) => ({
      projectId,
      tokens:
        projectLatest.get(projectId)?.map((latest) => ({
          assetId: latest.asset,
          balance: latest.balance.toString(),
          usd: latest.balanceUsd.toString(),
          eth: latest.balanceEth.toString(),
          timestamp: unixTimeToString(latest.timestamp),
          syncStatus: getSyncStatus(latest.timestamp),
        })) ?? [],
    }))
  }
}

function isSynced(timestamp: UnixTime | undefined) {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')
  return !!timestamp && now.equals(timestamp)
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
