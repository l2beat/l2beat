import { notFound } from 'next/navigation'
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
    <div className="mt-16 flex w-full items-center justify-center rounded-e-md bg-surface-primary px-8 py-12 md:h-[560px] md:max-w-[800px]">
      <div className="size-0">
        <FullRedPizzaSymbol />
        <FullYellowPizzaSymbol />
        <FullGreenPizzaSymbol />
      </div>
      <div>
        <Step5 data={project} />
      </div>
    </div>
  )
}
