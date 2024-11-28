import { Page } from '../components/Page'
import { asset } from '../assets'
import { ClientApp } from '../components/ClientApp'

export function DuckPage() {
  return (
    <Page title="Demo">
      <img src={asset('img/duck.png')} />
      <h1 className="text-red-600">A nice duck</h1>
      <a className="text-blue-500 underline" href="/">
        Back home
      </a>

      <ClientApp
        className="bg-red-500"
        type="counter"
        data={{ start: 34, increment: 7 }}
      />
      <ClientApp
        className="bg-blue-500"
        type="counter"
        data={{ start: 100, increment: -1 }}
      />
      <ClientApp
        className="bg-green-500"
        type="toggle"
        data={{ label: 'Do nothing?' }}
      />

      <button data-bit="expandable" className="text-blue-600">
        Show more
      </button>
      <div className="hidden">More!</div>
    </Page>
  )
}
