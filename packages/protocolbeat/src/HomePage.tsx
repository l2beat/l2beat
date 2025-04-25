import { useQuery } from '@tanstack/react-query'
import { createRef, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProjects } from './api/api'
import type { ApiProjectEntry } from './api/types'
import { IconStarEmpty } from './icons/IconStarEmpty'
import { IconStarFull } from './icons/IconStarFull'

export function HomePage() {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="mx-auto max-w-screen-md p-4">
      <h1 className="my-8 flex justify-center">
        <img className="w-[200px] md:w-[400px]" src="/logo.svg" alt="DSCVRY" />
      </h1>
      <input
        ref={inputRef}
        className="mx-auto mb-8 block w-full max-w-[464px] border border-coffee-600 bg-coffee-800 px-4 py-2 placeholder:text-coffee-400"
        placeholder="Filter projects"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <AllProjects search={search} />
    </div>
  )
}

function AllProjects(props: { search: string }) {
  const result = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
  const [favorites, setFavorites] = useState<string[]>(readFavorites)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
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
    if (result.isSuccess) {
      const search = props.search.toLowerCase()
      const filtered = result.data.filter((x) => matchesFilter(search, x))
      setSelectedIndex(filtered.length === 1 ? 0 : -1)
    }
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

  useEffect(() => {
    if (result.isSuccess) {
      const search = props.search.toLowerCase()
      const filtered = result.data.filter((x) => matchesFilter(search, x))
      projectsRefs.current = Array(filtered.length)
        .fill(null)
        .map((_, i) => projectsRefs.current[i] || createRef<HTMLLIElement>())
        .filter(
          (ref): ref is React.RefObject<HTMLLIElement> => ref !== undefined,
        ) as Array<React.RefObject<HTMLLIElement>> // Add type assertion here
    }
  }, [result.isSuccess, props.search, favorites])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!result.isSuccess) return

      const search = props.search.toLowerCase()
      const filtered = result.data.filter((x) => matchesFilter(search, x))
      const breakIndex = filtered.filter((x) =>
        favorites.includes(x.name),
      ).length

      if (filtered.length === 0) return

      if (selectedIndex === -1) {
        setSelectedIndex(0)
      }

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

            if (
              selectedIndex < filtered.length &&
              filtered[selectedIndex]?.name !== undefined
            ) {
              navigate(`/ui/p/${filtered[selectedIndex].name}`)
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
  }, [
    result.isSuccess,
    props.search,
    selectedIndex,
    favorites,
    columnCount,
    navigate,
  ])

  if (result.isPending) {
    return <div>Loading</div>
  }

  if (result.isError) {
    return <div>Error</div>
  }

  function toggleFavorite(project: string) {
    if (favorites.includes(project)) {
      setFavorites(favorites.filter((x) => x !== project))
    } else {
      setFavorites([...favorites, project])
    }
  }

  const search = props.search.toLowerCase()
  const filtered = result.data.filter((x) => matchesFilter(search, x))
  const favoriteList = filtered.filter((x) => favorites.includes(x.name))
  const otherList = filtered.filter((x) => !favorites.includes(x.name))

  if (filtered.length === 0) {
    return (
      <>
        <p className="mb-2 border-coffee-600 border-b pb-2 pl-6 font-semibold text-sm uppercase">
          Projects
        </p>
        <p className="pl-6">No matching projects</p>
      </>
    )
  }

  const favoriteRefs = projectsRefs.current.slice(0, favoriteList.length)
  const projectRefs = projectsRefs.current.slice(favoriteList.length)

  return (
    <>
      {favoriteList.length > 0 && (
        <>
          <p className="mb-2 border-coffee-600 border-b pb-2 pl-6 font-semibold text-sm uppercase">
            Favorites
          </p>
          <ProjectList
            favorites
            entries={favoriteList}
            toggleFavorite={toggleFavorite}
            selectedIndex={selectedIndex}
            columnCount={columnCount}
            itemRefs={favoriteRefs}
          />
        </>
      )}
      {otherList.length > 0 && (
        <>
          <p className="mb-2 border-coffee-600 border-b pb-2 pl-6 font-semibold text-sm uppercase">
            Projects
          </p>
          <ProjectList
            entries={otherList}
            toggleFavorite={toggleFavorite}
            selectedIndex={selectedIndex - favoriteList.length}
            columnCount={columnCount}
            itemRefs={projectRefs}
          />
        </>
      )}
    </>
  )
}

function matchesFilter(search: string, entry: ApiProjectEntry): boolean {
  if (search.startsWith('%')) {
    return entry.contractNames.some((c) => c.includes(search.slice(1)))
  }

  return (
    entry.name.includes(search) ||
    entry.addresses.some((a) => a.includes(search))
  )
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
              <span className="-mb-0.5 block">{entry.name}</span>
              <span className="block text-coffee-400 text-xs uppercase">
                {getChains(entry.chains)}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

function getChains(chains: string[]) {
  const [first, second] = chains
  if (!first) {
    return 'No chains!'
  }
  if (!second) {
    return first
  }
  if (chains.length === 2) {
    return `${first}, ${second}`
  }
  return `${chains.length} chains`
}

function readFavorites() {
  return localStorage.getItem('favorites')?.split(',') ?? []
}

function writeFavorites(favorites: string[]) {
  localStorage.setItem('favorites', favorites.join(','))
}
