import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { PizzaRosetteLabels } from '~/components/rosette/pizza/PizzaRosetteLabels'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { getPrivacyAdversaryRosetteValues } from '../adversaries/privacyAdversaryUi'

/**
 * The rosette with the adversary names around it, sized like the L2 "Risk
 * analysis" card. Shared by the desktop tooltip and the mobile drawer.
 */
export function PrivacyRosetteFigure({
  adversaries,
}: {
  adversaries: PrivacyAdversariesSummary
}) {
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  return (
    <div className="relative flex size-[200px] shrink-0 items-center justify-center">
      <PizzaRosetteIcon
        values={values}
        className="scale-75"
        background="surface"
        disableSectionLinking
      />
      <PizzaRosetteLabels
        values={values}
        containerSize={200}
        textRadius={76}
        size="small"
      />
    </div>
  )
}
