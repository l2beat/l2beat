import type { LupeColumn } from './src/columns'

export interface ColumnSelectorProps {
  available: LupeColumn[]
  selected: LupeColumn[]
  onChange: (selected: LupeColumn[]) => void
}

export function ColumnSelector({
  available,
  selected,
  onChange,
}: ColumnSelectorProps) {
  const notSelected = available.filter(
    (col) => !selected.map((s) => s.id).includes(col.id),
  )

  return (
    <details>
      <summary className="font-semibold text-lg">Select columns</summary>

      <p className="mb-1 font-bold text-xl">Available columns</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {notSelected.map((col) => (
          <div
            className="cursor-pointer rounded bg-zinc-700 px-2 py-1 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => onChange([...selected, col])}
          >
            {col.header}
          </div>
        ))}
      </div>

      <hr />

      <p className="mb-1 font-bold text-xl">Selected columns</p>
      <div className="flex flex-wrap gap-2">
        {selected.map((col, i) => (
          <div
            className="cursor-pointer rounded bg-zinc-700 px-2 py-1 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() =>
              onChange(selected.slice(0, i).concat(selected.slice(i + 1)))
            }
          >
            {col.header}
          </div>
        ))}
      </div>
    </details>
  )
}
