import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { usePathname } from '~/hooks/usePathname'
import { PinIcon } from '~/icons/Pin'
import { cn } from '~/utils/cn'
import { SidebarGroup, SidebarGroupLabel } from '../core/Sidebar'
import { prerenderYourProjects } from './prerenderYourProjects'
import {
  pinProject,
  type SavedProject,
  STORAGE_KEY,
  unpinProject,
  useYourProjects,
} from './yourProjectsStore'

/** Recent rows, so the announcement under them keeps its room. */
const RECENT_ROWS = 5

const WRAPPER_CLASS = 'contents'
const LISTS_ROLE = 'your-projects'
// React 19 sets innerHTML whenever this object changes identity, which would
// wipe the prerendered lists before React takes over.
const KEEP_SERVER_MARKUP = { __html: '' }

/**
 * Under the nav's sections: the projects the visitor pinned, then the ones
 * they opened last, all kept in the browser only. Nothing shows until there
 * are some.
 *
 * The lists live in localStorage and pages are cached at the edge, so the
 * server can't render them. An inline script draws them from the server's
 * row templates before the first paint, and React keeps that markup while it
 * hydrates, then swaps in its own. Without it the lists would pop in on every
 * page load.
 */
export function NavYourProjects({ onNavigate }: { onNavigate: () => void }) {
  const isHydrated = useIsHydrated()

  if (typeof window === 'undefined') {
    return (
      <div key="prerendered" className={WRAPPER_CLASS}>
        <PrerenderTemplates />
      </div>
    )
  }
  if (!isHydrated) {
    return (
      <div
        key="prerendered"
        className={WRAPPER_CLASS}
        dangerouslySetInnerHTML={KEEP_SERVER_MARKUP}
        // Differs from the server's on purpose; React would log it in dev.
        suppressHydrationWarning
      />
    )
  }
  return (
    <div key="live" className={WRAPPER_CLASS} data-role={LISTS_ROLE}>
      <YourProjectsLists onNavigate={onNavigate} />
    </div>
  )
}

function YourProjectsLists({ onNavigate }: { onNavigate: () => void }) {
  const { pinned, recent, hasPinned } = useYourProjects()
  const pathname = usePathname()

  const pinnedHrefs = new Set(pinned.map((project) => project.href))
  const recentOnly = recent
    .filter((project) => !pinnedHrefs.has(project.href))
    .slice(0, RECENT_ROWS)

  const row = (project: SavedProject, isPinned?: boolean) => (
    <ProjectRow
      key={project.href}
      project={project}
      isActive={project.href === pathname}
      onNavigate={onNavigate}
      pinned={isPinned}
    />
  )

  return (
    <>
      {pinned.length > 0 && (
        <YourProjectsGroup label="Pinned">
          {pinned.map((project) => row(project, true))}
        </YourProjectsGroup>
      )}
      {recentOnly.length > 0 && (
        <YourProjectsGroup label="Recently viewed" withPinningHint={!hasPinned}>
          {recentOnly.map((project) => row(project))}
        </YourProjectsGroup>
      )}
    </>
  )
}

/**
 * One group per list, each holding a single placeholder row. The script
 * clones the row per project, so the markup has one source: the components
 * React renders later.
 */
function PrerenderTemplates() {
  const placeholder: SavedProject = { href: '#', name: '', iconUrl: 'data:,' }
  const script = `(${prerenderYourProjects.toString()})(document.currentScript.parentElement, ${JSON.stringify(STORAGE_KEY)}, ${RECENT_ROWS})`
  return (
    <>
      <template data-list="pinned">
        <YourProjectsGroup label="Pinned">
          <ProjectRow
            project={placeholder}
            isActive={false}
            onNavigate={() => {}}
            pinned
          />
        </YourProjectsGroup>
      </template>
      <template data-list="recent">
        <YourProjectsGroup label="Recently viewed" withPinningHint>
          <ProjectRow
            project={placeholder}
            isActive={false}
            onNavigate={() => {}}
          />
        </YourProjectsGroup>
      </template>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  )
}

function YourProjectsGroup({
  label,
  withPinningHint,
  children,
}: {
  label: string
  withPinningHint?: boolean
  children: ReactNode
}) {
  return (
    <SidebarGroup className="mt-5">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <ul className="flex flex-col">{children}</ul>
      {withPinningHint && (
        <p className="mt-1 pl-1.5 text-2xs text-secondary leading-snug">
          Pin a project to keep it here. Saved only in this browser.
        </p>
      )}
    </SidebarGroup>
  )
}

function ProjectRow({
  project,
  isActive,
  onNavigate,
  pinned,
}: {
  project: SavedProject
  isActive: boolean
  onNavigate: () => void
  pinned?: boolean
}) {
  return (
    <li className="group/row flex h-7 items-center gap-1">
      <a
        href={project.href}
        onClick={onNavigate}
        data-active={isActive}
        className="flex min-w-0 flex-1 items-center gap-2 pl-1.5 text-sm hover:text-primary data-[active=true]:text-brand"
      >
        <img
          src={project.iconUrl}
          alt=""
          className="size-4 shrink-0 rounded-full"
        />
        <span className="min-w-0 flex-1 truncate font-medium">
          {project.name}
        </span>
      </a>
      <button
        type="button"
        onClick={(event) => {
          const lists = event.currentTarget.closest(`[data-role=${LISTS_ROLE}]`)
          if (pinned) unpinProject(project.href)
          else pinProject(project)
          focusProjectButton(lists, project.href)
        }}
        data-href={project.href}
        aria-label={`${pinned ? 'Unpin' : 'Pin'} ${project.name}`}
        title={pinned ? 'Unpin' : 'Pin'}
        className={cn(
          'flex size-6 shrink-0 items-center justify-center text-secondary hover:text-primary',
          // Recent rows show it on hover, on screens that have one: a
          // landscape tablet is wide enough for the desktop nav.
          !pinned &&
            'focus-visible:opacity-100 lg:group-hover/row:opacity-100 lg:[@media(hover:hover)]:opacity-0',
        )}
      >
        <PinIcon
          aria-hidden
          className={cn('size-3', pinned && 'fill-current')}
        />
      </button>
    </li>
  )
}

/**
 * Pinning moves the row to the other list and unmounts the clicked button,
 * so a keyboard user would land back at the top of the page. Focus follows
 * the project to its new row. An unpinned project past the recent rows
 * shown has none, so focus goes to the first row left.
 */
function focusProjectButton(lists: Element | null, href: string) {
  requestAnimationFrame(() => {
    const button =
      lists?.querySelector<HTMLElement>(
        `button[data-href="${CSS.escape(href)}"]`,
      ) ?? lists?.querySelector<HTMLElement>('button[data-href]')
    button?.focus()
  })
}

/**
 * False while React hydrates the server markup, true afterwards and on any
 * later mount, such as the mobile nav opening.
 */
function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )
}

function subscribeToNothing() {
  return () => {}
}
