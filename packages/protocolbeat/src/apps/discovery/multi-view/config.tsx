import type { FC, JSX } from 'react'
import {
  type DockingConfig,
  newLeaf,
  newSplit,
} from '../../../components/docking'
import { IS_READONLY } from '../../../config/readonly'
import { IconCode } from '../../../icons/IconCode'
import { IconFileDiff } from '../../../icons/IconFileDiff'
import { IconGear } from '../../../icons/IconGear'
import { IconList } from '../../../icons/IconList'
import { IconNodes } from '../../../icons/IconNodes'
import { IconSigma } from '../../../icons/IconSigma'
import { IconStamp } from '../../../icons/IconStamp'
import { IconTerminal } from '../../../icons/IconTerminal'
import { IconWebApp } from '../../../icons/IconWebApp'
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
  'terminal',
  'template',
  'config',
  'diffHistory',
] as const

export type PanelId = (typeof PANEL_IDS)[number]

const ICONS: Record<PanelId, FC<{ className?: string }>> = {
  list: IconList,
  values: IconSigma,
  nodes: IconNodes,
  code: IconCode,
  preview: IconWebApp,
  terminal: IconTerminal,
  template: IconStamp,
  config: IconGear,
  diffHistory: IconFileDiff,
}

const PANELS: Record<PanelId, () => JSX.Element> = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  code: CodePanel,
  preview: PreviewPanel,
  terminal: TerminalPanel,
  template: TemplatePanel,
  config: ConfigPanel,
  diffHistory: DiffHistoryPanel,
}

const READONLY_PANELS: Record<
  Exclude<PanelId, 'terminal'>,
  () => JSX.Element
> = {
  list: ListPanel,
  values: ValuesPanel,
  nodes: NodesPanel,
  preview: PreviewPanel,
  code: CodePanel,
  template: TemplatePanel,
  config: ConfigPanel,
  diffHistory: DiffHistoryPanel,
}

function renderBody(id: string): JSX.Element {
  const panelId = id as PanelId
  if (IS_READONLY) {
    const Component =
      panelId in READONLY_PANELS
        ? READONLY_PANELS[panelId as Exclude<PanelId, 'terminal'>]
        : ListPanel
    return <Component />
  }
  const Component = PANELS[panelId]
  return <Component />
}

function renderTabLabel(id: string): JSX.Element {
  const panelId = id as PanelId
  const Icon = ICONS[panelId]
  return (
    <>
      <Icon className="size-3.5 shrink-0" />
      <span>{panelId}</span>
    </>
  )
}

function renderTabExtras(props: { id: string }): JSX.Element {
  return <TabExtras id={props.id as PanelId} />
}

const defaultLayout = newSplit(
  'row',
  [newLeaf('list'), newLeaf('values'), newLeaf('nodes')],
  [0.5, 1, 1],
)

export const dockingConfig: DockingConfig = {
  storageKey: 'docking/v2:discovery',
  availableTabs: PANEL_IDS,
  filterTab: (id) => !(IS_READONLY && id === 'terminal'),
  defaultLayout,
  maxLayouts: 6,
  renderBody,
  renderTabLabel,
  renderTabExtras,
}
