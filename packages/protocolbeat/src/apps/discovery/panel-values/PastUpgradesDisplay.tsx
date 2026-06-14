import type { FieldValue } from '../../../api/types'
import { IconFileDiff } from '../../../icons/IconFileDiff'
import { IconLink } from '../../../icons/IconLink'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { buildPastUpgradeRows } from './pastUpgrades'

export interface PastUpgradesDisplayProps {
  value: FieldValue
}

/**
 * Dedicated renderer for the `$pastUpgrades` field. Each upgrade is one row:
 *
 *   2026-05-26 [tx]  eth:0x4483…b99D [diff]
 *
 * where [tx] links to the upgrade transaction on the explorer and a cell's
 * [diff] opens the diff tool comparing that implementation with the previous
 * (older) one. Diamonds expose one column per facet, so a single row shows how
 * every facet looked at that upgrade and which ones changed.
 */
export function PastUpgradesDisplay({ value }: PastUpgradesDisplayProps) {
  const rows = buildPastUpgradeRows(value)

  if (rows.length === 0) {
    return <span className="text-coffee-600">no past upgrades</span>
  }

  const columnCount = Math.max(...rows.map((row) => row.cells.length))
  const implementationHeaders =
    columnCount === 1
      ? ['Implementation']
      : Array.from({ length: columnCount }, (_, i) => `Facet ${i + 1}`)

  return (
    <table className="border-separate border-spacing-x-4 border-spacing-y-0.5 font-mono text-xs">
      <thead>
        <tr className="text-left text-2xs text-coffee-500 uppercase tracking-wider">
          <th className="whitespace-nowrap border-coffee-700 border-b pb-1 font-medium">
            Date
          </th>
          {implementationHeaders.map((header, i) => (
            <th
              key={i}
              className="whitespace-nowrap border-coffee-700 border-b pb-1 font-medium"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td className="whitespace-nowrap align-baseline text-coffee-400">
              <span className="inline-flex items-baseline gap-1.5">
                {row.formattedDate}
                {row.txUrl && (
                  <a
                    href={row.txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View upgrade transaction"
                    className="text-coffee-600 hover:text-aux-blue"
                  >
                    <IconLink className="relative top-[2px] block size-3.5" />
                  </a>
                )}
              </span>
            </td>
            {Array.from({ length: columnCount }, (_, columnIndex) => {
              const cell = row.cells[columnIndex]
              return (
                <td
                  key={columnIndex}
                  className="whitespace-nowrap align-baseline text-coffee-200"
                >
                  {cell && (
                    <span className="inline-flex items-baseline gap-1.5">
                      {toShortenedAddress(cell.address)}
                      {cell.diffUrl && (
                        // IconFileDiff is the closest match in the current
                        // icon set; swap it if a more fitting one is added.
                        <a
                          href={cell.diffUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Diff with previous implementation"
                          className="text-coffee-600 hover:text-aux-blue"
                        >
                          <IconFileDiff className="relative top-[2px] block size-3.5" />
                        </a>
                      )}
                    </span>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
