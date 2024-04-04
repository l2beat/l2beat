import React from 'react'

import { ConfigFeatures } from '../../build/config/Config'
import {
  getScalingNavigationPages,
  ScalingPage,
} from '../../utils/getNavigationPages'
import { NavigationTabs } from './NavigationTabs'

interface ScalingNavigationTabsProps {
  selected: ScalingPage
  features: ConfigFeatures
}

export function ScalingNavigationTabs(props: ScalingNavigationTabsProps) {
  const pages = getScalingNavigationPages(props.features, props.selected)

  return <NavigationTabs pages={pages} />
}
