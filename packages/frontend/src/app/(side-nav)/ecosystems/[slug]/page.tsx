import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ps } from '~/server/projects'

interface Props {
  params: Promise<{
    slug: string
  }>
}

async function getEcosystemProjectEntry(slug: string) {
  const ecosystem = await ps.getProject({
    slug,
    select: ['ecosystemConfig'],
  })

  if (!ecosystem) {
    return undefined
  }

  const projects = await ps.getProjects({
    select: ['ecosystemInfo'],
  })
  const ecosystemProjects = projects.filter(
    (p) => p.ecosystemInfo.id === ecosystem.id,
  )

  return {
    ...ecosystem,
    projects: ecosystemProjects,
  }
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
          '--ecosystem-primary': ecosystem.ecosystemConfig.colors.primary,
          '--ecosystem-secondary': ecosystem.ecosystemConfig.colors.secondary,
        } as React.CSSProperties
      }
    >
      <div className="absolute right-0 top-20 -z-1 h-[2400px] w-[calc(100vw_-_15rem)] -translate-y-1/2 translate-x-1/2 bg-gradient-radial from-ecosystem-primary via-ecosystem-secondary via-25% to-transparent"></div>
      <div>
        <MainPageHeader>{ecosystem.name}</MainPageHeader>
        <main className="flex flex-wrap gap-4">
          {ecosystem.projects.map((p) => (
            <PrimaryCard key={p.id} className="flex shrink-0 gap-4">
              <Image
                src={`/icons/${p.slug}.png`}
                alt={p.name}
                width={128}
                height={128}
              />
            </PrimaryCard>
          ))}
        </main>
      </div>
    </div>
  )
}
