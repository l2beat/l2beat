'use client'

import { api } from '~/trpc/react'

export function HelloClient({ text }: { text: string }) {
  const { data } = api.example.hello.useQuery({ text })
  return <div>{data?.greeting ?? 'Loading...'}</div>
}
