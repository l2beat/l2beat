import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from './api/api'
import type { ApiProjectEntry } from './api/types'
import { IconStarEmpty } from './icons/IconStarEmpty'
import { IconStarFull } from './icons/IconStarFull'

export function HomePage() {
  const [search, setSearch] = useState('')
  return (
    <div className="mx-auto max-w-screen-md p-4">
      <h1 className="my-8 flex justify-center">
        <img className="w-[400px]" src="/logo.svg" alt="DSCVRY" />
      </h1>
      <input
        className="mx-auto mb-8 block w-[464px] border border-coffee-600 bg-coffee-800 px-4 py-2 placeholder:text-coffee-400"
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
  useEffect(() => {
    writeFavorites(favorites)
  }, [favorites])

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

  const filtered = result.data.filter((x) => x.name.includes(props.search))
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
          />
        </>
      )}
      {otherList.length > 0 && (
        <>
          <p className="mb-2 border-coffee-600 border-b pb-2 pl-6 font-semibold text-sm uppercase">
            Projects
          </p>
          <ProjectList entries={otherList} toggleFavorite={toggleFavorite} />
        </>
      )}
    </>
  )
}

function ProjectList(props: {
  entries: ApiProjectEntry[]
  toggleFavorite: (project: string) => void
  favorites?: boolean
}) {
  return (
    <ol className="mb-8 grid grid-cols-4 gap-x-1 gap-y-2">
      {props.entries.map((entry, i) => (
        <li className="group flex items-center gap-2" key={i}>
          <button
            className="opacity-0 group-hover:opacity-100"
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
      ))}
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
