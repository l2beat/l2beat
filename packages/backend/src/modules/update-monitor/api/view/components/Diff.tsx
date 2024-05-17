import { FieldDiff } from '@l2beat/discovery'
import { DiscoveryContractField } from '@l2beat/discovery/dist/discovery/config/RawDiscoveryConfig'
import { default as React } from 'react'

interface DiffProps {
  diff: FieldDiff
  field: DiscoveryContractField | undefined
}

export function Diff(props: DiffProps) {
  const grayedOutStyle = { opacity: 0.5 }

  return (
    <p>
      <div style={{ lineHeight: '1.35' }}>
        {props.diff.key} <br />
        <div style={grayedOutStyle}>
          {props.field?.type ? (
            <>
              {`+++ type: ${props.field.type.toString()}`} <br />
            </>
          ) : null}
          {props.field?.severity ? (
            <>
              {`+++ severity: ${props.field.severity}`} <br />
            </>
          ) : null}
          {props.field?.description ? (
            <>
              {`+++ description: ${props.field.description}`} <br />
            </>
          ) : null}
        </div>
        {props.diff.before && (
          <span style={{ background: '#67060c', color: '#d1b9b3' }}>
            - {props.diff.before}
            <br />
          </span>
        )}
        {props.diff.after && (
          <span style={{ background: '#033a16', color: '#87e29a' }}>
            + {props.diff.after}
            <br />
          </span>
        )}
      </div>
    </p>
  )
}
