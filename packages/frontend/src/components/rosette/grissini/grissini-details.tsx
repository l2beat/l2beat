import { type RosetteValue } from '../types'
import { SingleGrissiniDetails } from './single-grissini-details'

export function GrissiniDetails({ values }: { values: RosetteValue[] }) {
  return (
    <div className="flex w-[264px] flex-col gap-4">
      {values.map((value) => (
        <SingleGrissiniDetails key={value.name} {...value} />
      ))}
    </div>
  )
}
