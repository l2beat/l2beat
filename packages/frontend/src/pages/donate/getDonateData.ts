import { assert } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { env } from '~/env'
import { getEcosystemLogo } from '~/server/features/ecosystems/getEcosystemLogo'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { type Manifest, manifest } from '~/utils/Manifest'

export async function getDonateData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, partners] = await Promise.all([
    getAppLayoutProps(),
    getPartners(),
  ])

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
        partners: env.NEXT_PUBLIC_PARTNERS ? partners : undefined,
        gitcoinOption: false,
        qrCodeUrl: manifest.getUrl('/images/qr-codes/donate.png'),
      },
    },
  }
}

export type Partners = Awaited<ReturnType<typeof getPartners>>

async function getPartners() {
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
          `/partners/${e.data.slug}/main-partner.png`,
        ),
      }
    })

  const innovatorPartners = partners
    .map((e) => {
      if (e.data.tier !== 'innovator') {
        return
      }

      return {
        ...e.data,
        link: e.data.link ?? `/scaling/projects/${e.data.slug}`,
        logo: manifest.getImage(`/partners/${e.data.slug}/logo.png`),
        backgroundImage: manifest.getImage(
          `/partners/${e.data.slug}/background.png`,
        ),
      }
    })
    .filter((e) => e !== undefined)

  const supporterPartners = partners
    .map((e) => {
      if (e.data.tier !== 'supporter') {
        return
      }

      return {
        ...e.data,
        logo: manifest.getImage(`/icons/${e.data.slug}.png`),
        link: e.data.link ?? `/scaling/projects/${e.data.slug}`,
      }
    })
    .filter((e) => e !== undefined)

  return {
    ecosystem: ecosystemPartners,
    innovator: innovatorPartners,
    supporter: supporterPartners,
  }
}
