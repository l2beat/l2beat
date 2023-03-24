import { default as React } from 'react'

export function ContractHref(props: { address: string; name: string }) {
  return (
    <p
      dangerouslySetInnerHTML={{
        __html: `<span style="cursor:pointer; color: #85C1E9; margin-left: 8px" onclick="document.getElementById('${props.address}').click()">⬆️ ${props.name}</span>`,
      }}
    />
  )
}
