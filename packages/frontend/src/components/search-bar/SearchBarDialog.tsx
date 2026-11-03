import { assertUnreachable } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { Command as CommandPrimitive } from 'cmdk'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputActionButton,
  CommandLinkItem,
  CommandList,
} from '~/components/core/Command'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { usePathname } from '~/hooks/usePathname'
import { useTracking } from '~/hooks/useTracking'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { useTRPC } from '~/trpc/React'
import { Skeleton } from '../core/Skeleton'
import { linkVariants } from '../link/CustomLink'
import {
  type SavedProject,
  usePinnedProjects,
} from '../pinned-projects/pinnedProjectsStore'
import { useSearchBarContext } from './SearchBarContext'
import type { SearchBarCategory } from './searchBarCategories'
import { searchBarCategories } from './searchBarCategories'
import { getEmptyStateGroups } from './searchBarEmptyState'
import { searchBarPages } from './searchBarPages'
import { groupSearchResults, searchEntries } from './searchBarResults'
import type { AnySearchBarEntry } from './types'

interface Props {
  recentlyAdded: SearchBarProject[]
}

export function SearchBarDialog({ recentlyAdded }: Props) {
  const trpc = useTRPC()
  const inputRef = useRef<HTMLInputElement>(null)
  const { track } = useTracking()
  const [value, setValue] = useState('')
  const debouncedValue = useDebouncedValue(value, 200)
  const { open, setOpen } = useSearchBarContext()
  const pinnedProjects = usePinnedProjects()
  const pathname = usePathname()
  const emptyState = useMemo(
    () => getEmptyStateGroups(pinnedProjects, recentlyAdded, pathname),
    [pinnedProjects, recentlyAdded, pathname],
  )

  useGlobalShortcut('/', () => setOpen((open) => !open))

  const {
    data: searchResults,
    isFetching,
    isError,
    fetchStatus,
    refetch,
  } = useQuery(
    trpc.searchBar.search.queryOptions(debouncedValue, {
      enabled: debouncedValue !== '',
    }),
  )
  // Both leave the list empty, which would otherwise read as "No results
  // found". A paused query runs by itself on the browser's `online` event.
  const isOffline = fetchStatus === 'paused'
  const isFailed = isError && fetchStatus === 'idle'
  const showsResults = value === debouncedValue && value !== ''
  const searchProblem = !showsResults
    ? undefined
    : isOffline
      ? 'offline'
      : isFailed
        ? 'failed'
        : undefined

  useEffect(() => {
    if (debouncedValue === '') return
    track('searchBarSearched', { value: debouncedValue })
  }, [debouncedValue, track])

  const filteredPages = useMemo(
    () => searchEntries(debouncedValue, searchBarPages),
    [debouncedValue],
  )

  const grouped = useMemo(() => {
    // Pages are searched locally, so they can still be listed when the server
    // can't be reached.
    if (!searchResults && !isOffline && !isFailed) return []

    return groupSearchResults([...(searchResults ?? []), ...filteredPages])
  }, [searchResults, filteredPages, isOffline, isFailed])

  const onEscapeKeyDown = (e?: KeyboardEvent) => {
    e?.preventDefault()
    if (value !== '') {
      setValue('')
      return
    }
    setOpen(false)
  }

  function onItemFollow(
    item: SearchBarProject | AnySearchBarEntry | SavedProject,
    staysOnPage: boolean,
  ) {
    track('searchBarProjectSelected', {
      name: item.name,
    })
    // Stays open so several results can be opened side by side to compare.
    if (staysOnPage) return
    setOpen(false)
    // Clear after the dialog's close animation (100ms) so the input
    // doesn't visibly reset and flash the "Recently added" list mid-close.
    setTimeout(() => setValue(''), 200)
  }

  // Hide virtual keyboard on touch start
  useOnClickOutside(inputRef, () => inputRef.current?.blur(), 'touchstart')

  return (
    <CommandDialog
      title="Search"
      description="Search projects, tokens and protocols by name or address"
      open={open}
      onOpenChange={setOpen}
      onEscapeKeyDown={onEscapeKeyDown}
      fullScreenMobile
    >
      <Command shouldFilter={false} className="rounded-none">
        <SearchBarInput
          ref={inputRef}
          value={value}
          onValueChange={setValue}
          onAction={() => onEscapeKeyDown()}
        />
        <CommandList className="max-h-screen supports-[height:100dvh]:max-h-dvh md:h-[270px] md:max-h-[270px]">
          {((value !== debouncedValue && value !== '') || isFetching) && (
            <CommandPrimitive.Loading>
              <CommandGroup>
                <div className="flex h-8 items-center px-2 py-3">
                  <Skeleton className="h-4 w-[150px] rounded-sm" />
                </div>
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
              </CommandGroup>
            </CommandPrimitive.Loading>
          )}
          <SearchBarNotice>
            {searchProblem === 'offline' ? (
              "You're offline. Results will appear once you're back online."
            ) : searchProblem === 'failed' ? (
              <>
                Couldn't search projects and tokens.{' '}
                <button
                  type="button"
                  className={linkVariants()}
                  onClick={() => void refetch()}
                >
                  Try again
                </button>
              </>
            ) : null}
          </SearchBarNotice>
          {!searchProblem && <CommandEmpty>No results found.</CommandEmpty>}

          {value === '' && (
            <>
              <SavedProjectsGroup
                heading="Pinned"
                projects={emptyState.pinned}
                onFollow={onItemFollow}
              />
              <SavedProjectsGroup
                heading="Recently viewed"
                projects={emptyState.recentlyViewed}
                onFollow={onItemFollow}
              />
            </>
          )}
          {value === '' && (
            <CommandGroup heading="Recently added projects">
              {emptyState.recentlyAdded.map((project) => {
                return (
                  <SearchBarItem
                    key={project.id}
                    href={project.href}
                    onFollow={(staysOnPage) =>
                      onItemFollow(project, staysOnPage)
                    }
                    label={entryToLabel(project)}
                  >
                    <img
                      src={project.iconUrl}
                      alt={`${project.name} logo`}
                      className="rounded-sm"
                      width={20}
                      height={20}
                    />
                    <div className="flex flex-col">
                      <div className="font-medium text-sm leading-none tracking-[-1%]">
                        {project.name}
                      </div>
                      {project.l2Category && (
                        <div className="font-medium text-2xs text-secondary leading-none tracking-[-1%]">
                          {project.l2Category}
                        </div>
                      )}
                    </div>
                  </SearchBarItem>
                )
              })}
            </CommandGroup>
          )}
          {showsResults &&
            grouped.length > 0 &&
            grouped.map(([group, items], groupIndex) => (
              <CommandGroup
                heading={searchBarCategories[group as SearchBarCategory].name}
                key={group}
              >
                {items.map((item, index) => {
                  return (
                    <SearchBarItem
                      key={item.href}
                      href={item.href}
                      onFollow={(staysOnPage) =>
                        onItemFollow(item, staysOnPage)
                      }
                      label={entryToLabel(item)}
                      value={
                        // I know it looks ugly but there is a bug in CMDK that scrolls to wrong item sometimes.
                        // For example try to search "nea" without this hack.
                        // It will scroll to "Neva" but highlight "Rainbow Bridge" (highlight is correct cuz near is tag for it)
                        // Using '-' as value makes first item always selected.
                        // https://github.com/pacocoursey/cmdk/issues/171#issuecomment-1775421795
                        groupIndex === 0 && index === 0
                          ? '-'
                          : entryToValue(item)
                      }
                    >
                      {item.type !== 'page' && (
                        <img
                          src={item.iconUrl}
                          alt={`${item.name} ${item.type === 'token' ? 'icon' : 'logo'}`}
                          className={
                            item.type === 'token'
                              ? 'rounded-full'
                              : 'rounded-sm'
                          }
                          width={20}
                          height={20}
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="font-medium text-sm leading-none tracking-[-1%]">
                          {item.name}
                        </div>
                        {item.type === 'project' && item.l2Category && (
                          <div className="font-medium text-2xs text-secondary leading-none tracking-[-1%]">
                            {item.l2Category}
                          </div>
                        )}
                        {item.type === 'token' && item.issuer && (
                          <div className="font-medium text-2xs text-secondary capitalize leading-none tracking-[-1%]">
                            {item.issuer}
                          </div>
                        )}
                      </div>
                    </SearchBarItem>
                  )
                })}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

/**
 * The visitor's own projects, saved with only a name and an icon, so their
 * rows carry no kind label.
 */
function SavedProjectsGroup({
  heading,
  projects,
  onFollow,
}: {
  heading: string
  projects: SavedProject[]
  onFollow: (project: SavedProject, staysOnPage: boolean) => void
}) {
  if (projects.length === 0) return null
  return (
    <CommandGroup heading={heading}>
      {projects.map((project) => (
        <SearchBarItem
          key={project.href}
          href={project.href}
          onFollow={(staysOnPage) => onFollow(project, staysOnPage)}
          // cmdk keys items by value, which defaults to the row's text; two
          // projects can share a name.
          value={`${heading}-${project.href}`}
        >
          <img
            src={project.iconUrl}
            alt={`${project.name} logo`}
            className="rounded-sm"
            width={20}
            height={20}
          />
          <div className="font-medium text-sm leading-none tracking-[-1%]">
            {project.name}
          </div>
        </SearchBarItem>
      ))}
    </CommandGroup>
  )
}

function SearchBarItem({
  href,
  onFollow,
  children,
  label,
  value,
}: {
  href: string
  onFollow: (staysOnPage: boolean) => void
  children: React.ReactNode
  label?: string
  value?: string
}) {
  return (
    <CommandLinkItem
      className="gap-2 rounded-lg"
      href={href}
      onFollow={onFollow}
      value={value}
    >
      {children}
      {label && (
        <div className="ml-auto text-secondary text-xs leading-none">
          {label}
        </div>
      )}
    </CommandLinkItem>
  )
}

// Rendered even when empty: screen readers announce changes only to a live
// region that is already in the page.
function SearchBarNotice({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="border-divider border-b px-4 py-3 text-center text-sm last:border-none empty:border-none empty:p-0"
    >
      {children}
    </div>
  )
}

function SearchBarItemSkeleton() {
  return (
    <div className="flex h-11 items-center justify-between px-2 py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded-sm" />
        <Skeleton className="h-[15px] w-20 rounded-sm" />
      </div>
      <Skeleton className="h-3.5 w-[45px] rounded-sm" />
    </div>
  )
}

function entryToValue(entry: AnySearchBarEntry) {
  if (entry.type === 'page') {
    return `${entry.category}-${entry.name}-${entry.type}`
  }

  if (entry.type === 'token') {
    return `${entry.category}-${entry.id}-${entry.type}`
  }

  return `${entry.category}-${entry.id}-${entry.type}-${entry.kind}`
}

function entryToLabel(entry: AnySearchBarEntry) {
  if (entry.type === 'page') return 'Page'
  if (entry.type === 'token') return 'Token'

  switch (entry.kind) {
    case 'ethereum':
      return 'Base layer'
    case 'chain':
      return 'Chain'
    case 'layer2':
      return 'Layer 2'
    case 'layer3':
      return 'Layer 3'
    case 'interop':
      return 'Interop'
    case 'zkCatalog':
      return 'ZK Project'
    case 'privacy':
      return 'Privacy'
    case 'defi':
      return 'DeFi'
    default:
      assertUnreachable(entry.kind)
  }
}

/**
 * Mounted only while the dialog is open, so the breakpoint listener is too.
 * The full placeholder would be cut off on phones (below 550px), where
 * "Close" sits beside it.
 */
function SearchBarInput({
  ref,
  value,
  onValueChange,
  onAction,
}: {
  ref: React.Ref<HTMLInputElement>
  value: string
  onValueChange: (value: string) => void
  onAction: () => void
}) {
  const breakpoint = useBreakpoint()
  const isPhone = breakpoint === 'xs'
  return (
    <CommandInput
      ref={ref}
      placeholder={
        isPhone
          ? 'Projects, tokens or addresses'
          : 'Search projects, tokens, protocols or addresses'
      }
      value={value}
      onValueChange={onValueChange}
    >
      <CommandInputActionButton onClick={onAction}>
        {value !== '' ? 'Clear' : 'Close'}
      </CommandInputActionButton>
    </CommandInput>
  )
}
