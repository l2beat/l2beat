import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { LivenessConfigurationRecord } from '../../../../liveness/repositories/LivenessConfigurationRepository'

interface LivenessConfigurationCardProps {
  config: LivenessConfigurationRecord
  targetTimestamp: UnixTime
  minTimestamp: UnixTime | undefined
}

export function LivenessConfigurationCard({
  config,
  targetTimestamp,
  minTimestamp,
}: LivenessConfigurationCardProps) {
  const target = config.untilTimestamp ?? targetTimestamp

  const type =
    config.lastSyncedTimestamp &&
    config.lastSyncedTimestamp.toNumber() >= target.toNumber()
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
          <p style={{ fontWeight: 'normal' }}>{config.debugInfo}</p>
        </div>
      </p>
    </details>
  )
}
