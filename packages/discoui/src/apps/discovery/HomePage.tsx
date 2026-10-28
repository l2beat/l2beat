import { useQuery } from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getProjects } from '../../api/api'
import type { ApiProjectEntry } from '../../api/types'
import { ErrorState } from '../../components/ErrorState'
import { Title } from '../../components/Title'
import { IS_READONLY } from '../../config/readonly'
import { IconPlus } from '../../icons/IconPlus'
import { IconStarEmpty } from '../../icons/IconStarEmpty'
import { IconStarFull } from '../../icons/IconStarFull'
import { cn } from '../../utils/cn'
import {
  buildHomeSections,
  CATEGORY_TITLES,
  type GridKey,
  type HomeSection,
  moveInSections,
} from './homeSections'

export function HomePage() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus the input when the component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      <Title title="DiscoUI - Home" />
      <div className="mx-auto max-w-[1040px] px-6 py-6">
        <div className="mb-5 flex items-center gap-6">
          <h1 className="shrink-0">
            <img className="w-[120px]" src="/logo.svg" alt="DSCVRY" />
          </h1>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <input
              ref={inputRef}
              className="h-9 min-w-0 flex-1 border border-coffee-600 bg-coffee-800 px-3 text-sm placeholder:text-coffee-400"
              placeholder="Filter projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!IS_READONLY && (
              <Link
                to="/ui/new"
                aria-label="New project"
                title="New project"
                className="flex size-9 shrink-0 items-center justify-center border border-coffee-600 text-coffee-300 transition-colors duration-100 hover:bg-coffee-700 hover:text-coffee-100"
              >
                <IconPlus />
              </Link>
            )}
          </div>
        </div>
        <AllProjects search={deferredSearch} />
      </div>
    </>
  )
}

function AllProjects(props: { search: string }) {
  const result = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
  const [favorites, setFavorites] = useState<string[]>(readFavorites)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const columnCount = useColumnCount()
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    writeFavorites(favorites)
  }, [favorites])

  useEffect(() => {
    setSelectedIndex(0)
  }, [props.search, result.isSuccess, result.data])

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
    })
  }, [selectedIndex, columnCount])

  const filtered = useFilteredProjects(result.data, props.search)
  const sections = useMemo(
    () => buildHomeSections(filtered, favorites, props.search.trim() !== ''),
    [filtered, favorites, props.search],
  )

  useGridKeyboard(sections, selectedIndex, setSelectedIndex, columnCount)

  if (result.isPending) {
    return (
      <>
        <WithHeader title={CATEGORY_TITLES.rollups}>
          <ProjectListSkeleton amount={8} />
        </WithHeader>
        <WithHeader title={CATEGORY_TITLES.validiumsAndOptimiums}>
          <ProjectListSkeleton amount={4} />
        </WithHeader>
      </>
    )
  }

  if (result.isError) {
    return <ErrorState />
  }

  function toggleFavorite(project: string) {
    if (favorites.includes(project)) {
      setFavorites(favorites.filter((x) => x !== project))
    } else {
      setFavorites([...favorites, project])
    }
  }

  if (sections.length === 0) {
    return (
      <WithHeader title="Results">
        <p className="pl-6">No matching projects</p>
      </WithHeader>
    )
  }

  return (
    <Sections
      sections={sections}
      selectedIndex={selectedIndex}
      toggleFavorite={toggleFavorite}
      itemRefs={itemRefs}
    />
  )
}

function Sections(props: {
  sections: HomeSection[]
  selectedIndex: number
  toggleFavorite: (project: string) => void
  itemRefs: React.RefObject<(HTMLLIElement | null)[]>
}) {
  let sectionStart = 0
  return props.sections.map((section) => {
    const start = sectionStart
    sectionStart += section.entries.length
    return (
      <WithHeader
        key={section.title}
        title={section.title}
        count={section.entries.length}
      >
        <ProjectList
          favorites={section.favorites}
          entries={section.entries}
          toggleFavorite={props.toggleFavorite}
          selectedIndex={props.selectedIndex - start}
          itemRef={(i, element) => {
            props.itemRefs.current[start + i] = element
          }}
        />
      </WithHeader>
    )
  })
}

