import { expect } from 'earl'
import { COMMAND_IDS, getDefaultKeybindings } from './commands'
import { groupKeybindings } from './groups'
import { findConflicts, resolveKeybinding } from './resolve'
import { formatShortcut, parseShortcut, type Shortcut } from './shortcut'
import {
  computeKeybindings,
  type KeybindingsState,
  sanitizeStoredState,
} from './store'
import { parseWhen, type WhenContext } from './when'

const DEFAULTS = getDefaultKeybindings('other')
const EMPTY: KeybindingsState = { overrides: {}, userKeybindings: [] }

const ON_CANVAS: WhenContext = {
  inputFocus: false,
  editorFocus: false,
  nodesPanelActive: true,
  searchOpen: false,
  controlFocus: false,
}
const TYPING: WhenContext = { ...ON_CANVAS, inputFocus: true }

describe('keybindings', () => {
  describe(getDefaultKeybindings.name, () => {
    it('stores every shortcut and when clause in canonical form', () => {
      for (const platform of ['mac', 'other'] as const) {
        for (const binding of getDefaultKeybindings(platform)) {
          const shortcut = parseShortcut(binding.shortcut)
          expect(shortcut.success && formatShortcut(shortcut.value)).toEqual(
            binding.shortcut,
          )
          if (binding.when !== null) {
            const when = parseWhen(binding.when)
            expect(when.success && when.value.source).toEqual(binding.when)
          }
        }
      }
    })

    it('gives every command a shortcut and every keybinding a unique id', () => {
      for (const command of COMMAND_IDS) {
        expect(DEFAULTS.some((b) => b.command === command)).toEqual(true)
      }
      const ids = DEFAULTS.map((b) => b.id)
      expect(new Set(ids).size).toEqual(ids.length)
    })

    it('adds Ctrl+Y for redo off macOS only', () => {
      const hasCtrlY = (platform: 'mac' | 'other') =>
        getDefaultKeybindings(platform).some((b) => b.id === 'nodes.redo/Mod+Y')
      expect(hasCtrlY('other')).toEqual(true)
      expect(hasCtrlY('mac')).toEqual(false)
    })
  })

  describe(resolveKeybinding.name, () => {
    it('runs a default only where its when clause holds', () => {
      const keybindings = computeKeybindings(DEFAULTS, EMPTY)
      expect(resolve(keybindings, 'H', ON_CANVAS)?.command).toEqual('tool.hand')
      expect(resolve(keybindings, 'H', TYPING)).toEqual(undefined)
      // A focused button keeps Space to press itself.
      expect(resolve(keybindings, 'Space', ON_CANVAS)?.command).toEqual(
        'tool.handHold',
      )
      expect(
        resolve(keybindings, 'Space', { ...ON_CANVAS, controlFocus: true }),
      ).toEqual(undefined)
      expect(resolve(keybindings, 'Mod+K', TYPING)?.command).toEqual(
        'search.toggle',
      )
    })

    it('lets a user keybinding win over a default on the same shortcut', () => {
      const keybindings = computeKeybindings(DEFAULTS, {
        overrides: {},
        userKeybindings: [
          { id: 'user/1', command: 'panel.add', shortcut: 'H', when: null },
        ],
      })
      expect(resolve(keybindings, 'H', ON_CANVAS)?.command).toEqual('panel.add')
      expect(
        findConflicts(keybindings, at(keybindings, 'user/1'), 'other').map(
          (b) => b.command,
        ),
      ).toEqual(['tool.hand'])
    })

    it('stops matching a default whose shortcut was removed', () => {
      const keybindings = computeKeybindings(DEFAULTS, {
        overrides: { 'tool.hand/H': { shortcut: null, when: null } },
        userKeybindings: [],
      })
      expect(resolve(keybindings, 'H', ON_CANVAS)).toEqual(undefined)
      expect(at(keybindings, 'tool.hand/H').isModified).toEqual(true)
    })
  })

  describe(sanitizeStoredState.name, () => {
    it('keeps valid entries in canonical form', () => {
      const state = sanitizeStoredState(
        {
          overrides: {
            'tool.hand/H': { shortcut: 'Shift+Mod+H', when: ' editorFocus ' },
          },
          userKeybindings: [
            { id: 'user/1', command: 'panel.add', shortcut: null, when: null },
          ],
        },
        DEFAULTS,
      )
      expect(state).toEqual({
        overrides: {
          'tool.hand/H': { shortcut: 'Mod+Shift+H', when: 'editorFocus' },
        },
        userKeybindings: [
          { id: 'user/1', command: 'panel.add', shortcut: null, when: null },
        ],
      })
    })

    it('drops unknown ids, unknown commands, bad strings and duplicates', () => {
      const state = sanitizeStoredState(
        {
          overrides: {
            'gone/X': { shortcut: 'X', when: null },
            'tool.hand/H': { shortcut: 'Hyper+H', when: null },
            'tool.select/V': { shortcut: 'V', when: 'terminalFocus' },
          },
          userKeybindings: [
            { id: 'user/1', command: 'gone', shortcut: 'X', when: null },
            { id: 'user/2', command: 'panel.add', shortcut: 'X', when: null },
            { id: 'user/2', command: 'panel.close', shortcut: 'Y', when: null },
            // Not a user id: it would collide with the default's.
            {
              id: 'tool.hand/H',
              command: 'panel.add',
              shortcut: 'X',
              when: null,
            },
            { id: 'user/3', command: 'panel.add' },
          ],
        },
        DEFAULTS,
      )
      expect(state).toEqual({
        overrides: {},
        userKeybindings: [
          { id: 'user/2', command: 'panel.add', shortcut: 'X', when: null },
        ],
      })
    })

    it('keeps the valid entries when one is malformed', () => {
      const state = sanitizeStoredState(
        {
          overrides: {
            'tool.hand/H': { shortcut: 'J', when: null },
            'tool.select/V': 'not an object',
          },
          userKeybindings: [42],
        },
        DEFAULTS,
      )
      expect(state).toEqual({
        overrides: { 'tool.hand/H': { shortcut: 'J', when: null } },
        userKeybindings: [],
      })
    })

    it('starts empty from storage of the wrong shape', () => {
      expect(sanitizeStoredState({ overrides: [] }, DEFAULTS)).toEqual(EMPTY)
      expect(sanitizeStoredState(undefined, DEFAULTS)).toEqual(EMPTY)
    })
  })

  describe(groupKeybindings.name, () => {
    it('orders sections and titles, and keeps one command in precedence order', () => {
      const sections = groupKeybindings(
        computeKeybindings(DEFAULTS, EMPTY),
        '',
        'other',
      )
      expect(sections.map((s) => s.title)).toEqual([
        'Navigation',
        'Discovery',
        'Nodes',
      ])
      const search = sections[0]?.keybindings.filter(
        (b) => b.command === 'search.open',
      )
      expect(search?.map((b) => b.id)).toEqual([
        'search.open//',
        'search.open/Alt+P',
      ])
    })

    it('matches every word against title, when clause and shortcut', () => {
      const keybindings = computeKeybindings(DEFAULTS, EMPTY)
      const ids = (query: string) =>
        groupKeybindings(keybindings, query, 'other').flatMap((s) =>
          s.keybindings.map((b) => b.id),
        )
      expect(ids('hand space')).toEqual(['tool.handHold/Space'])
      expect(ids('ctrl+shift')).toEqual(['nodes.redo/Mod+Shift+Z'])
      expect(ids('always')).toEqual(['search.toggle/Mod+K'])
      expect(ids('nothing matches this')).toEqual([])
    })
  })
})

function resolve(
  keybindings: ReturnType<typeof computeKeybindings>,
  source: string,
  context: WhenContext,
) {
  return resolveKeybinding(keybindings, parse(source), context, 'other')
}

function parse(source: string): Shortcut {
  const parsed = parseShortcut(source)
  if (!parsed.success) {
    throw new Error('Test shortcut does not parse', { cause: { source } })
  }
  return parsed.value
}

function at(keybindings: ReturnType<typeof computeKeybindings>, id: string) {
  const keybinding = keybindings.find((b) => b.id === id)
  if (keybinding === undefined) {
    throw new Error('Test keybinding missing', { cause: { id } })
  }
  return keybinding
}
