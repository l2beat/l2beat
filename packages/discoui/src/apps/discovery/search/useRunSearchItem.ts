import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useCodeStore } from '../../../components/editor/store'
import { IS_READONLY } from '../../../config/readonly'
import { useIsomorphicKeys } from '../hooks/useIsomorphicKeys'
import { isAllowedPanel, PANEL_IDS } from '../multi-view/config'
import { addPanel, useDockingStore } from '../multi-view/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { usePanelStore } from '../store/panel-store'
import type { CommandDefinition, SearchCommand, SearchItem } from './items'
import { useSearchStore } from './store'

export function useSearchCommands(): CommandDefinition[] {
  const { altKey } = useIsomorphicKeys()
  return useMemo(() => buildCommands(altKey), [altKey])
}

function buildCommands(altKey: string): CommandDefinition[] {
  const commands: CommandDefinition[] = PANEL_IDS.filter(isAllowedPanel).map(
    (panel) => ({
      command: { type: 'openPanel', panel },
      title: `Open ${panel} panel`,
      shortcut: '',
    }),
  )
  commands.push(
    {
      command: { type: 'addPanel' },
      title: 'Add panel',
      shortcut: `${altKey}+Enter`,
    },
    {
      command: { type: 'closePanel' },
      title: 'Close panel',
      shortcut: `${altKey}+Q`,
    },
    {
      command: { type: 'toggleFullScreen' },
      title: 'Toggle full screen panel',
      shortcut: `${altKey}+F`,
    },
  )
  for (let index = 0; index < 6; index++) {
    commands.push({
      command: { type: 'loadLayout', index },
      title: `Switch to layout ${index + 1}`,
      shortcut: `${altKey}+${index + 1}`,
    })
  }
  if (!IS_READONLY) {
    commands.push({
      command: { type: 'discover' },
      title: 'Run discovery',
      shortcut: `${altKey}+R`,
    })
  }
  commands.push({
    command: { type: 'goToProjects' },
    title: 'Go to all projects',
    shortcut: '',
  })
  return commands
}

export function useRunSearchItem(project: string): (item: SearchItem) => void {
  const navigate = useNavigate()
  const select = usePanelStore((s) => s.select)
  const revealField = usePanelStore((s) => s.revealField)
  const ensureLeaf = useDockingStore((s) => s.ensureLeaf)
  const setSourceIndex = useCodeStore((s) => s.setSourceIndex)
  const showRange = useCodeStore((s) => s.showRange)
  const setOpen = useSearchStore((s) => s.setOpen)
  const setScope = useSearchStore((s) => s.setScope)
  const pushRecentAddress = useSearchStore((s) => s.pushRecentAddress)
  const runCommand = useRunSearchCommand(project)

  return (item) => {
    switch (item.kind) {
      case 'scope':
        setScope(item.scope)
        return
      case 'contract':
        select([item.address])
        pushRecentAddress(item.address)
        break
      case 'field':
        ensureLeaf('values')
        select([item.address])
        revealField({ address: item.address, name: item.fieldName })
        pushRecentAddress(item.address)
        break
      case 'code':
        ensureLeaf('code')
        select([item.address])
        setSourceIndex(item.address, item.sourceIndex)
        showRange(item.address, {
          startOffset: item.offset,
          length: item.length,
        })
        pushRecentAddress(item.address)
        break
      case 'project':
        void navigate(`/ui/p/${item.project}`)
        break
      case 'command':
        runCommand(item.command)
        break
    }
    setOpen(false)
  }
}

function useRunSearchCommand(project: string) {
  const navigate = useNavigate()
  const ensureLeaf = useDockingStore((s) => s.ensureLeaf)
  const removeLeaf = useDockingStore((s) => s.removeLeaf)
  const loadLayout = useDockingStore((s) => s.loadLayout)
  const toggleFullScreen = useDockingStore((s) => s.toggleFullScreen)
  const { discover } = useDiscoveryCommand()

  return (command: SearchCommand) => {
    switch (command.type) {
      case 'openPanel':
        ensureLeaf(command.panel)
        return
      case 'addPanel':
        addPanel()
        return
      case 'closePanel':
        removeLeaf()
        return
      case 'toggleFullScreen':
        toggleFullScreen()
        return
      case 'loadLayout':
        loadLayout(command.index)
        return
      case 'discover':
        void discover(project, true)
        return
      case 'goToProjects':
        void navigate('/ui')
        return
    }
  }
}
