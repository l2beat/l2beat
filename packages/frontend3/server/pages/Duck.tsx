import { Page } from '../Page'
import { asset } from '../assets'

export function DuckPage() {
  return (
    <Page title="Demo">
      <img src={asset('img/duck.png')} />
      <h1 className="text-red-600">A nice duck</h1>
      <a className="text-blue-500 underline" href="/">
        Back home
      </a>
    </Page>
  )
}
