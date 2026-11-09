import { v } from '@l2beat/validate'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type CommandId,
  type DefaultKeybinding,
  getDefaultKeybindings,
  parseCommandId,
} from './commands'
import {
  formatShortcut,
  type ParseResult,
  PLATFORM,
  parseShortcut,
  type Shortcut,
} from './shortcut'
import { parseWhen, type WhenClause } from './when'

export interface Keybinding {
  readonly id: string
  readonly command: CommandId
  /** null leaves the command without a shortcut. */
  readonly shortcut: Shortcut | null
  /** null runs the command everywhere. */
  readonly when: WhenClause | null
  readonly origin: 'default' | 'user'
  /** A user keybinding is always modified, a default one once overridden. */
  readonly isModified: boolean
}

// Stored strings are canonical and parse, `sanitizeStoredState` makes sure of
// both when loading.
interface StoredKeybinding {
  readonly shortcut: string | null
  readonly when: string | null
}

interface UserKeybinding extends StoredKeybinding {
  readonly id: string
  readonly command: CommandId
}

export interface KeybindingsState {
  /** Changes to default keybindings, by default keybinding id. */
  readonly overrides: Readonly<Record<string, StoredKeybinding>>
  readonly userKeybindings: readonly UserKeybinding[]
}

interface Actions {
  setShortcut: (id: string, shortcut: Shortcut | null) => void
  setWhen: (id: string, when: WhenClause | null) => void
  resetKeybinding: (id: string) => void
  removeKeybinding: (id: string) => void
  /** Adds a keybinding without a shortcut and returns its id. */
  addKeybinding: (command: CommandId) => string
  resetAllKeybindings: () => void
}

export const DEFAULT_KEYBINDINGS = getDefaultKeybindings(PLATFORM)

const EMPTY_STATE: KeybindingsState = { overrides: {}, userKeybindings: [] }

const USER_KEYBINDING_ID_PREFIX = 'user/'

export const useKeybindingsStore = create<KeybindingsState & Actions>()(
  persist(
    (set, get) => ({
      ...EMPTY_STATE,
      setShortcut: (id, shortcut) =>
        set(
          updateKeybinding(get(), id, {
            shortcut: shortcut === null ? null : formatShortcut(shortcut),
          }),
        ),
      setWhen: (id, when) =>
        set(updateKeybinding(get(), id, { when: when?.source ?? null })),
      resetKeybinding: (id) => set(resetKeybinding(get(), id)),
      removeKeybinding: (id) => set(removeKeybinding(get(), id)),
      addKeybinding: (command) => {
        const id = createUserKeybindingId(get())
        const defaultBinding = DEFAULT_KEYBINDINGS.find(
          (b) => b.command === command,
        )
        const added: UserKeybinding = {
          id,
          command,
          shortcut: null,
          when: defaultBinding?.when ?? null,
        }
        set({ userKeybindings: [...get().userKeybindings, added] })
        return id
      },
      resetAllKeybindings: () => set(EMPTY_STATE),
    }),
    {
      name: 'discoui-keybindings-v1',
      version: 1,
      partialize: (state): KeybindingsState => ({
        overrides: state.overrides,
        userKeybindings: state.userKeybindings,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeStoredState(persisted, DEFAULT_KEYBINDINGS),
      }),
    },
  ),
)

let keybindingsCache:
  | { state: KeybindingsState; keybindings: readonly Keybinding[] }
  | undefined

// Recomputes only when the stored keybindings change, so selecting the list
// returns the same array between unrelated store updates.
export function selectKeybindings(
  state: KeybindingsState,
): readonly Keybinding[] {
  if (
    keybindingsCache === undefined ||
    keybindingsCache.state.overrides !== state.overrides ||
    keybindingsCache.state.userKeybindings !== state.userKeybindings
  ) {
    keybindingsCache = {
      state,
      keybindings: computeKeybindings(DEFAULT_KEYBINDINGS, state),
    }
  }
  return keybindingsCache.keybindings
}

// Defaults come first and user keybindings after, so for one shortcut a user
// keybinding takes precedence, as the last match wins.
export function computeKeybindings(
  defaults: readonly DefaultKeybinding[],
  state: KeybindingsState,
): Keybinding[] {
  const keybindings: Keybinding[] = []
  for (const binding of defaults) {
    const override = state.overrides[binding.id]
    keybindings.push({
      id: binding.id,
      command: binding.command,
      ...parseStored(override ?? binding),
      origin: 'default',
      isModified: override !== undefined,
    })
  }
  for (const binding of state.userKeybindings) {
    keybindings.push({
      id: binding.id,
      command: binding.command,
      ...parseStored(binding),
      origin: 'user',
      isModified: true,
    })
  }
  return keybindings
}

function parseStored(stored: StoredKeybinding) {
  return {
    shortcut:
      stored.shortcut === null
        ? null
        : parseOrThrow(parseShortcut(stored.shortcut)),
    when: stored.when === null ? null : parseOrThrow(parseWhen(stored.when)),
  }
}

