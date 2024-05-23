import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { api } from '~/trpc/server'
import { HelloClient } from './_components/hello-client'

export const metadata: Metadata = {
  robots: {
    index: false,
  },
}

export default async function Page() {
  const t = await getTranslations('Example')
  const result = await api.example.hello({ text: t('serverComponent') })

  return (
    <main className="flex flex-col h-screen items-center justify-center text-xl">
      <div>{result.greeting}</div>
      <HelloClient text={t('clientComponent')} />
    </main>
  )
}
