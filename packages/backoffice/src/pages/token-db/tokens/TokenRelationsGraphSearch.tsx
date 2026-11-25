import { SearchIcon } from 'lucide-react'
import { type KeyboardEvent, useMemo, useState } from 'react'
import { Input } from '~/components/core/Input'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/core/Popover'
import {
  NODE_COLORS,
  nodeLabel,
  type RelationGraphNode,
  searchRelationGraphNodes,
} from './relationGraphModel'

export function TokenRelationsGraphSearch({
  nodes,
  onSelect,
}: {
  nodes: RelationGraphNode[]
  onSelect: (node: RelationGraphNode) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = useMemo(
    () => searchRelationGraphNodes(nodes, query),
    [nodes, query],
  )
  const canSearch = query.trim().length >= 2

  function selectNode(node: RelationGraphNode) {
    onSelect(node)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key !== 'Enter') return

    const firstResult = results[0]
    if (firstResult === undefined) return
    event.preventDefault()
    selectNode(firstResult)
  }

  return (
    <Popover open={open && canSearch} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-64">
          <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground" />
          <Input
            aria-label="Search deployed tokens in graph"
            placeholder="Symbol, chain, or address…"
            className="h-8 pl-8 text-xs"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-80 p-1"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {results.length === 0 ? (
          <div className="px-2 py-6 text-center text-muted-foreground text-sm">
            No deployed token found.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {results.map((node) => (
              <button
                key={node.id}
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left outline-none hover:bg-accent focus-visible:bg-accent"
                onClick={() => selectNode(node)}
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: NODE_COLORS.deployed }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate font-medium">
                      {nodeLabel(node)}
                    </span>
                    <span className="shrink-0 text-muted-foreground text-xs">
                      {node.chain}
                    </span>
                  </span>
                  <span className="block truncate font-mono text-[11px] text-muted-foreground">
                    {node.address}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
