import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteLabels } from './PizzaRosetteLabels'

export function PizzaRosetteWithLabels({ values }: { values: RosetteValue[] }) {
  return (
    <div className="relative flex size-[184px] shrink-0 items-center justify-center">
      <PizzaRosetteIcon
        values={values}
        className="scale-[0.6667]"
        background="surface"
        disableSectionLinking
      />
      <PizzaRosetteLabels
        values={values}
        containerSize={184}
        textRadius={66}
        size="small"
        textClassName="text-subtitle-11"
      />
    </div>
  )
}
