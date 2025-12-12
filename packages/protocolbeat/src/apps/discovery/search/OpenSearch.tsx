import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '../../../components/ErrorState'
import { useCodeStore } from '../../../components/editor/store'
import { Input } from '../../../components/Input'
import { Loader } from '../../../components/Loader'
import { useDebounce } from '../../../hooks/useDebounce'
import { IconSearch } from '../../../icons/IconSearch'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'
import {
  CodeSearchResultEntry,
  getCodeSearchTerm,
  isCodeSearchTerm,
} from './CodeSearchResultEntry'
import { ContractSearchResultEntry } from './ContractSearchResultEntry'
import { searchQuery } from './implementation'
import { ProjectSearchResultEntry } from './ProjectSearchResultEntry'
import { useSearchStore } from './store'

interface OpenSearchProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  project: string
  select: (address: string) => void
}

export function OpenSearch({ inputRef, project, select }: OpenSearchProps) {
  const navigate = useNavigate()
  const { ensurePanel } = useMultiViewStore()
  const { setSourceIndex, showRange } = useCodeStore()
  const selectedAddress = usePanelStore((state) => state.selected)
  const {
    setOpen,
    searchTerm,
    setSearchTerm,
    selectedIndex,
    setSelectedIndex,
  } = useSearchStore()

  const resultsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      ) as HTMLElement

      if (selectedElement) {
        const container = resultsRef.current
        const containerRect = container.getBoundingClientRect()
        const elementRect = selectedElement.getBoundingClientRect()

        const isAbove = elementRect.top < containerRect.top
        const isBelow = elementRect.bottom > containerRect.bottom

        if (isAbove || isBelow) {
          selectedElement.scrollIntoView({ block: isBelow ? 'end' : 'start' })
        }
      }
    }
  }, [selectedIndex])

  const searchTermDebounced = useDebounce(searchTerm, (term: string) => {
    return isCodeSearchTerm(term) ? 350 : 0
  })

  const { isError, isPending, data } = useQuery({
    queryKey: ['search', project, selectedAddress, searchTermDebounced],
    queryFn: () => searchQuery(project, searchTermDebounced, selectedAddress),
    placeholderData: keepPreviousData,
  })

  function nextEntry() {
    setSelectedIndex(Math.min(selectedIndex + 1, data?.entryCount ?? 0 - 1))
  }

  function previousEntry() {
    setSelectedIndex(Math.max(selectedIndex - 1, 0))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      nextEntry()
      return
    }

    if (e.key === 'ArrowUp') {
      previousEntry()
      return
    }

    if (e.key === 'Enter' && selectedIndex >= 0 && data) {
      if (data.type === 'code') {
        let runningIndex = 0
        let entry = data.entries[0]
        for (const loopEntry of data.entries) {
          entry = loopEntry
          if (runningIndex + loopEntry.codeLocation.length <= selectedIndex) {
            runningIndex += loopEntry.codeLocation.length
          } else {
            break
          }
        }

        if (entry !== undefined) {
          ensurePanel('code')
          select(entry.address)
          const codeLocation = entry.codeLocation[selectedIndex - runningIndex]
          if (codeLocation !== undefined) {
            setSourceIndex(entry.address, codeLocation.index)
            showRange(entry.address, {
              startOffset: codeLocation.offset,
              length: getCodeSearchTerm(searchTerm).content.length,
            })
          }
        }
      }
      if (data.type === 'project') {
        const result = data.entries[selectedIndex]
        navigate(`/ui/p/${result}`)
      } else {
        const result = data.entries[selectedIndex]

        if (result !== undefined) {
          select(result.address)
        }
      }
      setOpen(false)
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value)
    setSelectedIndex((data?.entryCount ?? 0) > 0 ? 0 : -1)
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchTermDebounced])

  return (
    <div>
      <div className="pt-3">
        <div className="flex w-full items-center justify-center gap-2 border-coffee-400 border-b px-3 pb-3">
          <IconSearch />
          <Input
            ref={inputRef}
            type="text"
            size="ghost"
            variant="ghost"
            placeholder="Search by name or address (or in code with % prefix)"
            autoFocus
            value={searchTerm}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>

      <div
        ref={resultsRef}
        className="h-[350px] min-w-full overflow-y-auto text-wrap break-all"
      >
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader />
          </div>
        ) : isError ? (
          <ErrorState />
        ) : data && data.entryCount > 0 ? (
          searchTerm.startsWith('%') ? (
            <CodeSearchResultEntry
              select={select}
              entries={data.type === 'code' ? data.entries : []}
            />
          ) : searchTerm.startsWith('@') ? (
            <ProjectSearchResultEntry
              entries={data.type === 'project' ? data.entries : []}
            />
          ) : (
            <ContractSearchResultEntry
              select={select}
              entries={data.type === 'contract' ? data.entries : []}
            />
          )
        ) : (
          <div className="p-3 text-center font-mono text-coffee-400">
            No results
          </div>
        )}
      </div>
    </div>
  )
}
