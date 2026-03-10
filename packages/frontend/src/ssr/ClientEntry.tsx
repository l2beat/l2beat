import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { getClientPage } from '../pages/clientPages'

async function main() {
  // biome-ignore lint/style/noNonNullAssertion: It's there
  const root = document.getElementById('root')!
  const ssrData = window.__SSR_DATA__
  const Page = await getClientPage(ssrData.page)

  hydrateRoot(
    root,
    <StrictMode>
      <Page {...ssrData.props} />
    </StrictMode>,
  )
}

void main()
