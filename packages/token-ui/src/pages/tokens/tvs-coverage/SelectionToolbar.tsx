import { CopyIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'
import { toCsvDump, toJsonDump } from './llmDump'
import type { Names, Row, Snapshot } from './rows'

export function SelectionToolbar({
  rows,
  snapshot,
  names,
  onClear,
}: {
  rows: Row[]
  snapshot: Snapshot
  names: Names
  onClear: () => void
}) {
  if (rows.length === 0) return null

  // navigator.clipboard is missing outside secure contexts.
  const copy = async (format: 'JSON' | 'CSV') => {
    const text =
      format === 'JSON'
        ? toJsonDump(rows, snapshot, names)
        : toCsvDump(rows, snapshot, names)
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied ${rows.length} rows as ${format}`)
    } catch {
      toast.error('Could not write to the clipboard')
    }
  }

  return (
    <>
      <span className="text-muted-foreground text-xs">
        {rows.length.toLocaleString()} selected
      </span>
      {(['JSON', 'CSV'] as const).map((format) => (
        <Button
          key={format}
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => copy(format)}
        >
          <CopyIcon />
          Copy {format}
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label="Clear selection"
        title="Clear selection"
        onClick={onClear}
      >
        <XIcon />
      </Button>
    </>
  )
}
