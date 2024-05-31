import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { AmountRecord } from '../../repositories/AmountRepository'
import { PriceRecord } from '../../repositories/PriceRepository'
import { ValueRecord } from '../../repositories/ValueRepository'

const DECIMALS = 18
const USD_DECIMALS = 2

export const MOCKS_FOR_TVL = {
  amountRecord,
  priceRecord,
  valueRecord,
  DECIMALS,
  USD_DECIMALS,
}

function amountRecord(configId: string, timestamp: number): AmountRecord {
  return {
    configId: configId,
    timestamp: new UnixTime(timestamp),
    amount: BigInt(timestamp) * 10n ** BigInt(DECIMALS),
  }
}

function priceRecord(id: string, timestamp: number): PriceRecord {
  return {
    configId: id,
    timestamp: new UnixTime(timestamp),
    priceUsd: 1,
  }
}

function valueRecord(timestamp: number, v?: Partial<ValueRecord>) {
  return {
    projectId: ProjectId('project'),
    dataSource: 'chain',
    timestamp: new UnixTime(timestamp),
    canonical: 0n,
    canonicalForTotal: 0n,
    external: 0n,
    externalForTotal: 0n,
    native: 0n,
    nativeForTotal: 0n,
    ...v,
  }
}
