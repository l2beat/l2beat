import { isEditableTarget } from '../../../utils/isEditableTarget'
import { useDockingStore } from '../multi-view/store'
import { useSearchStore } from '../search/store'
import { resolveKeybinding } from './resolve'
import type { ScopeContext } from './scope'
import { PLATFORM, shortcutFromEvent } from './shortcut'
import {
  type Keybinding,
  selectKeybindings,
  useKeybindingsStore,
} from './store'

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
    readScopeContext(event.target),
    PLATFORM,
  )
}

function readScopeContext(target: EventTarget | null): ScopeContext {
  const activeLeaf = useDockingStore.getState().activeLeaf
  return {
    inputFocus: acceptsTyping(target),
    nodesPanelActive: activeLeaf === undefined || activeLeaf === 'nodes',
    searchOpen: useSearchStore.getState().opened,
    dialogFocus:
      target instanceof Element && target.closest('[role="dialog"]') !== null,
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
