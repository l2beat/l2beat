import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  type CsvFieldGetter,
  type NormalizedAmountRow,
  normalizePrivacyPoolsRow,
  normalizeRailgunWithdrawalRow,
  normalizeTornadoWithdrawalRow,
  normalizeTrxsDepositRow,
  type PrivacyAmountRecord,
} from '../privacyAmountAnalysisUtils'

export interface PrivacyAmountRecordSet {
  deposits: PrivacyAmountRecord[]
  withdrawals: PrivacyAmountRecord[]
}

const DATA_DIR =
  process.env.PRIVACY_AMOUNT_DATA_DIR ?? resolve(process.cwd(), 'data')

const SOURCES: {
  file: string
  normalize: (get: CsvFieldGetter) => NormalizedAmountRow | undefined
}[] = [
  {
    file: 'PrivacyFlowTrxs_with_amounts.csv',
    normalize: normalizeTrxsDepositRow,
  },
  {
    file: 'tornado_cash_privacy_flow.csv',
    normalize: normalizeTornadoWithdrawalRow,
  },
  {
    file: 'railgun_privacy_flow.csv',
    normalize: normalizeRailgunWithdrawalRow,
  },
  {
    file: 'privacy_pools_privacy_flow.csv',
    normalize: normalizePrivacyPoolsRow,
  },
]

let cache: Map<string, PrivacyAmountRecordSet> | undefined

/**
 * Lazily parses the static privacy CSVs once and returns normalized,
 * token-resolved records grouped by project id and direction. Rows whose
 * token can't be resolved (or that fail an explicit filter) are dropped.
 */
export function getPrivacyAmountRecordsByProject(): Map<
  string,
  PrivacyAmountRecordSet
> {
  if (cache) return cache

  const byProject = new Map<string, PrivacyAmountRecordSet>()

  for (const source of SOURCES) {
    forEachRow(source.file, (get) => {
      const normalized = source.normalize(get)
      if (!normalized) return

      let set = byProject.get(normalized.projectId)
      if (!set) {
        set = { deposits: [], withdrawals: [] }
        byProject.set(normalized.projectId, set)
      }
      if (normalized.direction === 'deposit')
        set.deposits.push(normalized.record)
      else set.withdrawals.push(normalized.record)
    })
  }

  cache = byProject
  return byProject
}

/**
 * Reads a CSV file from the data dir and invokes `handler` for each data row
 * with a column-name accessor. Uses a minimal split parser — the static
 * privacy CSVs contain no quoted fields or embedded commas.
 */
function forEachRow(
  fileName: string,
  handler: (get: CsvFieldGetter) => void,
): void {
  const path = resolve(DATA_DIR, fileName)
  if (!existsSync(path)) return

  const content = readFileSync(path, 'utf8')
  const lines = content.split(/\r?\n/)
  if (lines.length === 0) return

  const header = lines[0]?.split(',') ?? []
  const columnIndex = new Map<string, number>()
  header.forEach((name, index) => columnIndex.set(name.trim(), index))

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const fields = line.split(',')
    handler((column) => {
      const index = columnIndex.get(column)
      return index === undefined ? undefined : fields[index]
    })
  }
}
