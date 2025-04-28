import type { DecodedResult } from '@l2beat/tools-api/types'
import { useState } from 'react'
import { Form } from './form/Form'

export function DecoderApp() {
  const [decoded, setDecoded] = useState<DecodedResult | undefined>()
  if (decoded) {
    return (
      <main className="mx-auto max-w-[800px] p-4 pb-20">
        <pre>
          <code>{JSON.stringify(decoded, null, 2)}</code>
        </pre>
      </main>
    )
  }
  return <Form onDataDecoded={setDecoded} />
}
