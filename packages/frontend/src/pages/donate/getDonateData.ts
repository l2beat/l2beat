import { assert } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getEcosystemLogo } from '~/server/features/ecosystems/getEcosystemLogo'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { type Manifest, manifest } from '~/utils/Manifest'

export async function getDonateData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Donate - L2BEAT',
        openGraph: {
          url,
          image: '/meta-images/donate/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DonatePage',
      props: {
        ...appLayoutProps,
        partners: await getPartners(),
        gitcoinOption: false,
        qrCodeUrl: manifest.getUrl('/images/qr-codes/donate.png'),
      },
    },
  }
}

export type Partners = Awaited<ReturnType<typeof getPartners>>

async function getPartners() {
  const projects = await ps.getProjects({})
  const ecosystems = await ps.getProjects({
    select: ['ecosystemConfig', 'colors'],
  })
  const partners = getCollection('partners')

  const ecosystemPartners = partners
    .filter((e) => e.data.tier === 'ecosystem')
    .map((e) => {
      const project = ecosystems.find((p) => p.slug === e.data.slug)
      assert(project, `Project not found for partner ${e.data.slug}`)
      return {
        ...e.data,
        project,
        ecosystemLogo: getEcosystemLogo(e.data.slug),
        mainPartnerLogo: manifest.getImage(
          `/ecosystems/${e.data.slug}/main-partner.png`,
        ),
      }
    })

  const innovatorPartners = partners
    .filter((e) => e.data.tier === 'innovator')
    .map((e) => {
      const project = projects.find((p) => p.slug === e.data.slug)
      assert(project, `Project not found for partner ${e.data.slug}`)

      return {
        ...e.data,
        project,
      }
    })

  const supporterPartners = partners
    .filter((e) => e.data.tier === 'supporter')
    .map((e) => {
      const project = projects.find((p) => p.slug === e.data.slug)
      assert(project, `Project not found for partner ${e.data.slug}`)

      return {
        ...e.data,
        project,
      }
    })

  return {
    ecosystem: ecosystemPartners,
    innovator: innovatorPartners,
    supporter: supporterPartners,
  }
}
