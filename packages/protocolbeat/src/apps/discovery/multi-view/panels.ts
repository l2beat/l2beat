import type { FC } from 'react'
import { IS_READONLY } from '../../../config/readonly'
import { IconChatbot } from '../../../icons/IconChatbot'
import { IconCode } from '../../../icons/IconCode'
import { IconFileDiff } from '../../../icons/IconFileDiff'
import { IconGear } from '../../../icons/IconGear'
import { IconList } from '../../../icons/IconList'
import { IconNodes } from '../../../icons/IconNodes'
import { IconSigma } from '../../../icons/IconSigma'
import { IconStamp } from '../../../icons/IconStamp'
import { IconTerminal } from '../../../icons/IconTerminal'
import { IconWebApp } from '../../../icons/IconWebApp'
import { PANEL_IDS, type PanelId } from './store'

interface PanelDefinition {
  icon: FC<{ className?: string }>
  readonly: boolean
}

export const PANEL_DEFINITIONS: Record<PanelId, PanelDefinition> = {
  list: { icon: IconList, readonly: true },
  values: { icon: IconSigma, readonly: true },
  nodes: { icon: IconNodes, readonly: true },
  code: { icon: IconCode, readonly: true },
  preview: { icon: IconWebApp, readonly: true },
  analyze: { icon: IconChatbot, readonly: false },
  terminal: { icon: IconTerminal, readonly: false },
  template: { icon: IconStamp, readonly: true },
  config: { icon: IconGear, readonly: true },
  diffHistory: { icon: IconFileDiff, readonly: true },
}

export const AVAILABLE_PANEL_IDS: readonly PanelId[] = IS_READONLY
  ? PANEL_IDS.filter((id) => PANEL_DEFINITIONS[id].readonly)
  : PANEL_IDS
