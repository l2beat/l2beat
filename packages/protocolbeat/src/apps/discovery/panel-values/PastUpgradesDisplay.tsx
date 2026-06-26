import { useState } from 'react'
import type { FieldValue } from '../../../api/types'
import { useCopy } from '../../../hooks/useCopy'
import { IconCopy } from '../../../icons/IconCopy'
import { IconTick } from '../../../icons/IconTick'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { buildPastUpgradeRows, type PastUpgradeRow } from './pastUpgrades'

export interface PastUpgradesDisplayProps {
  value: FieldValue
}

interface SelectedCell {
  rowIndex: number
  columnIndex: number
  address: string
}

export function PastUpgradesDisplay({ value }: PastUpgradesDisplayProps) {
  const rows = buildPastUpgradeRows(value)
  const [selected, setSelected] = useState<SelectedCell | null>(null)

  if (rows.length === 0) {
    return <span className="text-coffee-600">no past upgrades</span>
  }

  const columnCount = Math.max(...rows.map((row) => row.addresses.length))
  const implementationHeaders =
    columnCount === 1
      ? ['Implementation']
      : Array.from({ length: columnCount }, (_, i) => `Facet ${i + 1}`)

  function selectForDiff(cell: SelectedCell) {
    if (!selected) {
      setSelected(cell)
      return
    }
    if (
      selected.rowIndex === cell.rowIndex &&
      selected.columnIndex === cell.columnIndex
    ) {
      setSelected(null)
      return
    }
    window.open(
      `/diff/${selected.address}/${cell.address}`,
      '_blank',
      'noopener,noreferrer',
    )
    setSelected(null)
  }

  return (
    <div className="flex flex-col gap-1">
      <table className="border-separate border-spacing-x-4 border-spacing-y-0.5 font-mono text-xs">
        <thead>
          <tr className="text-left text-2xs text-coffee-500 uppercase tracking-wider">
            <th className="whitespace-nowrap border-coffee-700 border-b pb-1 font-medium">
              Date
            </th>
            <th className="whitespace-nowrap border-coffee-700 border-b pb-1 font-medium">
              Tx
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
                {row.formattedDate}
              </td>
              <td className="whitespace-nowrap align-baseline">
                <TxCell txHash={row.txHash} txUrl={row.txUrl} />
              </td>
              {Array.from({ length: columnCount }, (_, columnIndex) => {
                const address = row.addresses[columnIndex]
                const isSelected =
                  selected?.rowIndex === rowIndex &&
                  selected?.columnIndex === columnIndex
                return (
                  <td
                    key={columnIndex}
                    className="whitespace-nowrap align-baseline text-coffee-200"
                  >
                    {address && (
                      <span className="inline-flex items-baseline gap-1.5">
                        <button
                          type="button"
                          className={`rounded-sm px-1 ${
                            isSelected
                              ? 'bg-aux-blue/20 text-aux-blue'
                              : 'hover:text-aux-blue'
                          }`}
                          title={
                            selected
                              ? 'Click to diff as the new (right) side'
                              : 'Click to pick the old (left) side of a diff'
                          }
                          onClick={() =>
                            selectForDiff({ rowIndex, columnIndex, address })
                          }
                        >
                          {toShortenedAddress(address)}
                        </button>
                        <CopyButton
                          value={address}
                          title="Copy implementation address"
                        />
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="text-2xs text-coffee-600">
        {selected
          ? `Old side: ${toShortenedAddress(selected.address)} — click another implementation to set the new side, or click it again to cancel.`
          : 'Click an implementation to set the old side of a diff, then another for the new side.'}
      </span>
    </div>
  )
}

function TxCell({ txHash, txUrl }: Pick<PastUpgradeRow, 'txHash' | 'txUrl'>) {
  if (!txHash) {
    return <span className="text-coffee-600">—</span>
  }

  const shortened = `${txHash.slice(0, 6)}…${txHash.slice(-4)}`

  return (
    <span className="inline-flex items-baseline gap-1.5">
      {txUrl ? (
        <a
          href={txUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View upgrade transaction"
          className="text-aux-blue hover:underline"
        >
          {shortened}
        </a>
      ) : (
        <span className="text-coffee-200" title={txHash}>
          {shortened}
        </span>
      )}
      <CopyButton value={txHash} title="Copy transaction hash" />
    </span>
  )
}

function CopyButton({ value, title }: { value: string; title: string }) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      className="block h-4 w-4"
      title={title}
      onClick={() => copy(value)}
    >
      {copied ? (
        <IconTick className="relative top-[2px] block size-3.5 text-aux-green" />
      ) : (
        <IconCopy className="relative top-[2px] block size-3.5 text-coffee-600" />
      )}
    </button>
  )
}
