import { default as React } from 'react'

export function Value(props: { value: string; discoveryChild?: string }) {
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
