import { usePathname } from '~/hooks/usePathname'
import { PinIcon } from '~/icons/Pin'
import { cn } from '~/utils/cn'
import { SidebarGroup } from '../core/Sidebar'
import {
  type SavedProject,
  unpinProject,
  useYourProjects,
} from './yourProjectsStore'

/** Recent rows, so the announcement under them keeps its room. */
const MAX_RECENT = 5

/**
 * Under the nav's sections: the projects the visitor pinned, then the ones
 * they opened last, all kept in the browser only. Nothing shows until there
 * are some.
 */
export function NavYourProjects({ onNavigate }: { onNavigate: () => void }) {
  const { pinned, recent } = useYourProjects()
  const pathname = usePathname()

  const pinnedHrefs = new Set(pinned.map((project) => project.href))
  const recentOnly = recent
    .filter((project) => !pinnedHrefs.has(project.href))
    .slice(0, MAX_RECENT)

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
        <SidebarGroup className="mt-5">
          <span className={LABEL_CLASS}>Pinned</span>
          <ul className="flex flex-col">
            {pinned.map((project) => row(project, true))}
          </ul>
        </SidebarGroup>
      )}
      {recentOnly.length > 0 && (
        <SidebarGroup className="mt-5">
          <span className={LABEL_CLASS}>Recently viewed</span>
          <ul className="flex flex-col">
            {recentOnly.map((project) => row(project))}
          </ul>
          {pinned.length === 0 && (
            <p className="mt-1 pl-1.5 text-2xs text-secondary leading-snug">
              Pin a project from its page to keep it here. Saved only in this
              browser.
            </p>
          )}
        </SidebarGroup>
      )}
    </>
  )
}

/** As the nav's "And more" label. */
const LABEL_CLASS =
  'pl-1.5 font-medium text-2xs text-secondary uppercase tracking-wider'

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
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2 pl-1.5 text-sm',
          isActive ? 'text-brand' : 'hover:text-primary',
        )}
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
      {pinned && (
        <button
          type="button"
          onClick={() => unpinProject(project.href)}
          aria-label={`Unpin ${project.name}`}
          title="Unpin"
          className="flex size-6 shrink-0 items-center justify-center text-secondary hover:text-primary"
        >
          <PinIcon aria-hidden className="size-3 fill-current" />
        </button>
      )}
    </li>
  )
}
