import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { IndexerStateRecord } from '../../../../peripherals/database/repositories/IndexerStateRepository'
import { LivenessConfigurationRecord } from '../../../liveness/repositories/LivenessConfigurationRepository'
import { LivenessId } from '../../../liveness/types/LivenessId'
import { LivenessConfigurationCard } from './components/LivenessConfigurationCard'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

export interface LivenessStatusPageProps {
  indexerState: IndexerStateRecord | undefined
  targetTimestamp: UnixTime
  configurations: LivenessConfigurationRecord[]
  unusedConfigurationsIds: LivenessId[]
}

export function LivenessStatusPage(props: LivenessStatusPageProps) {
  const { usedConfigurations, emptyConfigurations, archivedConfigurations } =
    categorizeAndSortConfigurations(props)

  return (
    <Page title="Liveness module status">
      <div
        className={`card ${
          props.indexerState?.safeHeight === props.targetTimestamp.toNumber()
            ? 'hint'
            : 'warn'
        }`}
        style={{ width: '800px' }}
      >
        <p>Overview</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Synced from:</p>
          {props.indexerState?.minTimestamp && (
            <p style={{ fontWeight: 'normal' }}>
              {new Date(
                Number(props.indexerState.minTimestamp) * 1000,
              ).toLocaleString('en-GB', {
                timeZone: 'UTC',
              })}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Synced until:</p>
          {props.indexerState?.safeHeight && (
            <p style={{ fontWeight: 'normal' }}>
              {new Date(props.indexerState.safeHeight * 1000).toLocaleString(
                'en-GB',
                {
                  timeZone: 'UTC',
                },
              )}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Target timestamp:</p>
          <p style={{ fontWeight: 'normal' }}>
            {props.targetTimestamp.toDate().toLocaleString('en-GB', {
              timeZone: 'UTC',
            })}
          </p>
        </div>
      </div>
      <div
        style={{ fontSize: '20px' }}
        data-tooltip="Configurations currently used to fetch liveness data"
      >
        Configurations
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {usedConfigurations.map((c, i) => (
          <LivenessConfigurationCard
            key={i}
            config={c}
            targetTimestamp={props.targetTimestamp}
            minTimestamp={props.indexerState?.minTimestamp}
          />
        ))}
      </div>

      <div
        style={{ fontSize: '20px' }}
        data-tooltip="Configurations which do not have any datapoint saved in liveness table. If a configuration is there, that should be an expected behavior. Right now we have 2 arbitrum DA configurations there, which serve as a backup for the situation when arbitrum decides to use other function to post DA."
      >
        Empty
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {emptyConfigurations.map((c, i) => (
          <LivenessConfigurationCard
            key={i}
            config={c}
            targetTimestamp={props.targetTimestamp}
            minTimestamp={props.indexerState?.minTimestamp}
          />
        ))}
      </div>

      <div
        style={{ fontSize: '20px' }}
        data-tooltip="Configurations that have 'untilTimestamp' param set, which means they are no longer being fetched. In most cases that is because of the project upgrade."
      >
        Archived
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {archivedConfigurations.map((c, i) => (
          <LivenessConfigurationCard
            key={i}
            config={c}
            targetTimestamp={props.targetTimestamp}
            minTimestamp={props.indexerState?.minTimestamp}
          />
        ))}
      </div>
    </Page>
  )
}

function categorizeAndSortConfigurations(props: LivenessStatusPageProps): {
  usedConfigurations: LivenessConfigurationRecord[]
  emptyConfigurations: LivenessConfigurationRecord[]
  archivedConfigurations: LivenessConfigurationRecord[]
} {
  const configurations = props.configurations.sort((a, b) => {
    if (a.projectId.toString() < b.projectId.toString()) {
      return -1
    }
    if (a.projectId.toString() > b.projectId.toString()) {
      return 1
    }
    return 0
  })
  const archivedConfigurations: LivenessConfigurationRecord[] = []
  const usedConfigurations: LivenessConfigurationRecord[] = []
  const emptyConfigurations: LivenessConfigurationRecord[] = []

  configurations.forEach((c) => {
    if (c.untilTimestamp) {
      archivedConfigurations.push(c)
    } else {
      if (props.unusedConfigurationsIds.includes(c.id)) {
        emptyConfigurations.push(c)
      } else {
        usedConfigurations.push(c)
      }
    }
  })
  return { usedConfigurations, emptyConfigurations, archivedConfigurations }
}

export function renderLivenessStatusPage(props: LivenessStatusPageProps) {
  return reactToHtml(<LivenessStatusPage {...props} />)
}
