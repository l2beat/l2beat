import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import type { Manifest } from '../../common/Manifest'
import type { RenderData, RenderFunction } from '../../ssr/server'

export function DonateRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/donate', async (_req, res) => {
    const data = await getDonateData(manifest)
    const html = render(data)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getDonateData(manifest: Manifest): Promise<RenderData> {
  const searchBarProjects = await getSearchBarProjects()

  return {
    head: {
      manifest,
      title: 'About us - L2BEAT',
      description:
        'About us - L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'DonatePage',
      props: {
        qrCodeUrl: manifest.getUrl('/static/images/qr-codes/donate.png'),
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects: searchBarProjects.map((p) => ({
          ...p,
          iconUrl: manifest.getUrl('/static' + p.iconUrl),
        })),
      },
    },
  }
}
