import { isEditableTarget } from '../../../utils/isEditableTarget'
import { useDockingStore } from '../multi-view/store'
import { useSearchStore } from '../search/store'
import { resolveKeybinding } from './resolve'
import { PLATFORM, shortcutFromEvent } from './shortcut'
import {
  type Keybinding,
  selectKeybindings,
  useKeybindingsStore,
} from './store'
import type { WhenContext } from './when'

/** The keybinding a key press runs right now, if any. */
export function findKeybindingForEvent(
  event: KeyboardEvent,
): Keybinding | undefined {
  if (event.isComposing) {
    return undefined
  }
  const shortcut = shortcutFromEvent(event, PLATFORM)
  if (shortcut === null) {
    return undefined
  }
  return resolveKeybinding(
    selectKeybindings(useKeybindingsStore.getState()),
    shortcut,
    readWhenContext(event.target),
    PLATFORM,
  )
}

export function readWhenContext(target: EventTarget | null): WhenContext {
  const activeLeaf = useDockingStore.getState().activeLeaf
  return {
    inputFocus: acceptsTyping(target),
    editorFocus:
      target instanceof Element && target.closest('.cm-editor') !== null,
    nodesPanelActive: activeLeaf === undefined || activeLeaf === 'nodes',
    searchOpen: useSearchStore.getState().opened,
    controlFocus:
      target instanceof Element &&
      target.closest('button, a[href], [role="button"], summary') !== null,
  }
}

// A read-only code editor is still contenteditable, to keep a caret, but
// nothing can be typed into it.
function acceptsTyping(target: EventTarget | null): boolean {
  if (!isEditableTarget(target)) {
    return false
  }
  return !(
    target instanceof HTMLElement &&
    target.classList.contains('cm-content') &&
    target.getAttribute('aria-readonly') === 'true'
  )
}
