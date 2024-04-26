import compact from 'lodash/compact'
import { ReactElement } from 'react'

import { ConfigFeatures } from '../build/config/Config'
import {
  ActivityIcon,
  RiskIcon,
  SummaryIcon,
  TvlIcon,
} from '../components/icons'
import { CostsIcon } from '../components/icons/pages/CostsIcon'
import { DataAvailabilityIcon } from '../components/icons/pages/DataAvailabilityIcon'
import { FinalityIcon } from '../components/icons/pages/FinalityIcon'
import { LivenessIcon } from '../components/icons/pages/LivenessIcon'

export interface NavigationPage {
  fullTitle: string
  shortTitle?: string
  icon: (props: { className?: string }) => ReactElement
  link: string
  selected?: boolean
  new?: boolean
}

export type ScalingPage =
  | 'summary'
  | 'detailed'
  | 'risk'
  | 'activity'
  | 'liveness'
  | 'finality'
  | 'data-availability'
  | 'costs'

export function getScalingNavigationPages(
  features: ConfigFeatures,
  selectedPage?: ScalingPage,
): NavigationPage[] {
  return compact([
    {
      fullTitle: 'Summary',
      shortTitle: 'Summary',
      icon: SummaryIcon,
      link: '/scaling/summary',
      selected: selectedPage === 'summary',
    },
    {
      fullTitle: 'Value Locked',
      shortTitle: 'Value',
      icon: TvlIcon,
      link: '/scaling/tvl',
      selected: selectedPage === 'detailed',
    },
    {
      fullTitle: 'Risk Analysis',
      shortTitle: 'Risks',
      icon: RiskIcon,
      link: '/scaling/risk',
      selected: selectedPage === 'risk',
    },
    {
      fullTitle: 'DA',
      shortTitle: 'DA',
      icon: DataAvailabilityIcon,
      link: '/scaling/data-availability',
      selected: selectedPage === 'data-availability',
    },
    features.liveness && {
      fullTitle: 'Liveness',
      shortTitle: 'Liveness',
      icon: LivenessIcon,
      link: '/scaling/liveness',
      selected: selectedPage === 'liveness',
    },
    features.finality && {
      fullTitle: 'Finality',
      shortTitle: 'Finality',
      icon: FinalityIcon,
      link: '/scaling/finality',
      selected: selectedPage === 'finality',
    },
    features.activity && {
      fullTitle: 'Activity',
      shortTitle: 'Activity',
      icon: ActivityIcon,
      link: '/scaling/activity',
      selected: selectedPage === 'activity',
    },
    features.costsPage && {
      fullTitle: 'Costs',
      shortTitle: 'Costs',
      icon: CostsIcon,
      link: '/scaling/costs',
      selected: selectedPage === 'costs',
      new: true,
    },
  ])
}

export type BridgesPage = 'summary' | 'risk'

export function getBridgesNavigationPages(
  selectedPage: BridgesPage,
): NavigationPage[] {
  return [
    {
      fullTitle: 'Summary',
      shortTitle: 'Summary',
      icon: SummaryIcon,
      link: '/bridges/summary',
      selected: selectedPage === 'summary',
    },
    {
      icon: RiskIcon,
      fullTitle: 'Risk Analysis',
      shortTitle: 'Risks',
      link: '/bridges/risk',
      selected: selectedPage === 'risk',
    },
  ]
}
