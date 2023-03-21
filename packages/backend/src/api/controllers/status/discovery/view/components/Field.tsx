import { default as React } from 'react'

import { DashboardContractField } from '../../props/getProjectContracts'
import { Value } from './Value'

interface FieldProps {
  field: DashboardContractField
  color: string
}

export function Field(props: FieldProps) {
  if (props.field.values === undefined) {
    return (
      <p
        style={{
          color: props.color,
          marginLeft: '8px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {props.field.name}
      </p>
    )
  }

  if (props.field.values.length === 0) {
    return (
      <p
        style={{
          color: props.color,
          marginLeft: '12px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {props.field.name}
        <Value value={'[ ]'} />
      </p>
    )
  }

  if (props.field.values.length === 1) {
    return (
      <p
        style={{
          color: props.color,
          marginLeft: '14px',
          marginTop: '2px',
          marginBottom: '2px',
        }}
      >
        {props.field.name}
        <Value
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          value={props.field.values[0].value.toString()}
          discoveryChild={props.field.values[0].discoveryChild}
        />
      </p>
    )
  }

  return (
    <details
      style={{
        padding: '0px',
        marginTop: '2px',
        marginBottom: '2px',
        color: props.color,
      }}
    >
      <summary style={{ color: 'inherit', boxShadow: 'none' }}>
        {props.field.name}
      </summary>
      <p style={{ margin: '0px' }}>
        {props.field.values.map((element, index) => (
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
