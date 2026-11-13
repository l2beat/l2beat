import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyNeed,
} from '@l2beat/config'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { cn } from '~/utils/cn'
import {
  ADVICE_EFFORT_IDS,
  ADVICE_EFFORTS,
  type AdviceEffortId,
} from '../advicePaths'
import {
  getDefaultFrom,
  getHoldingOptions,
  type MatchChoices,
} from '../matchProtocols'
import { capitalize, STAY_PRIVATE } from '../stayPrivateCopy'
import { PickerOption, PickerQuestion } from './Picker'

/**
 * The three questions: what the user wants to do, who should not find out and
 * which efforts they accept. Efforts and filters are offered only where a
 * protocol of the need has a step or a tracked asset they apply to.
 *
 * Laid out as one column, so it fits the sidebar beside the results on wide
 * screens; on narrow ones the options of a question share a row.
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
  const defaultFrom = getDefaultFrom(adversaries)
  const isDefaultFrom = choices.from.join() === defaultFrom.join()

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

  let number = 0
  return (
    <div className="flex flex-col gap-5">
      <PickerQuestion
        number={++number}
        question={STAY_PRIVATE.needQuestion}
        className={WIDE_GRID}
      >
        {needs.map((need) => (
          <PickerOption
            key={need.id}
            name="need"
            value={need.id}
            checked={need.id === choices.need}
            onChange={() => setNeed(need.id)}
            label={need.label}
            description={need.description}
            trailing={
              <CountBadge
                count={protocols.filter((p) => p.needId === need.id).length}
              />
            }
          />
        ))}
      </PickerQuestion>

      <PickerQuestion
        number={++number}
        question={STAY_PRIVATE.fromQuestion}
        note={STAY_PRIVATE.fromNote}
        className={WIDE_GRID}
        action={
          !isDefaultFrom && (
            <button
              type="button"
              onClick={() => onChange({ ...choices, from: defaultFrom })}
              className="font-medium text-brand text-label-value-13 hover:underline"
            >
              {STAY_PRIVATE.resetChoices}
            </button>
          )
        }
      >
        {adversaries.map((adversary) => (
          <PickerOption
            key={adversary.id}
            type="checkbox"
            name="from"
            value={adversary.id}
            checked={choices.from.includes(adversary.id)}
            onChange={(checked) => setFrom(adversary.id, checked)}
            label={adversary.label}
            description={adversary.examples}
          />
        ))}
      </PickerQuestion>

      {efforts.length > 0 && (
        <PickerQuestion
          number={++number}
          question={STAY_PRIVATE.effortQuestion}
          note={STAY_PRIVATE.effortNote}
          className={NARROW_GRID}
        >
          {efforts.map((id) => (
            <PickerOption
              key={id}
              type="checkbox"
              name="effort"
              value={id}
              checked={choices.accepts[id]}
              onChange={(checked) => setAccepts(id, checked)}
              label={ADVICE_EFFORTS[id].label(waitWindowDays)}
              description={ADVICE_EFFORTS[id].description}
            />
          ))}
        </PickerQuestion>
      )}

      {(options.assets.length > 0 || options.chains.length > 0) && (
        <fieldset className="min-w-0">
          <legend className="font-bold text-heading-16">
            {STAY_PRIVATE.filtersLabel}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
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
          <p className="mt-1.5 text-paragraph-12 text-secondary">
            {STAY_PRIVATE.filtersNote}
          </p>
        </fieldset>
      )}
    </div>
  )
}

/** Options share a row below the sidebar breakpoint, and stack inside it. */
const WIDE_GRID = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-1'
const NARROW_GRID = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-1'

function CountBadge({ count }: { count: number }) {
  return (
    <span
      className={cn(
        'mt-px shrink-0 rounded-full bg-surface-secondary px-1.5 py-0.5 font-medium text-2xs text-secondary tabular-nums leading-none',
        count === 0 && 'opacity-60',
      )}
      title={`${count} ${count === 1 ? 'protocol' : 'protocols'} reviewed`}
    >
      {count}
    </span>
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
    <label className="flex min-w-0 flex-col gap-1 text-paragraph-12 text-secondary">
      {label}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={cn(
          'h-9 w-full min-w-0 rounded-lg border border-divider bg-surface-primary px-2 text-paragraph-14 text-primary',
          value !== undefined && 'border-brand',
        )}
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
