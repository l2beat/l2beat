import { isObject } from 'lodash'
import { default as React } from 'react'

import type { DashboardContractFieldValue } from '../../props/utils/getValues'
import { DASHBOARD_COLORS } from '../constants'

interface ValueProps {
  value?: DashboardContractFieldValue
}

export function Value(props: ValueProps) {
  if (props.value === undefined) {
    return null
  }

  if (props.value.discoveryChild) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: `<span style="cursor:pointer; color: #85C1E9" onclick="document.getElementById('${
            props.value.discoveryChild
          }').click()"> ${renderValue(props.value)} ⬇️</span>`,
        }}
      />
    )
  }

  return (
    <span style={{ color: DASHBOARD_COLORS.VALUE }}>
      {' '}
      {renderValue(props.value)}
    </span>
  )
}

function renderValue({ value }: DashboardContractFieldValue) {
  if (value === null) {
    return 'null'
  }
  return isObject(value) ? JSON.stringify(value) : value.toString()
}
