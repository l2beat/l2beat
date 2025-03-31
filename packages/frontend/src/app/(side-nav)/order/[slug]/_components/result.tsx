'use client'
import type { Project } from '@l2beat/config'
import { useL2BeatzzaDialog } from '~/components/l2beatzza/l2beatzza-dialog'
import { Step5 } from '~/components/l2beatzza/step-4'
import { FullGreenPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-green-pizza'
import { FullRedPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-red-pizza'
import { FullYellowPizzaSymbol } from '~/components/rosette/pizza/real-elements/full-yellow-pizza'

export function L2BeatzzaResult({
  project,
}: { project: Project<'scalingRisks'> }) {
  const { setOpen } = useL2BeatzzaDialog()
  return (
    <>
      <div className="hidden">
        <FullRedPizzaSymbol />
        <FullYellowPizzaSymbol />
        <FullGreenPizzaSymbol />
      </div>
      <Step5 data={project} onPickDifferentClick={() => setOpen(true)} />
    </>
  )
}
