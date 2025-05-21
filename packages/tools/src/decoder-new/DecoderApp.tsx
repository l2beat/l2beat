import type { DecodedResult } from '@l2beat/tools-api/types'
import { useState } from 'react'
import { DecodedView } from './View'
import { Form } from './form/Form'

export function DecoderApp() {
  const [decoded, setDecoded] = useState<DecodedResult | undefined>()
  if (decoded) {
    return (
      <DecodedView decoded={decoded} onBack={() => setDecoded(undefined)} />
    )
  }
  return <Form onDataDecoded={setDecoded} />
}
