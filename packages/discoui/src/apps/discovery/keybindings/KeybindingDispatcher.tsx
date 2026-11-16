import { useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { addPanel, useDockingStore } from '../multi-view/store'
import { useStore } from '../panel-nodes/store/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { useSearchStore } from '../search/store'
import {
  COMMANDS,
  type HoldCommandId,
  isHoldCommand,
  type PressCommandId,
} from './commands'
import { findKeybindingForEvent } from './dispatch'

type PressHandlers = Record<PressCommandId, () => void>
type HoldHandlers = Record<HoldCommandId, (held: boolean) => void>

// One window listener runs every keybinding, so a shortcut changed in the
// settings applies at once, and two places never handle the same key.
export function KeybindingDispatcher() {
  const pressHandlers = usePressHandlers()
  const pressHandlersRef = useRef(pressHandlers)
  pressHandlersRef.current = pressHandlers

  useEffect(() => {
    // Physical key codes: a character can change between press and release,
    // like '?' turning into '/' once Shift comes up first.
    const heldCodes = new Map<HoldCommandId, string>()
    const holdHandlers: HoldHandlers = {
      'tool.handHold': (held) => useStore.getState().setSpacePressed(held),
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return
      }
      const keybinding = findKeybindingForEvent(event)
      if (keybinding === undefined) {
        return
      }
      if (keybinding.shortcut === null) {
        throw new Error('Resolved keybinding has no shortcut', {
          cause: { id: keybinding.id },
        })
      }
      event.preventDefault()
      const command = keybinding.command
      if (isHoldCommand(command)) {
        if (heldCodes.has(command)) {
          return
        }
        heldCodes.set(command, event.code)
        holdHandlers[command](true)
        return
      }
      if (event.repeat && !COMMANDS[command].repeats) {
        return
      }
      pressHandlersRef.current[command]()
    }

    // The key, not the whole shortcut, ends a hold: its modifiers may already
    // be up by then.
    function onKeyUp(event: KeyboardEvent) {
      for (const [command, heldCode] of heldCodes) {
        if (heldCode === event.code) {
          heldCodes.delete(command)
          holdHandlers[command](false)
        }
      }
    }

    // A key released while the window is in the background sends no keyup.
    function releaseAll() {
      for (const command of heldCodes.keys()) {
        holdHandlers[command](false)
      }
      heldCodes.clear()
    }

    // A release must never be lost to an element that stops propagation, so
    // keyup is heard in the capture phase, before any such element.
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp, { capture: true })
    window.addEventListener('blur', releaseAll)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp, { capture: true })
      window.removeEventListener('blur', releaseAll)
      releaseAll()
    }
  }, [])

  return null
}

function usePressHandlers(): PressHandlers {
  const { project } = useParams()
  const { discover, killCommand } = useDiscoveryCommand()

  function selectLayout(index: number) {
    return () => useDockingStore.getState().loadLayout(index)
  }

  return {
    'search.toggle': () => {
      const search = useSearchStore.getState()
      search.setOpen(!search.opened)
    },
    'search.open': () => useSearchStore.getState().setOpen(true),
    'layout.select1': selectLayout(0),
    'layout.select2': selectLayout(1),
    'layout.select3': selectLayout(2),
    'layout.select4': selectLayout(3),
    'layout.select5': selectLayout(4),
    'layout.select6': selectLayout(5),
    'panel.add': () => addPanel(),
    'panel.close': () => useDockingStore.getState().removeLeaf(),
    'panel.toggleFullScreen': () =>
      useDockingStore.getState().toggleFullScreen(),
    'discovery.run': () => {
      if (project !== undefined) {
        void discover(project, true)
      }
    },
    'discovery.kill': () => killCommand(),
    'nodes.group': () => useStore.getState().groupSelected(),
    'nodes.ungroup': () => useStore.getState().ungroupSelected(),
    'nodes.hideSelected': () => useStore.getState().hideSelected(),
    'nodes.undo': () => useStore.getState().undo(),
    'nodes.redo': () => useStore.getState().redo(),
    'tool.select': () => useStore.getState().setTool('select'),
    'tool.hand': () => useStore.getState().setTool('hand'),
  }
}
