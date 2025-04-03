import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getEcosystemProjectEntry } from '~/server/features/ecosystems/get-ecosystem-project-entry'
import { EcosystemPageHeader } from '../_components/ecosystem-page-header'
import { EcosystemProjectsTable } from '../_components/ecosystem-projects-table'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const ecosystem = await getEcosystemProjectEntry(slug)

  if (!ecosystem) {
    return notFound()
  }

  return (
    <div
      className="relative z-[0]"
      style={
        {
          '--ecosystem-primary': ecosystem.colors.primary,
          '--ecosystem-secondary': ecosystem.colors.secondary,
        } as React.CSSProperties
      }
    >
      <div className="fixed right-[20%] top-44 -z-1 h-[2400px] w-screen -translate-y-1/2 translate-x-1/2 bg-gradient-radial from-ecosystem-primary via-ecosystem-secondary via-25% to-transparent lg:top-20 lg:w-[calc(100vw_-_15rem)]"></div>
      <div>
        <EcosystemPageHeader
          logo={ecosystem.logo}
          badges={ecosystem.badges}
          links={ecosystem.links}
        />
        <main className="mt-3">
          <PrimaryCard>
            <EcosystemProjectsTable entries={ecosystem.projects} />
          </PrimaryCard>
        </main>
      </div>
    </div>
  )
}
