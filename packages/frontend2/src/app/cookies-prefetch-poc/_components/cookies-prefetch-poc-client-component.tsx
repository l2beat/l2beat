'use client'

import { useState } from 'react'
import { api } from '~/trpc/react'

export function CookiesPrefetchPocClientComponent({
  initialText,
}: { initialText: string }) {
  const [text, setText] = useState<string>(initialText)
  const { data, isPending } = api.cookiesPrefetchPoC.useQuery({ text })
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <pre>{JSON.stringify({ data, isPending })}</pre>
    </div>
  )
}
