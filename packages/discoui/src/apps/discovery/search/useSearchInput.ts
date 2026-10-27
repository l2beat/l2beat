import { useState } from 'react'
import { IS_READONLY } from '../../../config/readonly'
import { usePanelStore } from '../store/panel-store'
import type { SearchItem } from './items'
import {
  cycleScope,
  getSearchScopes,
  type SearchScope,
  scopeForPrefix,
} from './scopes'
import { useSearchStore } from './store'

export const SEARCH_SCOPES = getSearchScopes(IS_READONLY)

export function useSearchInput(
  items: SearchItem[],
  runItem: (item: SearchItem) => void,
) {
  const scope = useSearchStore((s) => s.scope)
  const text = useSearchStore((s) => s.text)
  const codeInSelected = useSearchStore((s) => s.codeInSelected)
  const setScope = useSearchStore((s) => s.setScope)
  const setText = useSearchStore((s) => s.setText)
  const setCodeInSelected = useSearchStore((s) => s.setCodeInSelected)

  const queryKey = `${scope}:${codeInSelected}:${text}`
  const [highlight, setHighlight] = useState({ queryKey, index: 0 })
  const highlightIndex =
    highlight.queryKey === queryKey
      ? Math.min(highlight.index, items.length - 1)
      : 0

  function highlightAt(index: number) {
    setHighlight({ queryKey, index })
  }

  function switchScope(next: SearchScope) {
    setScope(next)
    setCodeInSelected(false)
  }

  function onChange(value: string) {
    let rest = value
    let nextScope = scope
    if (scope === 'all' && text === '') {
      const prefixScope = scopeForPrefix(SEARCH_SCOPES, rest.slice(0, 1))
      if (prefixScope !== undefined) {
        nextScope = prefixScope
        rest = rest.slice(1)
        switchScope(prefixScope)
      }
    }
    if (nextScope === 'code' && text === '' && rest.startsWith('%')) {
      rest = rest.slice(1)
      setCodeInSelected(usePanelStore.getState().selected[0] !== undefined)
    }
    setText(rest)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const count = items.length
      if (count === 0) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      highlightAt((highlightIndex + step + count) % count)
    } else if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      const item = items[highlightIndex]
      if (item !== undefined) runItem(item)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      e.stopPropagation()
      switchScope(cycleScope(SEARCH_SCOPES, scope, e.shiftKey ? -1 : 1))
    } else if (e.key === 'Backspace' && text === '' && scope !== 'all') {
      e.preventDefault()
      if (codeInSelected) {
        setCodeInSelected(false)
      } else {
        switchScope('all')
      }
    }
  }

  return { highlightIndex, highlightAt, switchScope, onChange, onKeyDown }
}
