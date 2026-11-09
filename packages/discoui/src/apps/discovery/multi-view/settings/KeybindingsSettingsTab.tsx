import { type ReactNode, useEffect, useRef, useState } from 'react'
import { IconClose } from '../../../../icons/IconClose'
import { IconSearch } from '../../../../icons/IconSearch'
import { IconUndo } from '../../../../icons/IconUndo'
import { cn } from '../../../../utils/cn'
import { COMMANDS } from '../../keybindings/commands'
import { groupKeybindings } from '../../keybindings/groups'
import { findConflicts } from '../../keybindings/resolve'
import { SCOPE_LABELS } from '../../keybindings/scope'
import {
  PLATFORM,
  type Shortcut,
  shortcutLabels,
} from '../../keybindings/shortcut'
import {
  type Keybinding,
  selectKeybindings,
  useKeybindingsStore,
} from '../../keybindings/store'
import { AddKeybindingPopover } from './AddKeybindingPopover'
import { KeyChips } from './KeyChips'
import { SettingsSection } from './SettingRow'
import { ShortcutRecorder } from './ShortcutRecorder'

export function KeybindingsSettingsTab() {
  const keybindings = useKeybindingsStore(selectKeybindings)
  const [query, setQuery] = useState('')
  const [recordingId, setRecordingId] = useState<string | undefined>()
  const sections = groupKeybindings(keybindings, query, PLATFORM)

  return (
    <>
      <KeybindingsToolbar
        query={query}
        onQueryChange={setQuery}
        onAdded={(id) => {
          setQuery('')
          setRecordingId(id)
        }}
      />
      {sections.length === 0 && (
        <p className="px-1 text-coffee-300 text-xs">
          No keybindings match “{query}”.
        </p>
      )}
      {sections.map((section) => (
        <SettingsSection key={section.title} title={section.title}>
          {section.keybindings.map((keybinding) => (
            <KeybindingRow
              key={keybinding.id}
              keybinding={keybinding}
              conflicts={findConflicts(keybindings, keybinding, PLATFORM)}
              recording={recordingId === keybinding.id}
              onRecordStart={() => setRecordingId(keybinding.id)}
              onRecordEnd={() => setRecordingId(undefined)}
            />
          ))}
        </SettingsSection>
      ))}
    </>
  )
}

function KeybindingsToolbar(props: {
  query: string
  onQueryChange: (query: string) => void
  onAdded: (id: string) => void
}) {
  const isModified = useKeybindingsStore(
    (state) =>
      Object.keys(state.overrides).length > 0 ||
      state.userKeybindings.length > 0,
  )
  const resetAllKeybindings = useKeybindingsStore((s) => s.resetAllKeybindings)

  return (
    <div className="flex items-center gap-2 rounded-md border border-coffee-700 bg-coffee-800/50 p-2">
      <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-sm border border-coffee-600 bg-coffee-800 px-2 focus-within:border-autumn-300">
        <IconSearch className="size-3.5 shrink-0 text-coffee-400" />
        <input
          type="search"
          value={props.query}
          placeholder="Search keybindings"
          aria-label="Search keybindings"
          className="h-full min-w-0 flex-1 bg-transparent text-coffee-100 text-sm placeholder:text-coffee-400 focus:outline-hidden"
          onChange={(event) => props.onQueryChange(event.target.value)}
        />
      </label>
      <AddKeybindingPopover onAdded={props.onAdded} />
      <button
        type="button"
        className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-coffee-600 text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Reset all keybindings to defaults"
        title="Reset all keybindings to defaults"
        disabled={!isModified}
        onClick={() => {
          // It also deletes added keybindings, which no reset brings back.
          if (window.confirm('Reset all keybindings to their defaults?')) {
            resetAllKeybindings()
          }
        }}
      >
        <IconUndo className="size-3.5" />
      </button>
    </div>
  )
}

