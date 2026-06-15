import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { AddressFieldValue, FieldValue } from '../../../api/types'
import { getExplorerTxUrl } from '../../../config/explorers'

interface PastUpgrade {
  date: string
  txHash: string | undefined
  implementations: AddressFieldValue[]
}

export interface PastUpgradeCell {
  address: string
  /**
   * Diff-tool link comparing this implementation with the previous (older)
   * one at the same position. Undefined when the implementation did not change
   * or there is no older entry to compare against.
   */
  diffUrl: string | undefined
}

export interface PastUpgradeRow {
  formattedDate: string
  /** Explorer link to the upgrade transaction, when derivable. */
  txUrl: string | undefined
  /**
   * One cell per implementation. Single-implementation proxies have exactly
   * one cell; diamonds have one per facet (rendered as table columns).
   */
  cells: PastUpgradeCell[]
}

/**
 * Turns the raw `$pastUpgrades` field value into table rows ready to render.
 *
 * Each entry is a `[date, transactionHash, implementations[]]` tuple. For
 * diamonds, `implementations` is the full set of active facets at that point,
 * so the same facet repeats across upgrades. Rows are ordered newest first, so
 * the "previous" implementation used for the diff link is the next (older)
 * entry down. A cell's [diff] link is only emitted when the implementation
 * actually changed from the previous entry at the same position; unchanged
 * facets and the oldest entry get no diff.
 */
export function buildPastUpgradeRows(value: FieldValue): PastUpgradeRow[] {
  const sorted = [...dedupeByTransaction(parsePastUpgrades(value))].sort(
    (a, b) => b.date.localeCompare(a.date),
  )

  return sorted.map((upgrade, entryIndex) => {
    const previous = sorted[entryIndex + 1]
    const txBase = upgrade.implementations[0]
      ? getExplorerTxUrl(getChain(upgrade.implementations[0].address))
      : undefined

    const cells = upgrade.implementations.map((implementation, implIndex) => {
      // Position-matched against the previous snapshot. Diamonds keep facet
      // order stable in practice; if it ever shifts a diff may pair the wrong
      // facets, but the addresses are shown so a mismatch is self-evident.
      const previousImplementation = previous?.implementations[implIndex]
      const changed =
        previousImplementation !== undefined &&
        previousImplementation.address !== implementation.address

      return {
        address: implementation.address,
        diffUrl: changed
          ? `/diff/${previousImplementation.address}/${implementation.address}`
          : undefined,
      }
    })

    return {
      formattedDate: formatDate(upgrade.date),
      txUrl:
        txBase && upgrade.txHash ? `${txBase}/${upgrade.txHash}` : undefined,
      cells,
    }
  })
}

/**
 * Collapses entries that share a transaction hash. Diamonds emit one
 * `$pastUpgrades` entry per `DiamondCut` event, so a single upgrade transaction
 * can appear several times. We keep the last occurrence, which holds the final
 * cumulative facet set for that transaction. Entries without a hash are kept.
 */
function dedupeByTransaction(upgrades: PastUpgrade[]): PastUpgrade[] {
  const lastIndexByTx = new Map<string, number>()
  upgrades.forEach((upgrade, index) => {
    if (upgrade.txHash !== undefined) {
      lastIndexByTx.set(upgrade.txHash, index)
    }
  })

  return upgrades.filter(
    (upgrade, index) =>
      upgrade.txHash === undefined ||
      lastIndexByTx.get(upgrade.txHash) === index,
  )
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
