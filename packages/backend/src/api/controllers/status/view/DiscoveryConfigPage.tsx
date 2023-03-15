import React from 'react'

import { DiscoveryConfig } from '../../../../core/discovery/DiscoveryConfig'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

interface DiscoveryConfigPageProps {
  project: string
  config: DiscoveryConfig
}

export function DiscoveryConfigPage(props: DiscoveryConfigPageProps) {
  return <Page title={props.project}>{JSON.stringify(props.config)}</Page>
}

export function renderDiscoveryConfigPage(props: DiscoveryConfigPageProps) {
  return reactToHtml(<DiscoveryConfigPage {...props} />)
}
