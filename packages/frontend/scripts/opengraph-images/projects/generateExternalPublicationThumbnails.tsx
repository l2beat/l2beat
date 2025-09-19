import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { getCollection } from '~/content/getCollection'

export async function generateExternalPublicationThumbnails() {
  const externalPublications = getCollection('external-publications')

  for (const publication of externalPublications) {
    const outputDir = path.join(
      process.cwd(),
      'static/meta-images/publications/',
    )
    const outputFile = path.join(outputDir, `/${publication.id}.png`)

    if (existsSync(outputFile)) {
      continue
    }

    if (publication.data.url.includes('medium')) {
      console.time(`[EXTERNAL PUBLICATION] ${publication.id}`)

      const ogImageUrl = await getMediumThumbnailUrl(
        publication.id,
        publication.data.url,
      )
      if (!ogImageUrl) continue

      const thumbnailBuffer = await getImageFromUrl(publication.id, ogImageUrl)
      if (!thumbnailBuffer) continue

      mkdirSync(outputDir, {
        recursive: true,
      })

      writeFileSync(outputFile, thumbnailBuffer)
      console.timeEnd(`[EXTERNAL PUBLICATION] ${publication.id}`)
      continue
    }

    if (publication.data.url.includes('youtube')) {
      console.time(`[EXTERNAL PUBLICATION] ${publication.id}`)

      const ytUrl = new URL(publication.data.url)
      const videoId = ytUrl.searchParams.get('v')

      if (!videoId) {
        console.log(
          `[EXTERNAL PUBLICATION] Could not extract video ID from: ${publication.data.url}`,
        )
        continue
      }
      const thumbnailBuffer = await getImageFromUrl(
        publication.id,
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      )
      if (!thumbnailBuffer) continue

      mkdirSync(outputDir, {
        recursive: true,
      })

      writeFileSync(outputFile, thumbnailBuffer)
      console.timeEnd(`[EXTERNAL PUBLICATION] ${publication.id}`)
      continue
    }

    console.log(
      `[EXTERNAL PUBLICATION] Skipping non-YouTube URL: ${publication.data.url}`,
    )
    continue
  }
}

async function getImageFromUrl(
  publicationId: string,
  url: string,
): Promise<Buffer | undefined> {
  try {
    const imgResponse = await fetch(url)
    const buffer = await imgResponse.arrayBuffer()
    return Buffer.from(buffer)
  } catch (error) {
    console.error(
      `[EXTERNAL PUBLICATION] Failed to fetch thumbnail for ${publicationId}:`,
      error,
    )
    return undefined
  }
}

async function getMediumThumbnailUrl(
  publicationId: string,
  articleUrl: string,
): Promise<string | undefined> {
  try {
    const response = await fetch(articleUrl)
    const html = await response.text()
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
    )
    return ogImageMatch?.[1]
  } catch (error) {
    console.error(
      `[EXTERNAL PUBLICATION] Failed to fetch thumbnail url for ${publicationId}:`,
      error,
    )
    return undefined
  }
}
