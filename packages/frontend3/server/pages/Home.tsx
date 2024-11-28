import { Page } from '../components/Page'

export function HomePage() {
  return (
    <Page title="Home - Demo">
      <h1 className="text-red-600">Hello world!</h1>
      <a className="text-blue-500 underline" href="/duck">
        Link to duck
      </a>
    </Page>
  )
}
