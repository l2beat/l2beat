import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ps } from '~/server/projects'
import { L2BeatzzaResult } from './_components/result'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params

  const project = await ps.getProject({
    slug: params.slug,
    select: ['scalingRisks'],
  })

  if (!project) {
    return notFound()
  }

  return (
    <PrimaryCard className="min-h-[350px] pb-16 pt-8 md:mt-[83px]">
      <L2BeatzzaResult project={project} />
    </PrimaryCard>
  )
}
