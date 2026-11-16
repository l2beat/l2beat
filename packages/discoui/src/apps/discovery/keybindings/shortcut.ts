export type Platform = 'mac' | 'other'

export const PLATFORM: Platform =
  typeof navigator !== 'undefined' && navigator.platform.includes('Mac')
    ? 'mac'
    : 'other'

// `mod` is Cmd on macOS and Ctrl elsewhere. `ctrl` is the Control key on
// macOS only; elsewhere it is the same key as `mod` and folds into it.
export interface Shortcut {
  readonly key: string
  readonly mod: boolean
  readonly ctrl: boolean
  readonly alt: boolean
  readonly shift: boolean
}

export type KeyEventLike = Pick<
  KeyboardEvent,
  'key' | 'code' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'
>

export type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; message: string }

const FUNCTION_KEYS = Array.from({ length: 24 }, (_, i) => `F${i + 1}`)

const NAMED_KEYS = new Set([
  'Enter',
  'Escape',
  'Tab',
  'Space',
  'Backspace',
  'Delete',
  'Insert',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  ...FUNCTION_KEYS,
])

// A punctuation character already says whether Shift was held ('/' or '?'),
// so shortcuts on these keys never carry Shift. '+' is spelled `Plus`, as '+'
// separates the parts of a shortcut string.
const PUNCTUATION_KEYS = new Set([
  ...'!"#$%&\'()*,-./:;<=>?@[\\]^_`{|}~',
  'Plus',
])

const MODIFIER_NAMES = ['Mod', 'Ctrl', 'Alt', 'Shift'] as const
type ModifierName = (typeof MODIFIER_NAMES)[number]

const SHORTCUT_SOURCE_LENGTH_MAX = 32

/** Returns null for keys that cannot end a shortcut, like a lone modifier. */
export function shortcutFromEvent(
  event: KeyEventLike,
  platform: Platform,
): Shortcut | null {
  const key = keyFromEvent(event)
  if (key === null) {
    return null
  }
  // The Windows key has no place in DiscoUI's shortcuts.
  if (platform === 'other' && event.metaKey) {
    return null
  }
  const mod = platform === 'mac' ? event.metaKey : event.ctrlKey
  const ctrl = platform === 'mac' ? event.ctrlKey : false
  const shift = PUNCTUATION_KEYS.has(key) ? false : event.shiftKey
  return { key, mod, ctrl, alt: event.altKey, shift }
}

// Letters come from the character typed, so Z is undo on AZERTY and Dvorak
// too. The physical key is the fallback when the character is no Latin letter:
// Option on macOS turns G into ©, and Cyrillic layouts type other letters.
// The digit row goes by position unless Shift is down, so Alt+1 works on
// AZERTY, whose digits need Shift, and Shift+7 still types '/' in German.
function keyFromEvent(
  event: Pick<KeyEventLike, 'key' | 'code' | 'shiftKey'>,
): string | null {
  if (event.key === ' ') {
    return 'Space'
  }
  if (/^[a-zA-Z]$/.test(event.key)) {
    return event.key.toUpperCase()
  }
  const digitCode = /^Digit([0-9])$/.exec(event.code)?.[1]
  if (digitCode !== undefined && !event.shiftKey) {
    return digitCode
  }
  if (event.key === '+') {
    return 'Plus'
  }
  if (NAMED_KEYS.has(event.key) || PUNCTUATION_KEYS.has(event.key)) {
    return event.key
  }
  if (/^[0-9]$/.test(event.key)) {
    return event.key
  }
  const letterCode = /^Key([A-Z])$/.exec(event.code)?.[1]
  return letterCode ?? digitCode ?? null
}

export function formatShortcut(shortcut: Shortcut): string {
  const parts: string[] = []
  if (shortcut.mod) parts.push('Mod')
  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.alt) parts.push('Alt')
  if (shortcut.shift) parts.push('Shift')
  parts.push(shortcut.key)
  return parts.join('+')
}

export function parseShortcut(source: string): ParseResult<Shortcut> {
  if (source.length === 0 || source.length > SHORTCUT_SOURCE_LENGTH_MAX) {
    return { success: false, message: 'Shortcut has invalid length' }
  }
  const parts = source.split('+')
  const key = parts.pop()
  if (key === undefined || !isKnownKey(key)) {
    return { success: false, message: 'Unknown key' }
  }
  const modifiers = new Set<ModifierName>()
  for (const part of parts) {
    const modifier = MODIFIER_NAMES.find((name) => name === part)
    if (modifier === undefined) {
      return { success: false, message: 'Unknown modifier' }
    }
    if (modifiers.has(modifier)) {
      return { success: false, message: 'Repeated modifier' }
    }
    modifiers.add(modifier)
  }
  if (modifiers.has('Shift') && PUNCTUATION_KEYS.has(key)) {
    return { success: false, message: 'Shift is implied by the character' }
  }
  return {
    success: true,
    value: {
      key,
      mod: modifiers.has('Mod'),
      ctrl: modifiers.has('Ctrl'),
      alt: modifiers.has('Alt'),
      shift: modifiers.has('Shift'),
    },
  }
}

export function shortcutsEqual(
  a: Shortcut,
  b: Shortcut,
  platform: Platform,
): boolean {
  return (
    formatShortcut(normalizeShortcut(a, platform)) ===
    formatShortcut(normalizeShortcut(b, platform))
  )
}

function normalizeShortcut(shortcut: Shortcut, platform: Platform): Shortcut {
  if (platform === 'mac') {
    return shortcut
  }
  return { ...shortcut, mod: shortcut.mod || shortcut.ctrl, ctrl: false }
}

const MAC_KEY_SYMBOLS: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↵',
  Backspace: '⌫',
  Delete: '⌦',
  Escape: 'Esc',
  Plus: '+',
}

const OTHER_KEY_SYMBOLS: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Delete: 'Del',
  Escape: 'Esc',
  Plus: '+',
}

/** One label per key, in the order the keys are pressed. */
export function shortcutLabels(
  shortcut: Shortcut,
  platform: Platform,
): string[] {
  const normalized = normalizeShortcut(shortcut, platform)
  const labels: string[] = []
  if (platform === 'mac') {
    if (normalized.mod) labels.push('⌘')
    if (normalized.ctrl) labels.push('⌃')
    if (normalized.alt) labels.push('⌥')
    if (normalized.shift) labels.push('⇧')
    labels.push(MAC_KEY_SYMBOLS[normalized.key] ?? normalized.key)
  } else {
    if (normalized.mod) labels.push('Ctrl')
    if (normalized.alt) labels.push('Alt')
    if (normalized.shift) labels.push('Shift')
    labels.push(OTHER_KEY_SYMBOLS[normalized.key] ?? normalized.key)
  }
  return labels
}

function isKnownKey(key: string): boolean {
  return (
    /^[A-Z0-9]$/.test(key) || NAMED_KEYS.has(key) || PUNCTUATION_KEYS.has(key)
  )
}
