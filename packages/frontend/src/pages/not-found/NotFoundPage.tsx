import { Button } from '~/components/core/Button'
import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PlainLink } from '~/components/PlainLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useSearchBarContext } from '~/components/search-bar/SearchBarContext'
import { searchBarCategories } from '~/components/search-bar/searchBarCategories'
import { SearchIcon } from '~/icons/Search'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import type { SectionIndex } from './notFoundUrl'

interface Props extends AppLayoutProps {
  searchQuery: string
  sectionIndex: SectionIndex | undefined
  suggestions: SearchBarProject[]
}

export function NotFoundPage({
  searchQuery,
  sectionIndex,
  suggestions,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Page not found</MainPageHeader>
        <PrimaryCard className="flex grow flex-col items-center justify-center gap-6 py-16 text-center max-md:bg-transparent">
          <p className="font-bold text-[80px] text-brand leading-none">404</p>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">This page doesn't exist</h2>
            <p className="text-secondary text-sm">
              The page you are looking for was moved, removed or never existed.
            </p>
          </div>
          {suggestions.length > 0 && <Suggestions projects={suggestions} />}
          <SearchProjectsButton query={searchQuery} />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {sectionIndex && (
              <CustomLink href={sectionIndex.href}>
                Go to {sectionIndex.name}
              </CustomLink>
            )}
            <CustomLink href="/">Go to main page</CustomLink>
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}

function Suggestions({ projects }: { projects: SearchBarProject[] }) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <h3 className="font-medium text-secondary text-xs uppercase">
        Did you mean
      </h3>
      <ul className="flex flex-col gap-1">
        {projects.map((project) => (
          <li key={project.href}>
            <PlainLink
              href={project.href}
              className="flex items-center gap-2 rounded-lg border border-divider px-3 py-2 text-left transition-colors hover:bg-surface-secondary"
            >
              <img
                src={project.iconUrl}
                alt=""
                className="rounded-sm"
                width={20}
                height={20}
              />
              <span className="font-medium text-sm">{project.name}</span>
              <span className="ml-auto text-secondary text-xs">
                {searchBarCategories[project.category].name}
              </span>
            </PlainLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchProjectsButton({ query }: { query: string }) {
  const { openWithQuery } = useSearchBarContext()
  return (
    <Button
      variant="fill"
      className="gap-2"
      onClick={() => openWithQuery(query)}
    >
      <SearchIcon className="size-4 fill-current" />
      Search projects
    </Button>
  )
}
