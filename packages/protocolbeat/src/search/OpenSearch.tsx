import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '../common/useDebounce'
import { useCodeStore } from '../components/editor/store'
import { IconSearch } from '../icons/IconSearch'
import { useMultiViewStore } from '../multi-view/store'
import { usePanelStore } from '../store/store'
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

  if (isPending) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <div className="relative w-[20rem]">
      <div className="flex w-full rounded border bg-coffee-700 p-1">
        <div className="flex w-full items-center gap-2">
          <IconSearch />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent outline-none selection:bg-autumn-300 selection:text-coffee-900"
            placeholder="Search by name or address (or in code with % prefix)"
            autoFocus
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setSelectedIndex(data.entryCount > 0 ? 0 : -1)
            }}
            onKeyDown={(e) => {
              if (data.entryCount === 0) return
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                const nextIndex = Math.min(
                  selectedIndex + 1,
                  data.entryCount - 1,
                )
                if (nextIndex !== selectedIndex) {
                  setSelectedIndex(nextIndex)
                }
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                const prevIndex = Math.max(selectedIndex - 1, -1)
                if (prevIndex !== selectedIndex) {
                  setSelectedIndex(prevIndex)
                }
              } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault()
                if (data.type === 'code') {
                  let runningIndex = 0
                  let entry = data.entries[0]
                  for (const loopEntry of data.entries) {
                    entry = loopEntry
                    if (
                      runningIndex + loopEntry.codeLocation.length <=
                      selectedIndex
                    ) {
                      runningIndex += loopEntry.codeLocation.length
                    } else {
                      break
                    }
                  }

                  if (entry !== undefined) {
                    ensurePanel('code')
                    select(entry.address)
                    const codeLocation =
                      entry.codeLocation[selectedIndex - runningIndex]
                    if (codeLocation !== undefined) {
                      setSourceIndex(entry.address, codeLocation.index)
                      showRange(entry.address, {
                        startOffset: codeLocation.offset,
                        length: getCodeSearchTerm(searchTerm).content.length,
                      })
                    }
                  }
                  setOpen(false)
                } else if (data.type === 'project') {
                  const result = data.entries[selectedIndex]
                  navigate(`/ui/p/${result}`)
                  setOpen(false)
                } else {
                  const result = data.entries[selectedIndex]
                  if (result !== undefined) {
                    select(result.address)
                  }
                  setOpen(false)
                }
              }
            }}
          />
        </div>
      </div>

      <div
        ref={resultsRef}
        className="scrollbar-thin -translate-x-1/2 absolute top-full left-1/2 z-50 mt-1 max-h-[300px] w-max min-w-full max-w-[40rem] overflow-y-auto text-wrap break-all rounded border border-coffee-600 bg-coffee-800 shadow-lg"
      >
        {data.entryCount > 0 ? (
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
          <div className="p-3 text-center text-gray-400">No results found</div>
        )}
      </div>
    </div>
  )
}
