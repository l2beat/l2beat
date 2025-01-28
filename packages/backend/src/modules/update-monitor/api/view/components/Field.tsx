import { default as React } from 'react'

import type {
  DashboardContractField,
  DashboardContractFieldValue,
} from '../../props/utils/getValues'
import { Value } from './Value'

interface FieldProps {
  field: DashboardContractField
  color: string
}

export function Field(props: FieldProps) {
  if (!props.field.values || props.field.values.length < 2) {
    const value: DashboardContractFieldValue | undefined = props.field.values
      ? props.field.values.length === 0
        ? { value: '[ ]' }
        : props.field.values[0]
      : undefined

    if (props.field.description !== undefined) {
      return (
        <details
          style={{
            color: props.color,
            padding: '0px',
            marginTop: '2px',
            marginBottom: '2px',
          }}
          open
        >
          <summary style={{ color: 'inherit', boxShadow: 'none' }}>
            {props.field.name} {value && <Value value={value} />}
          </summary>
          <p style={{ margin: '0px' }}>
            {props.field.description && (
              <i style={{ color: '#939292', marginLeft: '16px' }}>
                {' '}
                {props.field.description}
              </i>
            )}
          </p>
        </details>
      )
    }

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
        {value && <Value value={value} />}
      </p>
    )
  }

  return (
    <details
      style={{
        color: props.color,
        padding: '0px',
        marginTop: '2px',
        marginBottom: '2px',
      }}
    >
      <summary style={{ color: 'inherit', boxShadow: 'none' }}>
        {props.field.name} ...
      </summary>
      <p style={{ margin: '0px' }}>
        {props.field.description && (
          <p>
            <i style={{ color: '#939292' }}> {props.field.description}</i>
          </p>
        )}
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
            <Value value={element} />
          </p>
        ))}
      </p>
    </details>
  )
}
