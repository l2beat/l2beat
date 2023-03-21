import { default as React } from 'react'

interface ValueProps {
  value: string
  discoveryChild?: string
}

export function Value(props: ValueProps) {
  if (props.discoveryChild) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: `<span style="cursor:pointer; color: #85C1E9" onclick="document.getElementById('${props.discoveryChild}').click()"> ${props.value} ⬇️</span>`,
        }}
      />
    )
  }
  return <span style={{ color: '#939292' }}> {props.value}</span>
}
