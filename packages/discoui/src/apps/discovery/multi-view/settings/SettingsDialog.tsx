import * as RadixTabs from '@radix-ui/react-tabs'
import { type ReactNode, useState } from 'react'
import { Dialog } from '../../../../components/Dialog'
import { IconGear } from '../../../../icons/IconGear'
import { IconKeyboard } from '../../../../icons/IconKeyboard'
import { IconNodes } from '../../../../icons/IconNodes'
import { GlobalSettingsTab } from './GlobalSettingsTab'
import { KeybindingsSettingsTab } from './KeybindingsSettingsTab'
import { NodesSettingsTab } from './NodesSettingsTab'

export type SettingsTabId = 'global' | 'nodes' | 'keybindings'

const SETTINGS_TABS: {
  id: SettingsTabId
  label: string
  icon: ReactNode
  description: string
  Content: () => ReactNode
}[] = [
  {
    id: 'global',
    label: 'Global',
    icon: <IconGear className="size-3.5" />,
    description: 'Change the way the app behaves.',
    Content: GlobalSettingsTab,
  },
  {
    id: 'nodes',
    label: 'Nodes',
    icon: <IconNodes className="size-3.5" />,
    description: 'Change how nodes are displayed in every nodes panel.',
    Content: NodesSettingsTab,
  },
  {
    id: 'keybindings',
    label: 'Keybindings',
    icon: <IconKeyboard className="size-3.5" />,
    description:
      'Change the keyboard shortcuts. Click a shortcut, then press the new one.',
    Content: KeybindingsSettingsTab,
  },
]

export function SettingsDialog(props: {
  trigger: ReactNode
  defaultTabId: SettingsTabId
}) {
  const [tabId, setTabId] = useState<SettingsTabId>(props.defaultTabId)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Body
        className="flex h-[min(640px,85vh)] max-w-[820px] flex-col overflow-hidden p-0"
        // Keys pressed in the settings stay there, so typing a search or
        // trying a key never runs a shortcut on the page behind.
        onKeyDown={(event) => event.stopPropagation()}
      >
        <RadixTabs.Root
          value={tabId}
          onValueChange={(value) => setTabId(parseSettingsTabId(value))}
          orientation="vertical"
          className="flex min-h-0 flex-1 max-sm:flex-col"
        >
          <SettingsNavigation />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <SettingsHeader tabId={tabId} />
            {SETTINGS_TABS.map((tab) => (
              <RadixTabs.Content
                key={tab.id}
                value={tab.id}
                className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6 focus:outline-hidden max-sm:px-3"
              >
                <p className="mb-5 px-1 text-coffee-300 text-xs leading-4">
                  {tab.description}
                </p>
                <div className="flex flex-col gap-6">
                  <tab.Content />
                </div>
              </RadixTabs.Content>
            ))}
          </div>
        </RadixTabs.Root>
      </Dialog.Body>
    </Dialog.Root>
  )
}

function SettingsNavigation() {
  return (
    <RadixTabs.List
      aria-label="Settings sections"
      className="flex w-40 shrink-0 flex-col gap-0.5 border-coffee-700 border-r bg-coffee-800/50 p-2 max-sm:w-auto max-sm:flex-row max-sm:border-r-0 max-sm:border-b"
    >
      {SETTINGS_TABS.map((tab) => (
        <RadixTabs.Trigger
          key={tab.id}
          value={tab.id}
          className="flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-left font-medium text-sm transition-colors duration-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300 data-[state=active]:bg-coffee-700 data-[state=active]:text-coffee-100 data-[state=inactive]:text-coffee-300 data-[state=inactive]:hover:bg-coffee-700/50 data-[state=inactive]:hover:text-coffee-100"
        >
          {tab.icon}
          {tab.label}
        </RadixTabs.Trigger>
      ))}
    </RadixTabs.List>
  )
}

function SettingsHeader(props: { tabId: SettingsTabId }) {
  const tab = SETTINGS_TABS.find((tab) => tab.id === props.tabId)
  if (tab === undefined) {
    throw new Error('Unknown settings tab', { cause: { tabId: props.tabId } })
  }
  return (
    <div className="flex h-13 shrink-0 items-center border-coffee-700 border-b pr-12 pl-7 max-sm:pl-4">
      <Dialog.Title className="mb-0 flex items-center gap-2 font-medium text-sm">
        <span className="text-coffee-300">Settings</span>
        <span className="text-coffee-500">/</span>
        <span>{tab.label}</span>
      </Dialog.Title>
    </div>
  )
}

function parseSettingsTabId(value: string): SettingsTabId {
  const tab = SETTINGS_TABS.find((tab) => tab.id === value)
  if (tab === undefined) {
    throw new Error('Unknown settings tab', { cause: { value } })
  }
  return tab.id
}
