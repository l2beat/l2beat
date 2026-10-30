import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { HomeOpengraphImage } from '~/components/opengraph-image/Home'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import type { MainPage } from '~/components/opengraph-image/MainPage'
import { MainPageOpengraphImage } from '~/components/opengraph-image/MainPage'

// Labels name the page's section, and only when the title doesn't already.
const mainPages: MainPage[] = [
  { path: 'tokens', title: 'Tokens' },
  { path: 'ossification', title: 'Ossification' },
  { path: 'layer2s/summary', title: 'Layer 2s' },
  { path: 'layer2s/risks/overview', label: 'Layer 2s', title: 'Risk analysis' },
  {
    path: 'layer2s/risks/data-availability',
    label: 'Layer 2s',
    title: 'Data availability',
  },
  {
    path: 'layer2s/risks/state-validation',
    label: 'Layer 2s',
    title: 'State validation',
  },
  { path: 'layer2s/risks/sequencing', label: 'Layer 2s', title: 'Sequencing' },
  { path: 'layer2s/value-secured', label: 'Layer 2s', title: 'Value secured' },
  { path: 'layer2s/activity', label: 'Layer 2s', title: 'Activity' },
  { path: 'layer2s/liveness', label: 'Layer 2s', title: 'Liveness' },
  { path: 'layer2s/costs', label: 'Layer 2s', title: 'Costs' },
  { path: 'layer2s/compare', label: 'Layer 2s', title: 'Compare' },
  { path: 'layer2s/upcoming', label: 'Layer 2s', title: 'Upcoming' },
  { path: 'layer2s/archived', label: 'Layer 2s', title: 'Archived' },
  { path: 'interop/summary', title: 'Interoperability' },
  { path: 'interop/non-minting', label: 'Interop', title: 'Non-minting' },
  { path: 'interop/lock-&-mint', label: 'Interop', title: 'Lock & mint' },
  { path: 'interop/burn-&-mint', label: 'Interop', title: 'Burn & mint' },
  {
    path: 'interop/token-frameworks',
    label: 'Interop',
    title: 'Token frameworks',
  },
  { path: 'interop/intent-bridges', label: 'Interop', title: 'Intent bridges' },
  { path: 'privacy/summary', title: 'Privacy protocols' },
  { path: 'defi/summary', title: 'DeFi protocols' },
  { path: 'zk-catalog', label: 'Proof systems', title: 'ZK catalog' },
  { path: 'stages', title: 'Stages' },
  { path: 'governance', title: 'Governance' },
  {
    path: 'governance/ethereum-connect',
    label: 'Governance',
    title: 'Ethereum Connect',
  },
  { path: 'publications', title: 'Publications' },
  { path: 'glossary', title: 'Glossary' },
  { path: 'about-us', title: 'About us' },
  { path: 'mandate', title: 'Our mandate' },
  { path: 'changelog', title: 'Changelog' },
  { path: 'donate', title: 'Donate' },
  { path: 'faq', title: 'FAQ' },
  { path: 'terms-of-service', title: 'Terms of service' },
  { path: 'brand-kit', title: 'Brand kit' },
  { path: 'multisig-report', title: 'Multisig report' },
  { path: 'icon-preview', title: 'Icon preview' },
  { path: 'native-rollups', title: 'Native rollups' },
  { path: 'blobs', title: 'Blobs' },
  { path: 'the-crops-guide', title: 'The CROPS guide' },
  {
    path: 'submit-your-protocol',
    label: 'For projects',
    title: 'Submit your protocol',
  },
  { path: 'l2beat-is-now-ethbeat', title: 'L2BEAT is now ETHBEAT' },
]

export async function generateMainPageOgImages(kit: OpengraphKit) {
  await writeIfMissing('home', 'Home', () =>
    renderOpengraphPng(<HomeOpengraphImage measure={kit.measure} />, kit),
  )
  for (const page of mainPages) {
    await writeIfMissing(page.path, page.title, () =>
      renderOpengraphPng(
        <MainPageOpengraphImage
          measure={kit.measure}
          label={page.label}
          title={page.title}
        />,
        kit,
      ),
    )
  }
}

async function writeIfMissing(
  pagePath: string,
  name: string,
  render: () => Promise<Buffer>,
) {
  const outputDir = path.join(process.cwd(), 'static/meta-images', pagePath)
  const outputFile = path.join(outputDir, 'opengraph-image.png')
  if (existsSync(outputFile)) {
    return
  }
  console.time(`[MAIN PAGE] ${name}`)
  const pngBuffer = await render()
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, pngBuffer)
  console.timeEnd(`[MAIN PAGE] ${name}`)
}
