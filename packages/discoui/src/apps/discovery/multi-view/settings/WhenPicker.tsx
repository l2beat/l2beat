import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { IconChevronDown } from '../../../../icons/IconChevronDown'
import { cn } from '../../../../utils/cn'
import { NOT_TYPING, ON_CANVAS } from '../../keybindings/commands'
import { type Keybinding, useKeybindingsStore } from '../../keybindings/store'
import {
  parseWhen,
  WHEN_CONTEXT_DESCRIPTIONS,
  WHEN_CONTEXT_KEYS,
  type WhenClause,
} from '../../keybindings/when'

const PRESETS: readonly (string | null)[] = [
  null,
  NOT_TYPING,
  ON_CANVAS,
  'editorFocus && !inputFocus',
  '!editorFocus && !inputFocus',
]

export function WhenPicker(props: { keybinding: Keybinding; title: string }) {
  const [open, setOpen] = useState(false)
  const setWhen = useKeybindingsStore((s) => s.setWhen)
  const source = props.keybinding.when?.source

  function apply(when: WhenClause | null) {
    setWhen(props.keybinding.id, when)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="inline-flex min-w-0 cursor-pointer items-center gap-1 rounded-xs font-mono hover:text-autumn-300 focus:ring-1"
        aria-label={`Change when ${props.title} applies`}
      >
        <span
          className={cn(
            'truncate',
            source === undefined ? 'text-coffee-400' : 'text-coffee-100',
          )}
        >
          {source ?? 'Always'}
        </span>
        <IconChevronDown className="size-3 shrink-0 text-coffee-400" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(360px,90vw)] p-3">
        <WhenEditor initialSource={source ?? ''} onApply={apply} />
        <PresetList current={source ?? null} onApply={apply} />
        <ContextReference />
      </PopoverContent>
    </Popover>
  )
}

// Empty applies "Always". Anything else must parse before it applies.
function WhenEditor(props: {
  initialSource: string
  onApply: (when: WhenClause | null) => void
}) {
  const [draft, setDraft] = useState(props.initialSource)
  const parsed = draft.trim() === '' ? null : parseWhen(draft)
  const error = parsed !== null && !parsed.success ? parsed.message : undefined

  function submit() {
    if (parsed === null) {
      props.onApply(null)
    } else if (parsed.success) {
      props.onApply(parsed.value)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="flex gap-2">
        <input
          autoFocus
          value={draft}
          placeholder="Always"
          aria-label="When expression"
          aria-invalid={error !== undefined}
          spellCheck={false}
          className={cn(
            'h-7 min-w-0 flex-1 rounded-sm border border-coffee-600 bg-coffee-800 px-2 font-mono text-coffee-100 text-xs placeholder:text-coffee-400 focus:border-autumn-300 focus:outline-hidden',
            error !== undefined && 'border-aux-red',
          )}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          disabled={error !== undefined}
          className="h-7 rounded-sm bg-autumn-300 px-2 font-medium text-black text-xs hover:bg-autumn-300/90 disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      <div className="mt-1 min-h-4 text-xs leading-4">
        {error !== undefined ? (
          <span className="text-aux-red">{error}</span>
        ) : (
          <span className="text-coffee-400">
            Combine contexts with !, &&, || and parentheses.
          </span>
        )}
      </div>
    </form>
  )
}

function PresetList(props: {
  current: string | null
  onApply: (when: WhenClause | null) => void
}) {
  function applyPreset(preset: string | null) {
    if (preset === null) {
      props.onApply(null)
      return
    }
    const parsed = parseWhen(preset)
    if (!parsed.success) {
      throw new Error('When preset does not parse', { cause: { preset } })
    }
    props.onApply(parsed.value)
  }

  return (
    <div className="mt-2 border-coffee-700 border-t pt-2">
      <div className="mb-1 px-1 text-coffee-400 text-xs">Presets</div>
      {PRESETS.map((preset) => (
        <button
          key={preset ?? 'always'}
          type="button"
          className={cn(
            'flex w-full cursor-pointer items-center rounded-xs px-1 py-1 text-left font-mono text-xs hover:bg-coffee-700 focus:bg-coffee-700 focus:outline-hidden',
            preset === props.current ? 'text-autumn-300' : 'text-coffee-200',
          )}
          onClick={() => applyPreset(preset)}
        >
          {preset ?? 'Always'}
        </button>
      ))}
    </div>
  )
}

function ContextReference() {
  return (
    <div className="mt-2 border-coffee-700 border-t pt-2">
      <div className="mb-1 px-1 text-coffee-400 text-xs">Contexts</div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-1 text-xs">
        {WHEN_CONTEXT_KEYS.map((key) => (
          <div key={key} className="contents">
            <dt className="font-mono text-coffee-100">{key}</dt>
            <dd className="text-coffee-300">
              {WHEN_CONTEXT_DESCRIPTIONS[key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
