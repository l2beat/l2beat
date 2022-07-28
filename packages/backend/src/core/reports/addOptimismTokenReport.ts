import { AssetId, ProjectId } from "@l2beat/common";
import { AggregateReportRecord } from "../../peripherals/database/AggregateReportRepository";
import { PriceRecord, PriceRepository } from "../../peripherals/database/PriceRepository";
import { convertBalance } from "./createReport";

const OP_TOKEN_BALANCE = 214_748_364n * 10n ** 18n

export async function addOptimismToken(aggregatedReports: AggregateReportRecord[], prices: PriceRecord[]) {
  const opPrice = prices.find(p => p.assetId === AssetId('op-optimism'))
  const ethPrice = prices.find(p => p.assetId === AssetId.ETH)

  if(!opPrice || !ethPrice) {
    return aggregatedReports
  }

  const {balanceUsd, balanceEth} = convertBalance(opPrice.priceUsd, 18, OP_TOKEN_BALANCE, ethPrice.priceUsd)


  const optimismReport = aggregatedReports.find(r => r.projectId === ProjectId('optimism'))
  const reportAll = aggregatedReports.at(-1)

  if(!optimismReport || !reportAll) {
    return aggregatedReports
  }

  optimismReport.tvlEth += balanceEth
  optimismReport.tvlUsd += balanceUsd

  reportAll.tvlEth += balanceEth
  reportAll.tvlUsd += balanceUsd

  return aggregatedReports
}