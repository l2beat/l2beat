import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Label } from './core/Label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from './core/Sidebar'

export function SidebarSearch() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search === '') return
    navigate(`/search/${search}`)
  }

  return (
    <form onSubmit={onSubmit}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the tokens..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
