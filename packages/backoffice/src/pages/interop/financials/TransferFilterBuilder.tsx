import { PlusIcon, SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/core/Button'
import { Input } from '~/components/core/Input'
import { Label } from '~/components/core/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import type { FinancialTransfersFilterInput } from './types'
import { dateTimeInputToTimestamp } from './utils'

const FILTER_FIELDS = [
  { key: 'transferId', label: 'Transfer ID' },
  { key: 'srcChain', label: 'Src chain' },
  { key: 'srcTokenAddress', label: 'Src token address' },
  { key: 'srcAbstractTokenId', label: 'Src abstract token ID' },
  { key: 'srcSymbol', label: 'Src symbol' },
  { key: 'dstChain', label: 'Dst chain' },
  { key: 'dstTokenAddress', label: 'Dst token address' },
  { key: 'dstAbstractTokenId', label: 'Dst abstract token ID' },
  { key: 'dstSymbol', label: 'Dst symbol' },
] as const

type FilterFieldKey = (typeof FILTER_FIELDS)[number]['key']

interface FilterRule {
  id: number
  field: FilterFieldKey
  value: string
}

interface TransferFilterBuilderProps {
  isSearching: boolean
  onApply: (filter: FinancialTransfersFilterInput) => void
  onClear: () => void
}

export function TransferFilterBuilder({
  isSearching,
  onApply,
  onClear,
}: TransferFilterBuilderProps) {
  const [rules, setRules] = useState<FilterRule[]>([])
  const [nextRuleId, setNextRuleId] = useState(1)
  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')

  const usedFields = new Set(rules.map((rule) => rule.field))
  const unusedFields = FILTER_FIELDS.filter(
    (field) => !usedFields.has(field.key),
  )

  const from = fromInput ? dateTimeInputToTimestamp(fromInput) : undefined
  const to = toInput ? dateTimeInputToTimestamp(toInput) : undefined
  const isTimeRangeInvalid = from !== undefined && to !== undefined && from > to
  const hasAnyFilter =
    rules.some((rule) => rule.value.trim() !== '') ||
    from !== undefined ||
    to !== undefined

  function addRule() {
    const field = unusedFields[0]
    if (!field) return
    setRules([...rules, { id: nextRuleId, field: field.key, value: '' }])
    setNextRuleId(nextRuleId + 1)
  }

  function updateRule(id: number, update: Partial<Omit<FilterRule, 'id'>>) {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, ...update } : rule)),
    )
  }

  function removeRule(id: number) {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  function apply() {
    const filter: FinancialTransfersFilterInput = { from, to }
    for (const rule of rules) {
      const value = rule.value.trim()
      if (value) {
        filter[rule.field] = value
      }
    }
    onApply(filter)
  }

  function clear() {
    setRules([])
    setFromInput('')
    setToInput('')
    onClear()
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (hasAnyFilter && !isTimeRangeInvalid) apply()
      }}
    >
      <div className="flex flex-col gap-2">
        {rules.map((rule) => {
          const ownField = FILTER_FIELDS.find(
            (field) => field.key === rule.field,
          )
          const fieldOptions = ownField
            ? [ownField, ...unusedFields]
            : unusedFields

          return (
            <div key={rule.id} className="flex items-center gap-2">
              <Select
                value={rule.field}
                onValueChange={(field) =>
                  updateRule(rule.id, { field: field as FilterFieldKey })
                }
              >
                <SelectTrigger size="sm" className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map((field) => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="max-w-md"
                placeholder="Value"
                value={rule.value}
                onChange={(event) =>
                  updateRule(rule.id, { value: event.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove filter"
                onClick={() => removeRule(rule.id)}
              >
                <XIcon />
              </Button>
            </div>
          )
        })}

        <div className="flex flex-wrap items-end gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRule}
            disabled={unusedFields.length === 0}
          >
            <PlusIcon />
            Add filter
          </Button>
          <div className="space-y-1">
            <Label htmlFor="financials-from">From (UTC)</Label>
            <Input
              id="financials-from"
              type="datetime-local"
              value={fromInput}
              onChange={(event) => setFromInput(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="financials-to">To (UTC)</Label>
            <Input
              id="financials-to"
              type="datetime-local"
              value={toInput}
              onChange={(event) => setToInput(event.target.value)}
            />
          </div>
        </div>
      </div>

      {isTimeRangeInvalid ? (
        <p className="text-destructive text-sm">
          The from date must not be after the to date.
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!hasAnyFilter || isTimeRangeInvalid || isSearching}
        >
          <SearchIcon className={isSearching ? 'animate-pulse' : ''} />
          {isSearching ? 'Searching...' : 'Search transfers'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clear}>
          Clear
        </Button>
        <span className="text-muted-foreground text-sm">
          Add at least one filter or a time bound to search.
        </span>
      </div>
    </form>
  )
}
