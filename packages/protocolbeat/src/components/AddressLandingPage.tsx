import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Title } from './Title'

export function AddressLandingPage(props: {
  title: string
  heading: ReactNode
  description: string
  submitLabel: string
  alternative: { to: string; label: string }
  onSubmit: () => void
  children: ReactNode
}) {
  function submit(e: FormEvent) {
    e.preventDefault()
    props.onSubmit()
  }

  return (
    <>
      <Title title={props.title} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-coffee-900 px-4 py-12 text-coffee-200">
        <div className="flex w-full max-w-xl flex-col gap-8">
          <header className="flex flex-col items-center gap-3 text-center">
            <h1>{props.heading}</h1>
            <p className="text-coffee-400 text-sm">{props.description}</p>
          </header>

          <form
            noValidate
            onSubmit={submit}
            className="flex flex-col gap-5 border border-coffee-600 bg-coffee-800 p-5"
          >
            {props.children}
            <button
              type="submit"
              className="bg-autumn-300 px-4 py-2 font-semibold text-coffee-900 text-sm transition-colors hover:bg-autumn-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee-200"
            >
              {props.submitLabel}
            </button>
          </form>

          <Link
            to={props.alternative.to}
            className="self-center text-coffee-400 text-sm transition-colors hover:text-coffee-200"
          >
            {props.alternative.label} →
          </Link>
        </div>
      </main>
    </>
  )
}
