import { useQuery } from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import {
  createRef,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProjects } from '../../api/api'
import type { ApiProjectEntry } from '../../api/types'
import { ErrorState } from '../../components/ErrorState'
import { Title } from '../../components/Title'
import { IS_READONLY } from '../../config/readonly'
import { IconStarEmpty } from '../../icons/IconStarEmpty'
import { IconStarFull } from '../../icons/IconStarFull'

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
      <div className="mx-auto max-w-screen-md p-4">
        <h1 className="my-8 flex justify-center">
          <img
            className="w-[200px] md:w-[400px]"
            src="/logo.svg"
            alt="DSCVRY"
          />
        </h1>
        <div className="mb-8 flex items-center justify-center space-x-2">
          <input
            ref={inputRef}
            className="w-full max-w-[464px] border border-coffee-600 bg-coffee-800 px-4 py-2 placeholder:text-coffee-400"
            placeholder="Filter projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!IS_READONLY && (
            <Link to="/ui/new">
              <button className="items-center justify-center border border-coffee-600 px-4 py-2 text-coffee-400 transition-colors duration-100 hover:cursor-pointer hover:bg-coffee-600">
                +
              </button>
            </Link>
          )}
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
  const navigate = useNavigate()

  // Create refs for favorites and projects lists
  const projectsRefs = useRef<Array<React.RefObject<HTMLLIElement>>>([])

  // Get window width to determine column count
  const [columnCount, setColumnCount] = useState<number>(
    window.innerWidth >= 768 ? 4 : 2,
  )

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(window.innerWidth >= 768 ? 4 : 2)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    writeFavorites(favorites)
  }, [favorites])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [props.search, result.isSuccess, result.data])

  // Scroll selected item into view when selection changes
  useEffect(() => {
    if (selectedIndex >= 0) {
      const projects = projectsRefs.current

      if (projects[selectedIndex] && projects[selectedIndex].current) {
        projects[selectedIndex].current?.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        })
      }
    }
  }, [selectedIndex, columnCount])

  const filtered = useFilteredProjects(result.data, props.search)

  const { favoriteList, otherList } = useMemo(() => {
    const favoriteList = filtered.filter((x) => favorites.includes(x.name))
    const otherList = filtered.filter((x) => !favorites.includes(x.name))

    return { favoriteList, otherList }
  }, [filtered, favorites])

  useEffect(() => {
    projectsRefs.current = Array(filtered.length)
      .fill(null)
      .map((_, i) => projectsRefs.current[i] || createRef<HTMLLIElement>())
      .filter(
        (ref): ref is React.RefObject<HTMLLIElement> => ref !== undefined,
      ) as Array<React.RefObject<HTMLLIElement>> // Add type assertion here
  }, [filtered])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const breakIndex = favoriteList.length

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()

          let nextIndex = selectedIndex + columnCount
          // are we in the favorites section and about to cross into the non-fav block?
          if (selectedIndex < breakIndex && nextIndex >= breakIndex) {
            nextIndex = breakIndex + (selectedIndex % columnCount)
          }

          setSelectedIndex(Math.min(nextIndex, filtered.length - 1))
          break
        }

        case 'ArrowUp': {
          e.preventDefault()

          let nextIndex = selectedIndex - columnCount

          // are we in the projects section and about to cross into the favorites block?
          if (selectedIndex >= breakIndex && nextIndex < breakIndex) {
            const col = (selectedIndex - breakIndex) % columnCount
            const columnsInLastRow = breakIndex % columnCount
            const toRemove = col - columnsInLastRow

            nextIndex =
              breakIndex + (toRemove < 0 ? toRemove : toRemove - columnCount)
          }

          setSelectedIndex(Math.max(nextIndex, 0))
          break
        }

        case 'ArrowRight': {
          e.preventDefault()

          setSelectedIndex(Math.min(selectedIndex + 1, filtered.length - 1))
          break
        }

        case 'ArrowLeft': {
          e.preventDefault()

          setSelectedIndex(Math.max(selectedIndex - 1, 0))
          break
        }

        case 'Enter': {
          if (selectedIndex >= 0) {
            e.preventDefault()

            const favoriteIndex = selectedIndex
            const otherIndex = selectedIndex - favoriteList.length
            if (favoriteList[favoriteIndex]?.name !== undefined) {
              navigate(`/ui/p/${favoriteList[favoriteIndex].name}`)
            }
            if (otherList[otherIndex]?.name !== undefined) {
              navigate(`/ui/p/${otherList[otherIndex].name}`)
            }
          }
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, favoriteList, otherList, columnCount, navigate, filtered])

  if (result.isPending) {
    return (
      <>
        <WithHeader title="Favorites">
          <ProjectListSkeleton amount={4} />
        </WithHeader>
        <WithHeader title="Projects">
          <ProjectListSkeleton amount={16} />
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

  if (filtered.length === 0) {
    return (
      <>
        <WithHeader title="Projects">
          <p className="pl-6">No matching projects</p>
        </WithHeader>
      </>
    )
  }

  const favoriteRefs = projectsRefs.current.slice(0, favoriteList.length)
  const projectRefs = projectsRefs.current.slice(favoriteList.length)

  return (
    <>
      {favoriteList.length > 0 && (
        <WithHeader title="Favorites">
          <ProjectList
            favorites
            entries={favoriteList}
            toggleFavorite={toggleFavorite}
            selectedIndex={selectedIndex}
            columnCount={columnCount}
            itemRefs={favoriteRefs}
          />
        </WithHeader>
      )}
      {otherList.length > 0 && (
        <WithHeader>
          <ProjectList
            entries={otherList}
            toggleFavorite={toggleFavorite}
            selectedIndex={selectedIndex - favoriteList.length}
            columnCount={columnCount}
            itemRefs={projectRefs}
          />
        </WithHeader>
      )}
    </>
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
  columnCount: number
  itemRefs: React.RefObject<HTMLLIElement>[]
  favorites?: boolean
}) {
  return (
    <ol className="mb-8 grid grid-cols-2 gap-x-1 gap-y-2 md:grid-cols-4">
      {props.entries.map((entry, i) => {
        const isSelected = i === props.selectedIndex

        return (
          <li
            ref={props.itemRefs[i]}
            className={`group flex items-center gap-2 p-1 ${isSelected ? 'rounded bg-coffee-700' : ''}`}
            key={i}
          >
            <button
              className="opacity-25 md:opacity-0 md:group-hover:opacity-100"
              onClick={() => props.toggleFavorite(entry.name)}
            >
              {props.favorites ? (
                <IconStarFull className="text-autumn-300" />
              ) : (
                <IconStarEmpty />
              )}
            </button>
            <Link to={`/ui/p/${entry.name}`}>
              <span className="block">{entry.name}</span>
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

function WithHeader({
  children,
  title = 'Projects',
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <>
      <p className="mb-2 border-coffee-600 border-b pb-2 pl-6 font-semibold text-sm uppercase">
        {title}
      </p>
      {children}
    </>
  )
}

function ProjectListSkeleton(props: { amount: number }) {
  return (
    <ol className="mb-8 grid grid-cols-2 gap-x-1 gap-y-4 md:grid-cols-4">
      {Array.from({ length: props.amount }).map((_, i) => {
        const projectNameWidth = randomWidth(40, 100)
        const chainsWidth = randomWidth(20, 80)
        return (
          <div key={i} className="flex flex-col gap-1">
            <li
              className="h-5 animate-breath rounded bg-coffee-400/50"
              style={{ width: `${projectNameWidth}%` }}
            />
            <li
              className="h-2 animate-breath rounded bg-coffee-400/30"
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
