import { default as React } from 'react'

import type { DashboardContractField } from '../../props/utils/getValues'
import { Field } from './Field'

interface SectionProps {
  title: string
  color: string
  fields: DashboardContractField[]
}

export function Section(props: SectionProps) {
  return (
    <details style={{ color: props.color }} open>
      <summary style={{ color: 'inherit' }}>{props.title}</summary>
      <p style={{ margin: '0px' }}>
        {props.fields.map((field, index) => (
          <Field field={field} color={props.color} key={index} />
        ))}
      </p>
    </details>
  )
}
