import { notFound } from 'next/navigation'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { FullGreenPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-green-pizza'
import { FullRedPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-red-pizza'
import { FullYellowPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-yellow-pizza'
import { Step5 } from '~/components/step-5'
import { ps } from '~/server/projects'

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
    <PrimaryCard className="mt-[83px] min-h-[350px]">
      <div className="hidden">
        <FullRedPizzaSymbol />
        <FullYellowPizzaSymbol />
        <FullGreenPizzaSymbol />
      </div>
      <div>
        <Step5 data={project} />
      </div>
    </PrimaryCard>
  )
}
