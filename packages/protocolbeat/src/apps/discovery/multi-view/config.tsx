import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import type { FC, JSX } from 'react'
import {
  type DockingConfig,
  type LeafApi,
  newLeaf,
  newSplit,
  useDockingHook,
} from '../../../components/docking'
import { IS_READONLY } from '../../../config/readonly'
import { IconChatbot } from '../../../icons/IconChatbot'
import { IconChecked } from '../../../icons/IconChcked'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconCode } from '../../../icons/IconCode'
import { IconFileDiff } from '../../../icons/IconFileDiff'
import { IconGear } from '../../../icons/IconGear'
import { IconList } from '../../../icons/IconList'
import { IconNodes } from '../../../icons/IconNodes'
import { IconSigma } from '../../../icons/IconSigma'
import { IconStamp } from '../../../icons/IconStamp'
import { IconTerminal } from '../../../icons/IconTerminal'
import { IconWebApp } from '../../../icons/IconWebApp'
import { AnalyzePanel } from '../panel-analyze/AnalyzePanel'
import { CodePanel } from '../panel-code/CodePanel'
import { ConfigPanel } from '../panel-config/ConfigPanel'
import { DiffHistoryPanel } from '../panel-diff-history/DiffHistoryPanel'
import { ListPanel } from '../panel-list/ListPanel'
import { NodesPanel } from '../panel-nodes/NodesPanel'
import { PreviewPanel } from '../panel-preview/PreviewPanel'
import { TemplatePanel } from '../panel-template/TemplatePanel'
import { TerminalPanel } from '../panel-terminal/TerminalPanel'
import { ValuesPanel } from '../panel-values/ValuesPanel'
import { TabExtras } from './TabExtras'

export const PANEL_IDS = [
  'list',
  'values',
  'nodes',
  'code',
  'preview',
  'analyze',
  'terminal',
  'template',
  'config',
  'diffHistory',
] as const

export type PanelId = (typeof PANEL_IDS)[number]

interface Panel {
  icon: FC<{ className?: string }>
  body: () => JSX.Element
}

const PANELS: Record<PanelId, Panel> = {
  list: { icon: IconList, body: ListPanel },
  values: { icon: IconSigma, body: ValuesPanel },
  nodes: { icon: IconNodes, body: NodesPanel },
  code: { icon: IconCode, body: CodePanel },
  preview: { icon: IconWebApp, body: PreviewPanel },
  analyze: { icon: IconChatbot, body: AnalyzePanel },
  terminal: { icon: IconTerminal, body: TerminalPanel },
  template: { icon: IconStamp, body: TemplatePanel },
  config: { icon: IconGear, body: ConfigPanel },
  diffHistory: { icon: IconFileDiff, body: DiffHistoryPanel },
}

export function isAllowedPanel(id: PanelId): boolean {
  return !(IS_READONLY && (id === 'terminal' || id === 'analyze'))
}

function isPanelId(key: string): key is PanelId {
  return (PANEL_IDS as readonly string[]).includes(key)
}

function PanelLabel(props: { id: PanelId }) {
  const Icon = PANELS[props.id].icon
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-3.5 shrink-0" />
      <span>{props.id}</span>
    </span>
  )
}

// The header content discovery plugs into docking's generic frame: a panel-type
// switcher plus the per-panel extras. It reaches the layout store through the
// generic context hook, so config.tsx never imports the concrete store.
function PanelHeader(props: { api: LeafApi }) {
  const useStore = useDockingHook()
  const setLeafKey = useStore((state) => state.setLeafKey)
  const id = props.api.key as PanelId

  return (
    <>
      <RadixSelect.Root
        value={id}
        onValueChange={(value) => setLeafKey(id, value)}
      >
        <RadixSelect.Trigger
          aria-label="Panel"
          className={clsx(
            'group/sel inline-flex h-[26px] items-center gap-1.5 border-b px-3 font-bold text-xs uppercase outline-none transition-colors focus-visible:outline-none',
            props.api.isActive
              ? 'border-coffee-200 text-coffee-100'
              : 'border-transparent text-coffee-200 hover:text-coffee-100',
          )}
        >
          <PanelLabel id={id} />
          <IconChevronDown className="ml-auto size-3 opacity-60 transition-transform group-data-[state=open]/sel:rotate-180" />
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-[1000] cursor-default select-none border border-coffee-500 bg-coffee-800 font-bold text-coffee-200 text-xs uppercase shadow-lg"
          >
            <RadixSelect.Viewport>
              {PANEL_IDS.filter(isAllowedPanel).map((panelId) => (
                <RadixSelect.Item
                  key={panelId}
                  value={panelId}
                  className="relative flex cursor-pointer items-center gap-2.5 py-2 pr-9 pl-2.5 outline-none focus-visible:outline-none data-[highlighted]:bg-coffee-600 data-[highlighted]:text-coffee-100"
                >
                  <PanelLabel id={panelId} />
                  <RadixSelect.ItemIndicator className="absolute right-2.5">
                    <IconChecked className="size-3" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      <div className="flex-1" />
      <TabExtras id={id} />
    </>
  )
}

function renderBody(key: string): JSX.Element {
  if (!isPanelId(key)) return <ListPanel />
  const Component = PANELS[key].body
  return <Component />
}

const defaultLayout = newSplit(
  'row',
  [newLeaf('list'), newLeaf('values'), newLeaf('nodes')],
  [0.5, 1, 1],
)

export const dockingConfig: DockingConfig = {
  storageKey: 'docking/v2:discovery',
  defaultLayout,
  maxLayouts: 6,
  // Disallowed panels (terminal in readonly) are rejected here, so persisted
  // layouts self-heal and ensureLeaf/setLeafKey cannot resurrect them.
  isValidKey: (key) => isPanelId(key) && isAllowedPanel(key),
  renderHeader: (api) => <PanelHeader api={api} />,
  renderBody,
  renderDragPreview: (key) => (isPanelId(key) ? <PanelLabel id={key} /> : key),
}
