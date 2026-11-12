import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyNeed,
} from '@l2beat/config'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import {
  ADVICE_EFFORT_IDS,
  ADVICE_EFFORTS,
  type AdviceEffortId,
} from '../advicePaths'
import { getHoldingOptions, type MatchChoices } from '../matchProtocols'
import { STAY_PRIVATE } from '../stayPrivateCopy'
import { PickerOption, PickerQuestion } from './Picker'

/**
 * The three questions: what the user wants to do, who should not find out and
 * which efforts they accept. Efforts and filters are offered only where a
 * protocol of the need has a step or a tracked asset they apply to.
 */
export function ChoicesPicker({
  choices,
  needs,
  adversaries,
  protocols,
  waitWindowDays,
  onChange,
}: {
  choices: MatchChoices
  needs: PrivacyNeed[]
  adversaries: PrivacyAdversary[]
  protocols: PrivacyAdviceProtocol[]
  waitWindowDays: number
  onChange: (choices: MatchChoices) => void
}) {
  const ofNeed = protocols.filter((p) => p.needId === choices.need)
  const efforts = ADVICE_EFFORT_IDS.filter((id) =>
    ofNeed.some((p) => p.steps.some(ADVICE_EFFORTS[id].skips)),
  )
  const options = getHoldingOptions(protocols, choices.need)

  const setNeed = (need: string) => {
    const next = getHoldingOptions(protocols, need)
    onChange({
      ...choices,
      need,
      asset: keep(choices.asset, next.assets),
      chain: keep(choices.chain, next.chains),
    })
  }
  const setFrom = (id: PrivacyAdversaryId, checked: boolean) =>
    onChange({
      ...choices,
      // Rosette order, whatever order they were ticked in.
      from: adversaries
        .map((a) => a.id)
        .filter((a) => (a === id ? checked : choices.from.includes(a))),
    })
  const setAccepts = (id: AdviceEffortId, checked: boolean) =>
    onChange({ ...choices, accepts: { ...choices.accepts, [id]: checked } })

  return (
    <div className="flex flex-col gap-6">
      <PickerQuestion
        number={1}
        question={STAY_PRIVATE.needQuestion}
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        {needs.map((need) => (
          <PickerOption
            key={need.id}
            name="need"
            value={need.id}
            checked={need.id === choices.need}
            onChange={() => setNeed(need.id)}
            className="flex flex-col gap-1"
          >
            <OptionText label={need.label} description={need.description} />
          </PickerOption>
        ))}
      </PickerQuestion>

      <PickerQuestion
        number={2}
        question={STAY_PRIVATE.fromQuestion}
        note={STAY_PRIVATE.fromNote}
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        {adversaries.map((adversary) => (
          <PickerOption
            key={adversary.id}
            type="checkbox"
            name="from"
            value={adversary.id}
            checked={choices.from.includes(adversary.id)}
            onChange={(checked) => setFrom(adversary.id, checked)}
            className="flex flex-col gap-1"
          >
            <OptionText
              label={adversary.label}
              description={adversary.examples}
            />
          </PickerOption>
        ))}
      </PickerQuestion>

      {efforts.length > 0 && (
        <PickerQuestion
          number={3}
          question={STAY_PRIVATE.effortQuestion}
          note={STAY_PRIVATE.effortNote}
          className="grid-cols-1 sm:grid-cols-2"
        >
          {efforts.map((id) => (
            <PickerOption
              key={id}
              type="checkbox"
              name="effort"
              value={id}
              checked={choices.accepts[id]}
              onChange={(checked) => setAccepts(id, checked)}
              className="flex flex-col gap-1"
            >
              <OptionText
                label={ADVICE_EFFORTS[id].label(waitWindowDays)}
                description={ADVICE_EFFORTS[id].description}
              />
            </PickerOption>
          ))}
        </PickerQuestion>
      )}

      {(options.assets.length > 0 || options.chains.length > 0) && (
        <fieldset>
          <legend className="font-bold text-label-value-15">
            {STAY_PRIVATE.filtersLabel}
          </legend>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FilterSelect
              label={STAY_PRIVATE.assetLabel}
              value={choices.asset}
              options={options.assets.map((a) => ({ value: a, label: a }))}
              onChange={(asset) => onChange({ ...choices, asset })}
            />
            <FilterSelect
              label={STAY_PRIVATE.chainLabel}
              value={choices.chain}
              options={options.chains.map((c) => ({
                value: c,
                label: capitalize(c),
              }))}
              onChange={(chain) => onChange({ ...choices, chain })}
            />
          </div>
          <p className="mt-2 text-paragraph-13 text-secondary">
            {STAY_PRIVATE.filtersNote}
          </p>
        </fieldset>
      )}
    </div>
  )
}

function OptionText({
  label,
  description,
}: {
  label: string
  description: string
}) {
  return (
    <>
      <span className="font-bold text-label-value-15">{label}</span>
      <span className="text-paragraph-13 text-secondary">{description}</span>
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

function keep(value: string | undefined, allowed: string[]) {
  return value !== undefined && allowed.includes(value) ? value : undefined
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
