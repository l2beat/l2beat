import type { PrivacyAdviceData } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { ADVICE_GOAL_IDS, ADVICE_GOALS } from '../advicePaths'
import type { RankingCriteria } from '../rankProtocols'
import { STAY_PRIVATE } from '../stayPrivateCopy'
import { PickerOption, PickerQuestion } from './Picker'

export function AdviceCriteriaPicker({
  criteria,
  options,
  onChange,
}: {
  criteria: RankingCriteria
  options: PrivacyAdviceData['options']
  onChange: (criteria: RankingCriteria) => void
}) {
  return (
    <>
      <PickerQuestion
        number={1}
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
              checked={id === criteria.goal}
              onChange={() => onChange({ ...criteria, goal: id })}
              className="flex flex-col gap-1"
            >
              <span className="font-bold text-label-value-15">
                {goal.label}
              </span>
              <span className="text-paragraph-13 text-secondary">
                {goal.description}
              </span>
            </PickerOption>
          )
        })}
      </PickerQuestion>
      <fieldset className="mt-5">
        <legend className="font-bold text-label-value-15">
          {STAY_PRIVATE.filtersLabel}
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterSelect
            label={STAY_PRIVATE.kindLabel}
            value={criteria.kind}
            options={options.kinds.map((k) => ({
              value: k.id,
              label: k.label,
            }))}
            onChange={(kind) => onChange({ ...criteria, kind })}
          />
          <FilterSelect
            label={STAY_PRIVATE.assetLabel}
            value={criteria.asset}
            options={options.assets.map((a) => ({ value: a, label: a }))}
            onChange={(asset) => onChange({ ...criteria, asset })}
          />
          <FilterSelect
            label={STAY_PRIVATE.chainLabel}
            value={criteria.chain}
            options={options.chains.map((c) => ({
              value: c,
              label: capitalize(c),
            }))}
            onChange={(chain) => onChange({ ...criteria, chain })}
          />
        </div>
        <p className="mt-2 text-paragraph-13 text-secondary">
          {STAY_PRIVATE.filtersNote}
        </p>
      </fieldset>
    </>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | undefined
  options: { value: string; label: string }[]
  onChange: (value: string | undefined) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-paragraph-13 text-secondary">
      {label}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-9 rounded-lg border border-divider bg-surface-primary px-2 text-paragraph-15 text-primary"
      >
        <option value="">{STAY_PRIVATE.anyOption}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
