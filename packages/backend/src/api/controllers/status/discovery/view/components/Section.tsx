import { default as React } from 'react'

import { DashboardContractField } from '../../props/getDashboardProject'
import { Field } from './Field'

export function Section({
  title,
  color,
  fields,
}: {
  title: string
  color: string
  fields: DashboardContractField[]
}) {
  return (
    <details style={{ color }} open>
      <summary style={{ color: 'inherit' }}>{title}</summary>
      <p style={{ margin: '0px' }}>
        {fields.map((field, index) => (
          <Field field={field} color={color} key={index} />
        ))}
      </p>
    </details>
  )
}
