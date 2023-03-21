import { default as React } from 'react'

import { DashboardContractField } from '../../props/getProjectContracts'
import { Value } from './Value'

export function Field({
  field,
  color,
}: {
  field: DashboardContractField
  color: string
}) {
  if (field.values === undefined) {
    return (
      <p
        style={{
          color,
          marginLeft: '8px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {field.name}
      </p>
    )
  }

  if (field.values.length === 0) {
    return (
      <p
        style={{
          color,
          marginLeft: '12px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {field.name}
        <Value value={'[ ]'} />
      </p>
    )
  }

  if (field.values.length === 1) {
    return (
      <p
        style={{
          color,
          marginLeft: '14px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {field.name}
        <Value
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          value={field.values[0].value.toString()}
          discoveryChild={field.values[0].discoveryChild}
        />
      </p>
    )
  }

  return (
    <details
      style={{ padding: '0px', marginTop: '2px', marginBottom: '2px', color }}
    >
      <summary style={{ color: 'inherit', boxShadow: 'none' }}>
        {field.name}
      </summary>
      <p style={{ margin: '0px' }}>
        {field.values.map((element, index) => (
          <p
            key={index}
            style={{
              marginLeft: '16px',
              color: '#939292',
              marginTop: '2px',
              marginBottom: '2px',
            }}
          >
            <Value
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              value={element.value.toString()}
              discoveryChild={element.discoveryChild}
            />
          </p>
        ))}
      </p>
    </details>
  )
}
