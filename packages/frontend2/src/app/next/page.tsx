import { type Metadata } from 'next'
import { api } from '~/trpc/server'
import { DarkThemeToggle } from '../_components/dark-theme-toggle'
import { HelloClient } from './_components/hello-client'

export const metadata: Metadata = {
  robots: {
    index: false,
  },
}

export default async function Page() {
  const result = await api.example.hello({ text: 'server component' })

  return (
    <main className="flex flex-col h-screen items-center justify-center text-xl">
      <div>{result.greeting}</div>
      <HelloClient text={'client component'} />
      <DarkThemeToggle />
    </main>
  )
}
