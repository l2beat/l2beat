import { Metadata } from 'next'
import { api } from '~/trpc/server'
import { HelloClient } from './_components/hello-client'

export const metadata: Metadata = {
  robots: {
    index: false,
  },
}

export default async function Home() {
  const result = await api.example.hello({ text: 'Server Component!' })
  return (
    <main className="flex flex-col h-screen items-center justify-center text-xl">
      <div>{result.greeting}</div>
      <HelloClient />
    </main>
  )
}
