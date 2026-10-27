import { useEffect, useRef } from 'react'
import { ErrorState } from '../../../components/ErrorState'
import { Input } from '../../../components/Input'
import { Loader } from '../../../components/Loader'
import { IconSearch } from '../../../icons/IconSearch'
import { cn } from '../../../utils/cn'
import { Keys } from '../multi-view/BottomBar/Keys'
import { usePanelStore } from '../store/panel-store'
import type { SearchRow } from './groups'
import { SearchResultRow } from './SearchResultRow'
import { SCOPE_INFO, type SearchScope } from './scopes'
import { useSearchStore } from './store'
import { useRunSearchItem } from './useRunSearchItem'
import { SEARCH_SCOPES, useSearchInput } from './useSearchInput'
import { useSearchResults } from './useSearchResults'

export function OpenSearch({ project }: { project: string }) {
  const scope = useSearchStore((s) => s.scope)
  const text = useSearchStore((s) => s.text)
  const codeInSelected = useSearchStore((s) => s.codeInSelected)
  const setCodeInSelected = useSearchStore((s) => s.setCodeInSelected)
  const runItem = useRunSearchItem(project)
  const results = useSearchResults(project)
  const input = useSearchInput(results.items, runItem)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 border-coffee-600 border-b bg-coffee-800 px-3">
        <IconSearch className="shrink-0 text-coffee-300" />
        {scope !== 'all' && (
          <span className="shrink-0 rounded-sm bg-coffee-600 px-1.5 py-0.5 font-medium text-coffee-100 text-xs">
            {SCOPE_INFO[scope].label}
          </span>
        )}
        <Input
          type="text"
          size="ghost"
          variant="ghost"
          placeholder={SCOPE_INFO[scope].placeholder}
          autoFocus
          value={text}
          onChange={(e) => input.onChange(e.target.value)}
          onKeyDown={input.onKeyDown}
        />
        {scope === 'code' && (
          <CodeInSelectedToggle
            value={codeInSelected}
            onChange={setCodeInSelected}
          />
        )}
      </div>
      <ScopeTabs scope={scope} onSelect={input.switchScope} />
      <SearchResultsBody
        rows={results.rows}
        status={results.status}
        isStale={results.isStale}
        emptyMessage={emptyMessage(scope, text)}
        needles={results.needles}
        highlightIndex={input.highlightIndex}
        onHighlight={input.highlightAt}
        onRun={runItem}
      />
      <SearchFooter isFetching={results.isFetching} />
    </div>
  )
}

function emptyMessage(scope: SearchScope, text: string): string {
  if (scope === 'code' && text.trim() === '') {
    return 'Type to search the source code of every contract'
  }
  return 'No results'
}

function CodeInSelectedToggle(props: {
  value: boolean
  onChange: (value: boolean) => void
}) {
  const selectedAddress = usePanelStore((s) => s.selected[0])
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      disabled={selectedAddress === undefined}
      onClick={() => props.onChange(!props.value)}
      className={cn(
        'shrink-0 rounded-sm border px-1.5 py-0.5 text-xs disabled:opacity-40',
        props.value
          ? 'border-autumn-300 text-autumn-300'
          : 'border-coffee-500 text-coffee-300 hover:text-coffee-100',
      )}
    >
      Selected only
    </button>
  )
}

function ScopeTabs(props: {
  scope: SearchScope
  onSelect: (scope: SearchScope) => void
}) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-1 border-coffee-700 border-b px-2">
      {SEARCH_SCOPES.map((scope) => (
        <button
          key={scope}
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => props.onSelect(scope)}
          className={cn(
            'flex h-6 items-center gap-1.5 rounded-sm px-2 text-xs',
            scope === props.scope
              ? 'bg-coffee-700 font-medium text-coffee-100'
              : 'text-coffee-300 hover:text-coffee-100',
          )}
        >
          {SCOPE_INFO[scope].label}
          {SCOPE_INFO[scope].prefix !== undefined && (
            <span className="font-mono text-[11px] text-coffee-400">
              {SCOPE_INFO[scope].prefix}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

function SearchResultsBody(props: {
  rows: SearchRow[]
  status: 'pending' | 'error' | 'success'
  isStale: boolean
  emptyMessage: string
  needles: string[]
  highlightIndex: number
  onHighlight: (index: number) => void
  onRun: Parameters<typeof SearchResultRow>[0]['onRun']
}) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${props.highlightIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [props.highlightIndex, props.rows])

  if (props.status === 'pending') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    )
  }
  if (props.status === 'error') {
    return <ErrorState />
  }
  if (props.rows.length === 0) {
    return (
      <div className="flex-1 p-4 text-center text-coffee-400 text-xs">
        {props.emptyMessage}
      </div>
    )
  }
  return (
    <div
      ref={listRef}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-contain py-1',
        props.isStale && 'pointer-events-none opacity-50',
      )}
    >
      {props.rows.map((row) =>
        row.kind === 'label' ? (
          <div
            key={row.key}
            className="flex items-center justify-between px-3 pt-2.5 pb-1 font-semibold text-[11px] text-coffee-400"
          >
            <span className="truncate">{row.label}</span>
            <span className="shrink-0 font-normal normal-case">
              {row.count}
            </span>
          </div>
        ) : (
          <SearchResultRow
            key={row.key}
            item={row.item}
            index={row.index}
            needles={props.needles}
            highlighted={row.index === props.highlightIndex}
            onHighlight={props.onHighlight}
            onRun={props.onRun}
          />
        ),
      )}
    </div>
  )
}

function SearchFooter(props: { isFetching: boolean }) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-coffee-700 border-t bg-coffee-800 px-3 text-[11px] text-coffee-400">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Keys keys={['↑', '↓']} /> navigate
        </span>
        <span className="flex items-center gap-1">
          <Keys keys={['Enter']} /> open
        </span>
        <span className="flex items-center gap-1">
          <Keys keys={['Tab']} /> scope
        </span>
        <span className="flex items-center gap-1">
          <Keys keys={['Esc']} /> close
        </span>
      </div>
      {props.isFetching && <span>Searching…</span>}
    </div>
  )
}
