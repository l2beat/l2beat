import {
  Hash256,
  json,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import React from 'react'

import { LivenessConfigurationIdentifier } from '../../../../core/liveness/types/LivenessConfigurationIdentifier'
import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

export interface LivenessStatusPageProps {
  indexerId?: string
  configHash?: Hash256
  safeHeight?: number
  minTimestamp?: UnixTime
  targetTimestamp: UnixTime
  configurations: {
    params: json
    id: number
    projectId: ProjectId
    type: LivenessType
    identifier: LivenessConfigurationIdentifier
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
    lastSyncedTimestamp?: UnixTime
  }[]
}

export function LivenessStatusPage(props: LivenessStatusPageProps) {
  const configurations = props.configurations.sort((a, b) => {
    if (a.projectId.toString() < b.projectId.toString()) {
      return -1
    }
    if (a.projectId.toString() > b.projectId.toString()) {
      return 1
    }
    return 0
  })
  return (
    <Page title="Liveness module status">
      <div
        className={`card ${
          props.safeHeight === props.targetTimestamp.toNumber()
            ? 'hint'
            : 'warn'
        }`}
        style={{ width: '800px' }}
      >
        <p>Overview</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Current config hash:</p>
          <p style={{ fontWeight: 'normal' }}>{props.configHash}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Synced from:</p>
          {props.minTimestamp && (
            <p style={{ fontWeight: 'normal' }}>
              {new Date(Number(props.minTimestamp) * 1000).toLocaleString(
                'en-GB',
                {
                  timeZone: 'UTC',
                },
              )}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Synced until:</p>
          {props.safeHeight && (
            <p style={{ fontWeight: 'normal' }}>
              {new Date(props.safeHeight * 1000).toLocaleString('en-GB', {
                timeZone: 'UTC',
              })}
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
      <div style={{ fontSize: '20px' }}>Configurations</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {configurations
          .filter((c) => !c.untilTimestamp)
          .map((c) =>
            getConfigCell(c, props.targetTimestamp, props.minTimestamp),
          )}
      </div>
      <div>With untilTimestamp</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {configurations
          .filter((c) => c.untilTimestamp)
          .map((c) =>
            getConfigCell(c, props.targetTimestamp, props.minTimestamp),
          )}
      </div>
    </Page>
  )
}

function getConfigCell(
  config: {
    params: json
    id: number
    projectId: ProjectId
    type: LivenessType
    identifier: LivenessConfigurationIdentifier
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime | undefined
    lastSyncedTimestamp?: UnixTime | undefined
  },
  targetTimestamp: UnixTime,
  minTimestamp: UnixTime | undefined,
) {
  const type =
    config.lastSyncedTimestamp?.toNumber() === targetTimestamp.toNumber()
      ? 'hint'
      : 'warn'

  return (
    <details className={`card ${type}`} style={{ maxWidth: '300px' }}>
      <summary>
        <p style={{ fontWeight: 'bold' }}>{config.projectId.toString()}</p>
        {` - ${config.type}`}
      </summary>
      <p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Since:</p>
          <p style={{ fontWeight: 'normal' }}>
            {new Date(Number(config.sinceTimestamp) * 1000).toLocaleString(
              'en-GB',
              {
                timeZone: 'UTC',
              },
            )}
          </p>
        </div>
        {config.untilTimestamp && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <p style={{ fontWeight: 'bold' }}>Until:</p>

            <p style={{ fontWeight: 'normal' }}>
              {new Date(Number(config.untilTimestamp) * 1000).toLocaleString(
                'en-GB',
                {
                  timeZone: 'UTC',
                },
              )}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>Last synced:</p>
          {minTimestamp && (
            <p style={{ fontWeight: 'normal' }}>
              {new Date(
                Number(config.lastSyncedTimestamp) * 1000,
              ).toLocaleString('en-GB', {
                timeZone: 'UTC',
              })}
            </p>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'scroll',
          }}
        >
          <p style={{ fontWeight: 'bold' }}>Params:</p>
          <p style={{ fontWeight: 'normal' }}>
            {JSON.stringify(config.params)}
          </p>
        </div>
      </p>
    </details>
  )
}

export function renderLivenessStatusPage(props: LivenessStatusPageProps) {
  return reactToHtml(<LivenessStatusPage {...props} />)
}
