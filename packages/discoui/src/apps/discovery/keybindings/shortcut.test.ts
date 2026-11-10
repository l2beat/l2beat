import { expect } from 'earl'
import {
  formatShortcut,
  type KeyEventLike,
  parseShortcut,
  shortcutFromEvent,
  shortcutLabels,
  shortcutsEqual,
} from './shortcut'

// Events are plain objects with only the fields shortcuts read, so each case
// states exactly which keys are down.
describe('shortcut', () => {
  describe(shortcutFromEvent.name, () => {
    it('reads letters from the physical key, so Option symbols still match', () => {
      const event = keyEvent({ key: '©', code: 'KeyG', altKey: true })
      expect(shortcutFromEvent(event, 'mac')).toEqual(
        shortcut('G', { alt: true }),
      )
    })

    it('maps Cmd to Mod on macOS and Ctrl to Mod elsewhere', () => {
      expect(
        shortcutFromEvent(
          keyEvent({ key: 'k', code: 'KeyK', metaKey: true }),
          'mac',
        ),
      ).toEqual(shortcut('K', { mod: true }))
      expect(
        shortcutFromEvent(
          keyEvent({ key: 'k', code: 'KeyK', ctrlKey: true }),
          'mac',
        ),
      ).toEqual(shortcut('K', { ctrl: true }))
      expect(
        shortcutFromEvent(
          keyEvent({ key: 'k', code: 'KeyK', ctrlKey: true }),
          'other',
        ),
      ).toEqual(shortcut('K', { mod: true }))
    })

    it('reads letters from the character typed, so AZERTY undo is still Z', () => {
      const event = keyEvent({ key: 'z', code: 'KeyW', ctrlKey: true })
      expect(shortcutFromEvent(event, 'other')).toEqual(
        shortcut('Z', { mod: true }),
      )
    })

    it('falls back to the physical key for non-Latin letters', () => {
      const event = keyEvent({ key: 'р', code: 'KeyH' })
      expect(shortcutFromEvent(event, 'other')).toEqual(shortcut('H'))
    })

    it('reads the digit row by position, unless Shift makes it a character', () => {
      // AZERTY types '&' on the 1 key without Shift.
      const azerty = keyEvent({ key: '&', code: 'Digit1', altKey: true })
      expect(shortcutFromEvent(azerty, 'other')).toEqual(
        shortcut('1', { alt: true }),
      )
      // German types '/' with Shift+7.
      const german = keyEvent({ key: '/', code: 'Digit7', shiftKey: true })
      expect(shortcutFromEvent(german, 'other')).toEqual(shortcut('/'))
    })

    it('drops Shift from punctuation, whose character already says it', () => {
      const event = keyEvent({ key: '?', code: 'Slash', shiftKey: true })
      expect(shortcutFromEvent(event, 'other')).toEqual(shortcut('?'))
    })

    it('names Space and Plus, and keeps named keys', () => {
      expect(
        shortcutFromEvent(keyEvent({ key: ' ', code: 'Space' }), 'other'),
      ).toEqual(shortcut('Space'))
      expect(
        shortcutFromEvent(keyEvent({ key: '+', code: 'Equal' }), 'other'),
      ).toEqual(shortcut('Plus'))
      expect(
        shortcutFromEvent(keyEvent({ key: 'F12', code: 'F12' }), 'other'),
      ).toEqual(shortcut('F12'))
    })

    it('returns null for a lone modifier, an unknown key and the Windows key', () => {
      expect(
        shortcutFromEvent(
          keyEvent({ key: 'Shift', code: 'ShiftLeft', shiftKey: true }),
          'mac',
        ),
      ).toEqual(null)
      expect(
        shortcutFromEvent(keyEvent({ key: 'Dead', code: 'Quote' }), 'mac'),
      ).toEqual(null)
      expect(
        shortcutFromEvent(
          keyEvent({ key: 'a', code: 'KeyA', metaKey: true }),
          'other',
        ),
      ).toEqual(null)
    })
  })

  describe(parseShortcut.name, () => {
    it('round-trips through formatShortcut in canonical order', () => {
      const parsed = parseShortcut('Shift+Alt+Mod+G')
      expect(parsed).toEqual({
        success: true,
        value: shortcut('G', { mod: true, alt: true, shift: true }),
      })
      if (parsed.success) {
        expect(formatShortcut(parsed.value)).toEqual('Mod+Alt+Shift+G')
      }
    })

    it('rejects unknown keys and modifiers, repeats and Shift on punctuation', () => {
      for (const source of [
        '',
        'Mod+',
        'Hyper+K',
        'Alt+Alt+K',
        'Shift+/',
        'Mod+k',
        'Æ',
      ]) {
        expect(parseShortcut(source).success).toEqual(false)
      }
    })
  })

  describe(shortcutsEqual.name, () => {
    it('treats Ctrl as Mod off macOS only', () => {
      const ctrl = shortcut('Y', { ctrl: true })
      const mod = shortcut('Y', { mod: true })
      expect(shortcutsEqual(ctrl, mod, 'other')).toEqual(true)
      expect(shortcutsEqual(ctrl, mod, 'mac')).toEqual(false)
    })
  })

  describe(shortcutLabels.name, () => {
    it('uses symbols on macOS and words elsewhere', () => {
      const value = shortcut('F', { mod: true, shift: true })
      expect(shortcutLabels(value, 'mac')).toEqual(['⌘', '⇧', 'F'])
      expect(shortcutLabels(value, 'other')).toEqual(['Ctrl', 'Shift', 'F'])
    })
  })
})

function keyEvent(
  init: Partial<KeyEventLike> & Pick<KeyEventLike, 'key' | 'code'>,
) {
  return {
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    ...init,
  }
}

function shortcut(
  key: string,
  modifiers: Partial<{
    mod: boolean
    ctrl: boolean
    alt: boolean
    shift: boolean
  }> = {},
) {
  return {
    key,
    mod: false,
    ctrl: false,
    alt: false,
    shift: false,
    ...modifiers,
  }
}
