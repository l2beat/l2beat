import { type RefObject, useEffect, useRef, useState } from 'react'
import {
  type KeyEventLike,
  PLATFORM,
  type Platform,
  type Shortcut,
  shortcutFromEvent,
} from '../../keybindings/shortcut'
import { KeyChips } from './KeyChips'

type Outcome = { shortcut: Shortcut } | 'cancel'

interface RecorderProps {
  onRecord: (shortcut: Shortcut) => void
  onCancel: () => void
}

export function ShortcutRecorder(props: RecorderProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const settle = useSettleOnce(props)
  const heldModifiers = useRecordedKeys(boxRef, settle)

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      aria-label="Press the new shortcut, Escape cancels"
      aria-live="polite"
      className="flex h-8 w-48 items-center gap-1 rounded-sm border border-autumn-300 bg-coffee-900 px-2 font-mono text-coffee-300 text-sm outline-hidden ring-2 ring-autumn-300/25 max-sm:w-36"
      onBlur={() => settle.current('cancel')}
    >
      {heldModifiers.length === 0 ? (
        'Press shortcut'
      ) : (
        <KeyChips labels={heldModifiers} />
      )}
    </div>
  )
}

// Recording ends once: the box loses focus as it unmounts after a record,
// and that blur must not also cancel.
function useSettleOnce(props: RecorderProps): RefObject<(o: Outcome) => void> {
  const propsRef = useRef(props)
  propsRef.current = props
  const settledRef = useRef(false)
  return useRef((outcome: Outcome) => {
    if (settledRef.current) {
      return
    }
    settledRef.current = true
    if (outcome === 'cancel') {
      propsRef.current.onCancel()
    } else {
      propsRef.current.onRecord(outcome.shortcut)
    }
  })
}

// Listens on the window in the capture phase, ahead of the page's handlers,
// so the keys pressed only record: no keybinding runs and Escape does not
// close the dialog. Returns the modifiers held so far.
function useRecordedKeys(
  boxRef: RefObject<HTMLDivElement | null>,
  settle: RefObject<(outcome: Outcome) => void>,
): string[] {
  const [heldModifiers, setHeldModifiers] = useState<string[]>([])

  useEffect(() => {
    boxRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.key === 'Escape' && !hasModifier(event)) {
        settle.current('cancel')
        return
      }
      const shortcut = shortcutFromEvent(event, PLATFORM)
      if (shortcut === null) {
        setHeldModifiers(modifierLabels(event, PLATFORM))
        return
      }
      settle.current({ shortcut })
    }

    function onKeyUp(event: KeyboardEvent) {
      event.preventDefault()
      event.stopImmediatePropagation()
      setHeldModifiers(modifierLabels(event, PLATFORM))
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    window.addEventListener('keyup', onKeyUp, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      window.removeEventListener('keyup', onKeyUp, { capture: true })
    }
  }, [boxRef, settle])

  return heldModifiers
}

function hasModifier(event: KeyEventLike): boolean {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
}

function modifierLabels(event: KeyEventLike, platform: Platform): string[] {
  const labels: string[] = []
  if (platform === 'mac') {
    if (event.metaKey) labels.push('⌘')
    if (event.ctrlKey) labels.push('⌃')
    if (event.altKey) labels.push('⌥')
    if (event.shiftKey) labels.push('⇧')
  } else {
    if (event.ctrlKey) labels.push('Ctrl')
    if (event.altKey) labels.push('Alt')
    if (event.shiftKey) labels.push('Shift')
  }
  return labels
}
