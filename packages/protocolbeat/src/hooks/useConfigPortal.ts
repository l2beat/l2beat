import { ConfigEditor } from '@l2beat/discovery/schemas'
import { useState } from 'react'

export function useConfigPortal() {
  const e = ConfigEditor.fromRawJsonc('')
  useState<ConfigEditor>(e)
}
