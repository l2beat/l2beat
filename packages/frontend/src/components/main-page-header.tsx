import { Layer2, Layer3, layer2s, layer3s } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { SearchBar } from './search-bar'

interface Props {
  children: string
  description?: string
  className?: string
}

export function MainPageHeader({ children, description, className }: Props) {
  const projects = [...layer2s, ...layer3s]
  const recentlyAdded = projects
    .filter((p) => p.isUpcoming)
    .sort(
      (a, b) => (b.createdAt?.toNumber() ?? 0) - (a.createdAt?.toNumber() ?? 0),
    )
    .slice(0, 5)
    .map(toProject)
  const allProjects = projects.map(toProject)

  return (
    <header
      className={cn(
        'ml-6 flex h-20 items-center justify-between max-lg:hidden',
        className,
      )}
    >
      <div className="flex flex-col justify-center">
        <h1
          className={cn(
            'font-bold',
            description ? 'text-2xl leading-none' : 'text-[26px]',
          )}
        >
          {children}
        </h1>
        {description && (
          <p className="mt-0.5 text-xs text-secondary">{description}</p>
        )}
      </div>
      <SearchBar recentlyAdded={recentlyAdded} allProjects={allProjects} />
    </header>
  )
}

function toProject(project: Layer2 | Layer3) {
  return {
    id: project.id,
    name: project.display.name,
    slug: project.display.slug,
  }
}
