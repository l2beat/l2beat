import { assertUnreachable } from '@l2beat/shared-pure'
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
  keepEnterOnButton,
} from '~/components/core/Command'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { usePathname } from '~/hooks/usePathname'
import { useTracking } from '~/hooks/useTracking'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { Skeleton } from '../core/Skeleton'
import { linkVariants } from '../link/CustomLink'
import {
  type SavedProject,
  usePinnedProjects,
} from '../pinned-projects/pinnedProjectsStore'
import { trackScrollFades } from '../ScrollWithGradient'
import { useSearchBarContext } from './SearchBarContext'
import { isApple, Kbd, SEARCH_TIPS_ID, SearchBarTips } from './SearchBarTips'
import type { SearchBarCategory } from './searchBarCategories'
import { searchBarCategories } from './searchBarCategories'
import { getEmptyStateGroups } from './searchBarEmptyState'
import type { AnySearchBarEntry } from './types'
import { useSearchBarResults } from './useSearchBarResults'

export function SearchBarDialog() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { track } = useTracking()
  const [value, setValue] = useState('')
  const debouncedValue = useDebouncedValue(value, 200)
  const { open, setOpen } = useSearchBarContext()
  const pinnedProjects = usePinnedProjects()
  const pathname = usePathname()
  const [tipsOpen, setTipsOpen] = useState(false)
  // Typing replaces the tips with results, and clearing brings them back.
  const showsTips = tipsOpen && value === ''
  const showsEmptyState = value === '' && !showsTips

  useEffect(() => {
    if (!open) setTipsOpen(false)
  }, [open])

  useGlobalShortcut('/', () => setOpen((open) => !open))

  const {
    groups: grouped,
    showsResults,
    isLoading,
    problem: searchProblem,
    retry,
    recentlyAdded,
  } = useSearchBarResults({ value, debouncedValue, open })
  const emptyState = useMemo(
    () => getEmptyStateGroups(pinnedProjects, recentlyAdded ?? [], pathname),
    [pinnedProjects, recentlyAdded, pathname],
  )

  useEffect(() => {
    if (debouncedValue === '') return
    track('searchBarSearched', { value: debouncedValue })
  }, [debouncedValue, track])

  const onEscapeKeyDown = (e?: KeyboardEvent) => {
    e?.preventDefault()
    if (value !== '') {
      setValue('')
      return
    }
    if (tipsOpen) {
      setTipsOpen(false)
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

  function showTips() {
    setValue('')
    setTipsOpen(true)
    // Typing is what replaces the tips, so the input keeps focus. The no
    // results link that opened them is gone, and would drop it. Not on touch,
    // where focus raises the on-screen keyboard over the tips.
    if (window.matchMedia('(pointer: fine)').matches) {
      inputRef.current?.focus()
    }
  }

  function searchExample(query: string) {
    setValue(query)
    setTipsOpen(false)
    inputRef.current?.focus()
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
          // Closes even with the tips open, as its label says; Esc goes Back.
          onAction={() => (value !== '' ? setValue('') : setOpen(false))}
        />
        <CommandList
          ref={trackScrollFades}
          // Below md the dialog is full screen, and the list fills what the
          // input and the footer leave.
          className="max-md:max-h-none max-md:min-h-0 max-md:flex-1 md:h-[270px] md:max-h-[270px]"
        >
          {isLoading && (
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
                  onClick={retry}
                  onKeyDown={keepEnterOnButton}
                >
                  Try again
                </button>
              </>
            ) : null}
          </SearchBarNotice>
          {!searchProblem && !showsTips && (
            <CommandEmpty>
              No results found.{' '}
              <button
                type="button"
                className={linkVariants()}
                onClick={showTips}
                onKeyDown={keepEnterOnButton}
              >
                See what you can search
              </button>
            </CommandEmpty>
          )}

          {showsTips && <SearchBarTips onExample={searchExample} />}
          {showsEmptyState && (
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
          {showsEmptyState && emptyState.recentlyAdded.length > 0 && (
            <CommandGroup heading="Recently added projects">
              {emptyState.recentlyAdded.map((project) => {
                return (
                  <SearchBarItem
                    key={project.href}
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
        <SearchBarFooter
          hasResults={
            showsEmptyState
              ? emptyState.pinned.length +
                  emptyState.recentlyViewed.length +
                  emptyState.recentlyAdded.length >
                0
              : !showsTips && showsResults && grouped.length > 0
          }
          escapeAction={value !== '' ? 'Clear' : showsTips ? 'Back' : 'Close'}
          tipsOpen={showsTips}
          onToggleTips={() => (showsTips ? setTipsOpen(false) : showTips())}
        />
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

/**
 * Where the tips live: out of the way of the results, but always in reach,
 * as few visitors guess that search finds tokens, pages and addresses too.
 */
function SearchBarFooter({
  hasResults,
  escapeAction,
  tipsOpen,
  onToggleTips,
}: {
  /** Whether Enter has anything to open. */
  hasResults: boolean
  /** What Esc does now; see `onEscapeKeyDown`. */
  escapeAction: 'Clear' | 'Back' | 'Close'
  tipsOpen: boolean
  onToggleTips: () => void
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-divider border-t px-4 py-2 text-secondary text-xs">
      <button
        type="button"
        aria-expanded={tipsOpen}
        aria-controls={SEARCH_TIPS_ID}
        onClick={onToggleTips}
        onKeyDown={keepEnterOnButton}
        // Underlined, as nothing else in grey says it can be clicked. On touch
        // it takes the footer's height, being the only thing in it.
        className="pointer-coarse:-my-2 pointer-coarse:-ml-2 rounded-sm pointer-coarse:py-2 pointer-coarse:pr-4 pointer-coarse:pl-2 font-medium underline decoration-dotted underline-offset-[3px] transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {tipsOpen ? 'Hide search tips' : 'Search tips'}
      </button>
      {/* Touch usually comes without a keyboard. */}
      <div className="flex not-can-hover:hidden items-center gap-3">
        {hasResults && (
          <>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <Kbd>{isApple() ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>↵</Kbd>
              </span>
              New tab
            </span>
          </>
        )}
        <span className="flex items-center gap-1.5">
          <Kbd>Esc</Kbd>
          {escapeAction}
        </span>
      </div>
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
