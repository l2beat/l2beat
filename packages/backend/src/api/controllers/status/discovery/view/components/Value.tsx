import { default as React } from 'react'

import { DashboardContractFieldValue } from '../../props/utils/getValues'

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
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
          }').click()"> ${props.value.value.toString()} ⬇️</span>`,
        }}
      />
    )
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    <span style={{ color: '#939292' }}> {props.value.value.toString()}</span>
  )
}