function useGridKeyboard(
  sections: HomeSection[],
  selectedIndex: number,
  setSelectedIndex: (index: number) => void,
  columnCount: number,
) {
  const navigate = useNavigate()
  useEffect(() => {
    const flat = sections.flatMap((x) => x.entries)
    const lengths = sections.map((x) => x.entries.length)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flat.length === 0) {
        return
      }
      if (isGridKey(e.key)) {
        e.preventDefault()
        setSelectedIndex(
          moveInSections(lengths, selectedIndex, e.key, columnCount),
        )
      }
      const selected = flat[selectedIndex]
      if (e.key === 'Enter' && selected !== undefined) {
        e.preventDefault()
        void navigate(`/ui/p/${selected.name}`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [sections, selectedIndex, setSelectedIndex, columnCount, navigate])
}

function useColumnCount() {
  const [columnCount, setColumnCount] = useState(getColumnCount)
  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount())
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return columnCount
}

function getColumnCount() {
  return window.innerWidth >= 768 ? 4 : 2
}

function isGridKey(key: string): key is GridKey {
  return (
    key === 'ArrowUp' ||
    key === 'ArrowDown' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight'
  )
}

type SearchReadyEntry = ApiProjectEntry & {
  _addressesString: string
  _contractNamesString: string
}

function prepareEntries(entries: ApiProjectEntry[]): SearchReadyEntry[] {
  return entries.map((entry) => ({
    ...entry,
    _addressesString: entry.addresses.join(' '),
    _contractNamesString: entry.contractNames.join(' '),
  }))
}

function filterAndSortEntries(
  search: string,
  entries: SearchReadyEntry[],
): ApiProjectEntry[] {
  if (search.trim() === '') {
    return entries
  }

  const result = fuzzysort.go(search, entries, {
    keys: [
      (e) => e.name,
      (e) => e._addressesString,
      (e) => e._contractNamesString,
    ],
    limit: 15,
    threshold: 0.3,
  })

  return result.map((match) => match.obj)
}

function ProjectList(props: {
  entries: ApiProjectEntry[]
  toggleFavorite: (project: string) => void
  selectedIndex: number
  itemRef: (index: number, element: HTMLLIElement | null) => void
  favorites: boolean
}) {
  return (
    <ol className="mb-6 grid grid-cols-2 gap-x-4 gap-y-0 md:grid-cols-4">
      {props.entries.map((entry, i) => {
        const isSelected = i === props.selectedIndex

        return (
          <li
            ref={(element) => props.itemRef(i, element)}
            className={cn(
              'group flex min-h-8 min-w-0 items-center gap-2 rounded-sm px-2 text-[13px]',
              isSelected &&
                'bg-autumn-300/15 text-coffee-100 shadow-[inset_2px_0_0_#BAD80A]',
              !isSelected && 'hover:bg-coffee-800',
            )}
            key={entry.name}
          >
            <button
              className="shrink-0 opacity-25 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
              aria-label={
                props.favorites ? 'Remove from favorites' : 'Add to favorites'
              }
              onClick={() => props.toggleFavorite(entry.name)}
            >
              {props.favorites ? (
                <IconStarFull className="text-autumn-300" />
              ) : (
                <IconStarEmpty />
              )}
            </button>
            <Link
              to={`/ui/p/${entry.name}`}
              className="min-w-0 flex-1 break-words py-1"
            >
              {entry.name}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

function readFavorites() {
  return localStorage.getItem('favorites')?.split(',') ?? []
}

function writeFavorites(favorites: string[]) {
  localStorage.setItem('favorites', favorites.join(','))
}

function WithHeader(props: {
  children: React.ReactNode
  title: string
  count?: number
}) {
  return (
    <>
      <p className="mb-1 flex items-baseline justify-between border-coffee-700 border-b px-2 pb-1.5 font-semibold text-coffee-300 text-xs uppercase tracking-wide">
        {props.title}
        {props.count !== undefined && (
          <span className="font-normal text-coffee-400 tabular-nums">
            {props.count}
          </span>
        )}
      </p>
      {props.children}
    </>
  )
}

function ProjectListSkeleton(props: { amount: number }) {
  return (
    <ol className="mb-6 grid grid-cols-2 gap-x-4 gap-y-4 px-2 md:grid-cols-4">
      {Array.from({ length: props.amount }).map((_, i) => {
        const projectNameWidth = randomWidth(40, 100)
        const chainsWidth = randomWidth(20, 80)
        return (
          <div key={i} className="flex flex-col gap-1">
            <li
              className="h-5 animate-breath rounded-sm bg-coffee-400/50"
              style={{ width: `${projectNameWidth}%` }}
            />
            <li
              className="h-2 animate-breath rounded-sm bg-coffee-400/30"
              style={{ width: `${chainsWidth}%` }}
            />
          </div>
        )
      })}
    </ol>
  )
}

function randomWidth(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function useFilteredProjects(
  entries: ApiProjectEntry[] | undefined,
  search: string,
) {
  const preparedEntries = useMemo(() => {
    if (!entries) {
      return []
    }

    return prepareEntries(entries)
  }, [entries])

  const normalizedSearch = search.toLowerCase()

  return useMemo(
    () => filterAndSortEntries(normalizedSearch, preparedEntries),
    [normalizedSearch, preparedEntries],
  )
}
