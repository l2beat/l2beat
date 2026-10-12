import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteLabels } from './PizzaRosetteLabels'

export function PizzaRosetteWithLabels({ values }: { values: RosetteValue[] }) {
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
