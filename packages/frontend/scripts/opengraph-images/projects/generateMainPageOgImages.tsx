import { HomeOpengraphImage } from '~/components/opengraph-image/Home'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import type { MainPage } from '~/components/opengraph-image/MainPage'
import { MainPageOpengraphImage } from '~/components/opengraph-image/MainPage'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
import { DEFI_SUMMARY_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import { writeIfMissing } from './writeIfMissing'

// Labels name the page's section, and only when the title doesn't already.
// Descriptions say what a page offers when its title alone doesn't, in at most
// three lines (the test checks); most are the page's meta description, cut
// to fit.
export const mainPages: MainPage[] = [
  {
    path: 'tokens',
    title: 'Tokens',
    description:
      'How every token exists across chains: which deployments another backs, and which burn and mint.',
  },
  {
    path: 'ossification',
    title: 'Ossification',
    description:
      'How long each project’s critical contracts have gone unchanged, and the value they secured meanwhile.',
  },
  {
    path: 'layer2s/summary',
    title: 'Layer 2s',
    description:
      'The risks, stages and value secured of every Layer 2 on Ethereum.',
  },
  {
    path: 'layer2s/risks/overview',
    label: 'Layer 2s',
    title: 'Risk analysis',
    description:
      'Understand the risks of Ethereum scaling solutions using ETHBEAT’s assessments.',
  },
  {
    path: 'layer2s/risks/data-availability',
    label: 'Layer 2s',
    title: 'Data availability',
    description:
      'Compare data availability solutions used by Ethereum scaling projects.',
  },
  {
    path: 'layer2s/risks/state-validation',
    label: 'Layer 2s',
    title: 'State validation',
    description:
      'How each Layer 2 proves to Ethereum that its state is correct, and the risks of each way.',
  },
  {
    path: 'layer2s/risks/sequencing',
    label: 'Layer 2s',
    title: 'Sequencing',
    description:
      'Compare decentralized sequencer sets with centralized sequencers and their forced inclusion.',
  },
  {
    path: 'layer2s/value-secured',
    label: 'Layer 2s',
    title: 'Value secured',
    description: 'Track total value secured across Ethereum scaling solutions.',
  },
  {
    path: 'layer2s/activity',
    label: 'Layer 2s',
    title: 'Activity',
    description:
      'Track activity across Ethereum scaling projects with interactive charts.',
  },
  {
    path: 'layer2s/liveness',
    label: 'Layer 2s',
    title: 'Liveness',
    description:
      'Monitor liveness metrics of Ethereum scaling projects and recent anomalies.',
  },
  {
    path: 'layer2s/costs',
    label: 'Layer 2s',
    title: 'Costs',
    description: 'Compare transaction costs across Ethereum scaling solutions.',
  },
  {
    path: 'layer2s/compare',
    label: 'Layer 2s',
    title: 'Compare',
    description:
      'Compare Ethereum scaling projects across metrics like value secured and activity, on one or more charts.',
  },
  { path: 'layer2s/upcoming', label: 'Layer 2s', title: 'Upcoming' },
  { path: 'layer2s/archived', label: 'Layer 2s', title: 'Archived' },
  {
    path: 'interop/summary',
    title: 'Interoperability',
    description:
      'Compare interoperability protocols across the Ethereum ecosystem.',
  },
  { path: 'interop/non-minting', label: 'Interop', title: 'Non-minting' },
  { path: 'interop/lock-&-mint', label: 'Interop', title: 'Lock & mint' },
  { path: 'interop/burn-&-mint', label: 'Interop', title: 'Burn & mint' },
  {
    path: 'interop/token-frameworks',
    label: 'Interop',
    title: 'Token frameworks',
  },
  { path: 'interop/intent-bridges', label: 'Interop', title: 'Intent bridges' },
  {
    path: 'privacy/summary',
    title: 'Privacy protocols',
    description:
      'Privacy protocols on Ethereum, rated by what they hide from each adversary.',
  },
  {
    path: 'defi/summary',
    title: 'DeFi protocols',
    description: DEFI_SUMMARY_DESCRIPTION,
  },
  {
    path: 'zk-catalog',
    label: 'Proof systems',
    title: 'ZK catalog',
    description:
      'Detailed insights into the ZK technology utilized by blockchain projects.',
  },
  {
    path: 'stages',
    title: 'Stages',
    description:
      'ETHBEAT’s Stages framework: the go-to system for assessing the maturity of rollups on Ethereum.',
  },
  {
    path: 'governance',
    title: 'Governance',
    description:
      'The latest insights, analyses and updates from the ETHBEAT Governance Team.',
  },
  {
    path: 'governance/ethereum-connect',
    label: 'Governance',
    title: 'Ethereum Connect',
    description:
      'A quick survey on what professionals in LATAM want to learn about crypto and Ethereum.',
  },
  {
    path: 'publications',
    title: 'Publications',
    description:
      'Research, explainers, essays and interviews: everything ETHBEAT publishes.',
  },
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
  {
    path: 'native-rollups',
    title: 'Native rollups',
    description:
      'Native rollups let Ethereum verify L2 blocks with its own EVM program.',
  },
  {
    path: 'blobs',
    title: 'Blobs',
    description:
      'See how much data projects post to Ethereum blobs, against the blob target, and the value they secure.',
  },
  { path: RENAME_ANNOUNCEMENT_PATH.slice(1), title: 'L2BEAT is now ETHBEAT' },
  // The CROPS guide's pages (the-crops-guide, submit-your-protocol,
  // integrate-crops) have hand-made images in the guide's own style, so they
  // aren't generated here.
]

export async function generateMainPageOgImages(kit: OpengraphKit) {
  await writeIfMissing('MAIN PAGE', 'home', 'Home', () =>
    renderOpengraphPng(<HomeOpengraphImage measure={kit.measure} />, kit),
  )
  for (const page of mainPages) {
    await writeIfMissing('MAIN PAGE', page.path, page.title, () =>
      renderOpengraphPng(
        <MainPageOpengraphImage
          measure={kit.measure}
          label={page.label}
          title={page.title}
          description={page.description}
        />,
        kit,
      ),
    )
  }
}
