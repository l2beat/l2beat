'use client'

import { api } from '~/trpc/react'

export function HelloClient() {
  const { data } = api.example.hello.useQuery({ text: 'Client Component!' })
  return <div>{data?.greeting ?? 'Loading...'}</div>
}
