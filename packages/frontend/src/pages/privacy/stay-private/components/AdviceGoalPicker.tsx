import {
  ADVICE_GOAL_IDS,
  ADVICE_GOALS,
  type AdviceGoalId,
} from '../advicePaths'
import { STAY_PRIVATE } from '../stayPrivateCopy'
import { PickerOption, PickerQuestion } from './Picker'

export function AdviceGoalPicker({
  selected,
  onSelect,
}: {
  selected: AdviceGoalId
  onSelect: (goal: AdviceGoalId) => void
}) {
  return (
    <PickerQuestion
      number={2}
      question={STAY_PRIVATE.goalQuestion}
      className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
    >
      {ADVICE_GOAL_IDS.map((id) => {
        const goal = ADVICE_GOALS[id]
        return (
          <PickerOption
            key={id}
            name="goal"
            value={id}
            checked={id === selected}
            onChange={() => onSelect(id)}
            className="flex flex-col gap-1"
          >
            <span className="font-bold text-label-value-15">{goal.label}</span>
            <span className="text-paragraph-13 text-secondary">
              {goal.description}
            </span>
          </PickerOption>
        )
      })}
    </PickerQuestion>
  )
}
