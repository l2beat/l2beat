import { SearchIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Label } from '~/components/core/Label'
import {
  SidebarInput,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/core/Sidebar'

export function SidebarSearch() {
  const [search, setSearch] = useState('')
  const [focusOnExpand, setFocusOnExpand] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { state, isMobile, setOpen } = useSidebar()
  const collapsed = state === 'collapsed' && !isMobile

  useEffect(() => {
    if (!collapsed && focusOnExpand) {
      inputRef.current?.focus()
      setFocusOnExpand(false)
    }
  }, [collapsed, focusOnExpand])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search === '') return
    void navigate(`/token-db/search/${search}`)
  }

  if (collapsed) {
    // An icon-wide input is unusable, so expand the sidebar to search.
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="Search tokens"
          onClick={() => {
            setFocusOnExpand(true)
            setOpen(true)
          }}
        >
          <SearchIcon />
          <span>Search tokens</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <form onSubmit={onSubmit} className="relative">
        <Label htmlFor="token-db-search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          ref={inputRef}
          id="token-db-search"
          placeholder="Search the tokens..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 select-none opacity-50" />
      </form>
    </SidebarMenuItem>
  )
}
