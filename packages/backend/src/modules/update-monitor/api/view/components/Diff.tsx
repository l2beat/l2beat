import { FieldDiff, ValueMeta } from '@l2beat/discovery'
import { default as React } from 'react'

interface DiffProps {
  diff: FieldDiff
  valueMeta: ValueMeta | undefined
}

export function Diff(props: DiffProps) {
  const grayedOutStyle = { opacity: 0.5 }

  return (
    <p>
      <div style={{ lineHeight: '1.35' }}>
        {props.diff.key} <br />
        <div style={grayedOutStyle}>
          {props.valueMeta?.type ? (
            <>
              {`+++ type: ${props.valueMeta.type.toString()}`} <br />
            </>
          ) : null}
          {props.valueMeta?.severity ? (
            <>
              {`+++ severity: ${props.valueMeta.severity}`} <br />
            </>
          ) : null}
          {props.valueMeta?.description ? (
            <>
              {`+++ description: ${props.valueMeta.description}`} <br />
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
