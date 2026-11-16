import { useEffect, useId, useState } from 'react'
import { Switch } from '../../../../components/Switch'
import { cn } from '../../../../utils/cn'
import {
  DEFAULT_GLOBAL_SETTINGS,
  type ThemeSetting,
  useGlobalSettingsStore,
} from '../../store/global-settings-store'
import { SettingRow, SettingsSection } from './SettingRow'

const MAX_DEPTH_LIMIT = 100

export function GlobalSettingsTab() {
  return (
    <>
      <VisualsSection />
      <CodeSection />
      <ReachabilitySection />
    </>
  )
}

function VisualsSection() {
  const theme = useGlobalSettingsStore((s) => s.theme)
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const setUserSettings = useGlobalSettingsStore((s) => s.setUserSettings)
  const markUnreachableId = useId()

  return (
    <SettingsSection title="Visuals">
      <SettingRow
        title="Theme"
        description="Follow the system appearance, or pick one."
        isDefault={theme === DEFAULT_GLOBAL_SETTINGS.theme}
        onReset={() =>
          setUserSettings({ theme: DEFAULT_GLOBAL_SETTINGS.theme })
        }
      >
        <ThemePicker
          value={theme}
          onChange={(theme) => setUserSettings({ theme })}
        />
      </SettingRow>
      <SettingRow
        title="Make unreachable entries distinctive"
        description="Entries unreachable from the root discovery appear grayed out. Off, every entry looks reachable."
        controlId={markUnreachableId}
        isDefault={
          markUnreachableEntries ===
          DEFAULT_GLOBAL_SETTINGS.markUnreachableEntries
        }
        onReset={() =>
          setUserSettings({
            markUnreachableEntries:
              DEFAULT_GLOBAL_SETTINGS.markUnreachableEntries,
          })
        }
      >
        <Switch
          id={markUnreachableId}
          checked={markUnreachableEntries}
          onCheckedChange={(markUnreachableEntries) =>
            setUserSettings({ markUnreachableEntries })
          }
        />
      </SettingRow>
    </SettingsSection>
  )
}

function CodeSection() {
  const peekDefinitions = useGlobalSettingsStore((s) => s.peekDefinitions)
  const setUserSettings = useGlobalSettingsStore((s) => s.setUserSettings)
  const peekDefinitionsId = useId()

  return (
    <SettingsSection title="Code">
      <SettingRow
        title="Peek definitions inline"
        description="Go to definition (F12, Ctrl/Cmd+click) opens the definition under the line instead of jumping to it. Peeks nest, Escape closes the last one."
        controlId={peekDefinitionsId}
        isDefault={peekDefinitions === DEFAULT_GLOBAL_SETTINGS.peekDefinitions}
        onReset={() =>
          setUserSettings({
            peekDefinitions: DEFAULT_GLOBAL_SETTINGS.peekDefinitions,
          })
        }
      >
        <Switch
          id={peekDefinitionsId}
          checked={peekDefinitions}
          onCheckedChange={(peekDefinitions) =>
            setUserSettings({ peekDefinitions })
          }
        />
      </SettingRow>
    </SettingsSection>
  )
}

function ReachabilitySection() {
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  const setUserSettings = useGlobalSettingsStore((s) => s.setUserSettings)
  const maxReachableDepthId = useId()

  return (
    <SettingsSection title="Reachability">
      <SettingRow
        title="Max reachable depth"
        description="BFS depth from initial addresses used to mark entries reachable. 0 = only entrypoints (useful to surface bridge entries between discoveries). Empty = unlimited."
        controlId={maxReachableDepthId}
        isDefault={
          maxReachableDepth === DEFAULT_GLOBAL_SETTINGS.maxReachableDepth
        }
        onReset={() =>
          setUserSettings({
            maxReachableDepth: DEFAULT_GLOBAL_SETTINGS.maxReachableDepth,
          })
        }
      >
        <DepthInput
          id={maxReachableDepthId}
          value={maxReachableDepth}
          onChange={(maxReachableDepth) =>
            setUserSettings({ maxReachableDepth })
          }
        />
      </SettingRow>
    </SettingsSection>
  )
}

const THEME_OPTIONS: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

function ThemePicker(props: {
  value: ThemeSetting
  onChange: (value: ThemeSetting) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex h-7 items-center gap-0.5 rounded-sm border border-coffee-700 bg-coffee-900 p-0.5"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={props.value === option.value}
          className={cn(
            'flex h-full items-center rounded-xs px-2 text-xs transition-colors duration-100',
            props.value === option.value
              ? 'bg-autumn-300 text-black'
              : 'text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100',
          )}
          onClick={() => props.onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function DepthInput(props: {
  id: string
  value: number | null
  onChange: (value: number | null) => void
}) {
  const [text, setText] = useState(formatDepth(props.value))
  const [error, setError] = useState<string | undefined>()

  // A reset to default changes the value from outside the input.
  useEffect(() => {
    setText(formatDepth(props.value))
    setError(undefined)
  }, [props.value])

  function commit(raw: string) {
    const trimmed = raw.trim()
    if (trimmed === '') {
      setError(undefined)
      props.onChange(null)
      return
    }
    if (!/^\d+$/.test(trimmed)) {
      setError('Must be a non-negative integer')
      return
    }
    const parsed = Number(trimmed)
    if (parsed > MAX_DEPTH_LIMIT) {
      setError(`Must be at most ${MAX_DEPTH_LIMIT}`)
      return
    }
    setError(undefined)
    props.onChange(parsed)
  }

  return (
    <div className="flex flex-col items-end">
      <input
        id={props.id}
        type="number"
        min={0}
        max={MAX_DEPTH_LIMIT}
        step={1}
        value={text}
        placeholder="∞"
        aria-invalid={error !== undefined}
        onChange={(e) => {
          setText(e.target.value)
          commit(e.target.value)
        }}
        onBlur={(e) => commit(e.target.value)}
        className={cn(
          'h-7 w-20 rounded-sm border border-coffee-600 bg-coffee-800 px-2 font-mono text-coffee-100 text-xs tabular-nums [appearance:textfield] placeholder:text-coffee-400 focus:border-autumn-300 focus:outline-hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          error !== undefined && 'border-aux-red',
        )}
      />
      {error !== undefined && (
        <div className="pt-1 text-aux-red text-xs">{error}</div>
      )}
    </div>
  )
}

function formatDepth(value: number | null): string {
  return value === null ? '' : String(value)
}
