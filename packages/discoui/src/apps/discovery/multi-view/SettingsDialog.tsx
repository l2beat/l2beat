import { useEffect, useState } from 'react'
import { Checkbox } from '../../../components/Checkbox'
import { Dialog } from '../../../components/Dialog'
import { IconGear } from '../../../icons/IconGear'
import { cn } from '../../../utils/cn'
import { useGlobalSettingsStore } from '../store/global-settings-store'

const MAX_DEPTH_LIMIT = 100

export function SettingsDialog() {
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  const peekDefinitions = useGlobalSettingsStore((s) => s.peekDefinitions)
  const setUserSettings = useGlobalSettingsStore((s) => s.setUserSettings)

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="flex size-7 items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100"
        aria-label="Settings"
      >
        <IconGear />
      </Dialog.Trigger>
      <Dialog.Body>
        <Dialog.Title>Global app settings</Dialog.Title>
        <Dialog.Description>Change the way the app behaves.</Dialog.Description>

        <div className="flex flex-col">
          <SectionHeading first>Visuals</SectionHeading>
          <div>
            <div
              className={OPTION_CLASS}
              onClick={() =>
                setUserSettings({
                  markUnreachableEntries: !markUnreachableEntries,
                })
              }
            >
              <Checkbox checked={markUnreachableEntries} />
              Make unreachable entries distinctive
            </div>
            <div className={HINT_CLASS}>
              Entries unreachable from the root discovery will appear grayed
              out. <br />
              By default, all entries are displayed as if they were reachable.
            </div>
          </div>

          <SectionHeading>Code</SectionHeading>
          <div>
            <div
              className={OPTION_CLASS}
              onClick={() =>
                setUserSettings({ peekDefinitions: !peekDefinitions })
              }
            >
              <Checkbox checked={peekDefinitions} />
              Peek definitions inline
            </div>
            <div className={HINT_CLASS}>
              Go to definition (F12, Ctrl/Cmd+click) opens the definition under
              the line instead of jumping to it. Peeks nest, Escape closes the
              last one.
            </div>
          </div>

          <SectionHeading>Reachability</SectionHeading>
          <DepthSelector
            value={maxReachableDepth}
            onChange={(v) => setUserSettings({ maxReachableDepth: v })}
          />
        </div>
      </Dialog.Body>
    </Dialog.Root>
  )
}

const OPTION_CLASS =
  'flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm hover:text-white'
const HINT_CLASS = 'mt-1 pl-6 text-coffee-300 text-xs leading-4'

function SectionHeading(props: { children: string; first?: boolean }) {
  return (
    <h2
      className={cn(
        'mb-2 border-coffee-700 border-b pb-1 font-semibold text-coffee-300 text-xs',
        !props.first && 'mt-4',
      )}
    >
      {props.children}
    </h2>
  )
}

function DepthSelector(props: {
  value: number | null
  onChange: (value: number | null) => void
}) {
  const [text, setText] = useState(
    props.value === null ? '' : String(props.value),
  )
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    setText(props.value === null ? '' : String(props.value))
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
    <div>
      <label className="flex items-center gap-2 font-medium text-coffee-100 text-sm">
        <span>Max reachable depth</span>
        <input
          type="number"
          min={0}
          max={MAX_DEPTH_LIMIT}
          step={1}
          value={text}
          placeholder="∞"
          onChange={(e) => {
            setText(e.target.value)
            commit(e.target.value)
          }}
          onBlur={(e) => commit(e.target.value)}
          className="h-7 w-20 rounded-sm border border-coffee-600 bg-coffee-800 px-2 font-mono text-coffee-100 text-xs tabular-nums [appearance:textfield] placeholder:text-coffee-400 focus:border-autumn-300 focus:outline-hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </label>
      <div className="mt-1 text-coffee-300 text-xs leading-4">
        BFS depth from initial addresses used to mark entries reachable.
        <br />0 = only entrypoints (useful to surface bridge entries between
        discoveries). Empty = unlimited.
      </div>
      {error !== undefined && (
        <div className="pt-1 text-aux-red text-xs">{error}</div>
      )}
    </div>
  )
}