function parseOrThrow<T>(result: ParseResult<T>): T {
  if (!result.success) {
    throw new Error('Stored keybinding does not parse', {
      cause: { message: result.message },
    })
  }
  return result.value
}

function updateKeybinding(
  state: KeybindingsState,
  id: string,
  change: Partial<StoredKeybinding>,
): Partial<KeybindingsState> {
  const defaultBinding = DEFAULT_KEYBINDINGS.find((b) => b.id === id)
  if (defaultBinding !== undefined) {
    const next = { ...(state.overrides[id] ?? defaultBinding), ...change }
    const { [id]: _, ...rest } = state.overrides
    const isDefault =
      next.shortcut === defaultBinding.shortcut &&
      next.when === defaultBinding.when
    return {
      overrides: isDefault
        ? rest
        : { ...rest, [id]: { shortcut: next.shortcut, when: next.when } },
    }
  }
  assertUserKeybinding(state, id)
  return {
    userKeybindings: state.userKeybindings.map((binding) =>
      binding.id === id ? { ...binding, ...change } : binding,
    ),
  }
}

function resetKeybinding(
  state: KeybindingsState,
  id: string,
): Partial<KeybindingsState> {
  if (!DEFAULT_KEYBINDINGS.some((b) => b.id === id)) {
    throw new Error('Only default keybindings reset', { cause: { id } })
  }
  const { [id]: _, ...rest } = state.overrides
  return { overrides: rest }
}

function removeKeybinding(
  state: KeybindingsState,
  id: string,
): Partial<KeybindingsState> {
  assertUserKeybinding(state, id)
  return {
    userKeybindings: state.userKeybindings.filter((b) => b.id !== id),
  }
}

function assertUserKeybinding(state: KeybindingsState, id: string) {
  if (!state.userKeybindings.some((b) => b.id === id)) {
    throw new Error('Unknown keybinding', { cause: { id } })
  }
}

function createUserKeybindingId(state: KeybindingsState): string {
  const id = `${USER_KEYBINDING_ID_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  if (state.userKeybindings.some((b) => b.id === id)) {
    throw new Error('Keybinding id collision', { cause: { id } })
  }
  return id
}

const StoredKeybindingSchema = v.object({
  shortcut: v.union([v.string(), v.null()]),
  when: v.union([v.string(), v.null()]),
})

const UserKeybindingSchema = v.object({
  id: v.string(),
  command: v.string(),
  shortcut: v.union([v.string(), v.null()]),
  when: v.union([v.string(), v.null()]),
})

// Entries parse one by one, so one bad entry costs only itself.
const PersistedStateSchema = v.object({
  overrides: v.record(v.string(), v.unknown()),
  userKeybindings: v.array(v.unknown()),
})

// Storage is outside input: an entry that does not parse, names a command or
// default keybinding that no longer exists, or reuses an id, is dropped, not
// trusted.
export function sanitizeStoredState(
  persisted: unknown,
  defaults: readonly DefaultKeybinding[],
): KeybindingsState {
  const result = PersistedStateSchema.safeParse(persisted)
  if (!result.success) {
    return EMPTY_STATE
  }
  const overrides: Record<string, StoredKeybinding> = {}
  for (const [id, entry] of Object.entries(result.data.overrides)) {
    const stored = StoredKeybindingSchema.safeParse(entry)
    const canonical = stored.success ? canonicalStored(stored.data) : undefined
    if (defaults.some((b) => b.id === id) && canonical !== undefined) {
      overrides[id] = canonical
    }
  }
  const userKeybindings: UserKeybinding[] = []
  for (const entry of result.data.userKeybindings) {
    const stored = UserKeybindingSchema.safeParse(entry)
    if (!stored.success) {
      continue
    }
    const { id } = stored.data
    const command = parseCommandId(stored.data.command)
    const canonical = canonicalStored(stored.data)
    const isUserId = id.startsWith(USER_KEYBINDING_ID_PREFIX)
    const isDuplicate = userKeybindings.some((b) => b.id === id)
    if (
      command !== undefined &&
      canonical !== undefined &&
      isUserId &&
      !isDuplicate
    ) {
      userKeybindings.push({ id, command, ...canonical })
    }
  }
  return { overrides, userKeybindings }
}

function canonicalStored(
  stored: StoredKeybinding,
): StoredKeybinding | undefined {
  let shortcut: string | null = null
  if (stored.shortcut !== null) {
    const parsed = parseShortcut(stored.shortcut)
    if (!parsed.success) {
      return undefined
    }
    shortcut = formatShortcut(parsed.value)
  }
  let when: string | null = null
  if (stored.when !== null) {
    const parsed = parseWhen(stored.when)
    if (!parsed.success) {
      return undefined
    }
    when = parsed.value.source
  }
  return { shortcut, when }
}
