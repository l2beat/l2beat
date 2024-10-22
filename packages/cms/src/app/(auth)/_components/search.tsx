'use client'

import { Search as SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { Input } from '~/components/ui/input'

export function Search() {
  const pathname = usePathname()
  const [search, setSearch] = useQueryState('search', {
    shallow: false,
    throttleMs: 1000,
  })

  if (pathname.split('/').length > 2) return null

  const what = pathname.split('/')[1]

  return (
    <form>
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search ${what}...`}
          className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  )
}
