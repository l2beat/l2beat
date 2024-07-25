'use client'

import { useCallback, useState } from 'react'
import { api } from '~/trpc/react'

export function CookiesPrefetchPocClientComponent({
  initialText,
}: { initialText: string }) {
  const [text, _setText] = useState<string>(initialText)
  const { data, isPending } = api.cookiesPrefetchPoC.useQuery({ text })
  const setText = useCallback(
    (newText: string) => {
      _setText(newText)
      document.cookie = `cookies-prefetch-poc-text=${newText}; max-age=3600;`
    },
    [_setText],
  )
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <pre>{JSON.stringify({ data, isPending })}</pre>
    </div>
  )
}
