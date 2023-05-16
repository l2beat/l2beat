import { default as React } from 'react'

import { FieldDiff } from '../../../../../../core/discovery/output/diffContracts'

interface DiffProps {
  diff: FieldDiff
}

export function Diff(props: DiffProps) {
  return (
    <p>
      {props.diff.key} <br />
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
    </p>
  )
}