function KeybindingRow(props: {
  keybinding: Keybinding
  conflicts: readonly Keybinding[]
  recording: boolean
  onRecordStart: () => void
  onRecordEnd: () => void
}) {
  const { keybinding } = props
  const title = COMMANDS[keybinding.command].title
  const setShortcut = useKeybindingsStore((s) => s.setShortcut)
  const removeKeybinding = useKeybindingsStore((s) => s.removeKeybinding)
  const rowRef = useRef<HTMLDivElement>(null)

  // A keybinding just added starts recording, maybe far down the list.
  useEffect(() => {
    if (props.recording) {
      rowRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [props.recording])

  function record(shortcut: Shortcut) {
    setShortcut(keybinding.id, shortcut)
    props.onRecordEnd()
  }

  // Cancelling a keybinding that was added and never got a shortcut leaves
  // nothing worth keeping.
  function cancel() {
    if (keybinding.origin === 'user' && keybinding.shortcut === null) {
      removeKeybinding(keybinding.id)
    }
    props.onRecordEnd()
  }

  return (
    <div
      ref={rowRef}
      className="group flex items-center justify-between gap-6 px-4 py-3 max-sm:gap-3 max-sm:px-3"
    >
      <div className="min-w-0">
        <div className="flex min-h-5 items-center gap-1">
          <span className="font-medium text-coffee-100 text-sm">{title}</span>
          <KeybindingActions keybinding={keybinding} title={title} />
        </div>
        <div className="mt-1 text-coffee-400 text-xs leading-4">
          {SCOPE_LABELS[COMMANDS[keybinding.command].scope]}
        </div>
        {props.conflicts.length > 0 && (
          <div className="mt-1 text-aux-yellow text-xs leading-4">
            Also bound to{' '}
            {props.conflicts.map((c) => COMMANDS[c.command].title).join(', ')}
          </div>
        )}
      </div>
      <div className="shrink-0">
        {props.recording ? (
          <ShortcutRecorder onRecord={record} onCancel={cancel} />
        ) : (
          <ShortcutButton
            shortcut={keybinding.shortcut}
            title={title}
            onClick={props.onRecordStart}
          />
        )}
      </div>
    </div>
  )
}

function KeybindingActions(props: { keybinding: Keybinding; title: string }) {
  const { keybinding } = props
  const setShortcut = useKeybindingsStore((s) => s.setShortcut)
  const resetKeybinding = useKeybindingsStore((s) => s.resetKeybinding)
  const removeKeybinding = useKeybindingsStore((s) => s.removeKeybinding)

  return (
    <>
      {keybinding.origin === 'default' && keybinding.isModified && (
        <RowAction
          label={`Reset ${props.title} to default`}
          tooltip="Reset to default"
          onClick={() => resetKeybinding(keybinding.id)}
        >
          <IconUndo className="size-3.5" />
        </RowAction>
      )}
      {keybinding.origin === 'user' ? (
        <RowAction
          label={`Remove keybinding for ${props.title}`}
          tooltip="Remove keybinding"
          revealOnHover
          onClick={() => removeKeybinding(keybinding.id)}
        >
          <IconClose className="size-3.5" />
        </RowAction>
      ) : (
        keybinding.shortcut !== null && (
          <RowAction
            label={`Remove shortcut for ${props.title}`}
            tooltip="Remove shortcut"
            revealOnHover
            onClick={() => setShortcut(keybinding.id, null)}
          >
            <IconClose className="size-3.5" />
          </RowAction>
        )
      )}
    </>
  )
}

function RowAction(props: {
  label: string
  tooltip: string
  revealOnHover?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-5 cursor-pointer items-center justify-center rounded-xs text-coffee-400 hover:bg-coffee-700 hover:text-coffee-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300',
        props.revealOnHover &&
          'opacity-0 focus-visible:opacity-100 group-hover:opacity-100',
      )}
      aria-label={props.label}
      title={props.tooltip}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

function ShortcutButton(props: {
  shortcut: Shortcut | null
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="flex min-h-7 cursor-pointer items-center gap-1 rounded-sm p-0.5 hover:bg-coffee-700/60 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300"
      aria-label={`Change shortcut for ${props.title}`}
      title="Click, then press the new shortcut"
      onClick={props.onClick}
    >
      {props.shortcut === null ? (
        <span className="px-1.5 text-coffee-400 text-xs">Unbound</span>
      ) : (
        <KeyChips labels={shortcutLabels(props.shortcut, PLATFORM)} />
      )}
    </button>
  )
}
