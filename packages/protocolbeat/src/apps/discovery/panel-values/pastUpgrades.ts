import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { AddressFieldValue, FieldValue } from '../../../api/types'
import { getExplorerTxUrl } from '../../../config/explorers'

interface PastUpgrade {
  date: string
  txHash: string | undefined
  implementations: AddressFieldValue[]
}

export interface PastUpgradeRow {
  formattedDate: string
  /** Raw upgrade transaction hash, shown (and copyable) even without a link. */
  txHash: string | undefined
  /** Explorer link to the upgrade transaction, when derivable. */
  txUrl: string | undefined
  /** One address per column: a single impl, or one per facet for diamonds. */
  addresses: string[]
}

export function buildPastUpgradeRows(value: FieldValue): PastUpgradeRow[] {
  const sorted = collapseRedundantUpgrades(parsePastUpgrades(value))
    .map((upgrade, index) => ({ upgrade, index }))
    .sort(
      (a, b) =>
        b.upgrade.date.localeCompare(a.upgrade.date) || b.index - a.index,
    )
    .map((entry) => entry.upgrade)

  return sorted.map((upgrade) => {
    const txBase = upgrade.implementations[0]
      ? getExplorerTxUrl(getChain(upgrade.implementations[0].address))
      : undefined

    return {
      formattedDate: formatDate(upgrade.date),
      txHash: upgrade.txHash,
      txUrl:
        txBase && upgrade.txHash ? `${txBase}/${upgrade.txHash}` : undefined,
      addresses: upgrade.implementations.map(
        (implementation) => implementation.address,
      ),
    }
  })
}

// Folds only consecutive identical snapshots (same tx + implementation set),
// e.g. a diamond's repeated `DiamondCut` events. Distinct in-tx changes (OP
// Stack `proxy -> StorageSetter -> impl`, or a recurring `A -> B -> A`) are
// kept. Assumes `$pastUpgrades` is chronological, so same-tx events are adjacent.
function collapseRedundantUpgrades(upgrades: PastUpgrade[]): PastUpgrade[] {
  return upgrades.filter((upgrade, index) => {
    if (upgrade.txHash === undefined) {
      return true
    }
    const next = upgrades[index + 1]
    return next === undefined || upgradeKey(next) !== upgradeKey(upgrade)
  })
}

function upgradeKey(upgrade: PastUpgrade): string {
  return `${upgrade.txHash}:${upgrade.implementations
    .map((implementation) => implementation.address)
    .join(',')}`
}

function parsePastUpgrades(value: FieldValue): PastUpgrade[] {
  if (value.type !== 'array') {
    return []
  }

  return value.values.flatMap((entry) => {
    if (entry.type !== 'array') {
      return []
    }

    const [dateValue, hashValue, implementationsValue] = entry.values
    const date =
      dateValue?.type === 'string' || dateValue?.type === 'number'
        ? dateValue.value
        : ''
    const txHash = hashValue?.type === 'hex' ? hashValue.value : undefined
    const implementations =
      implementationsValue?.type === 'array'
        ? implementationsValue.values.filter(
            (v): v is AddressFieldValue => v.type === 'address',
          )
        : []

    if (implementations.length === 0) {
      return []
    }

    return [{ date, txHash, implementations }]
  })
}

function formatDate(date: string): string {
  // we only want the calendar day.
  return date.slice(0, 10)
}

function getChain(address: string): string {
  return ChainSpecificAddress.chain(ChainSpecificAddress(address))
}
