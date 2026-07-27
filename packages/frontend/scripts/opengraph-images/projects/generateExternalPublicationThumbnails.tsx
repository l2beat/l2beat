import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { getCollection } from '~/content/getCollection'
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '~/utils/youtube'

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

    const videoId = getYouTubeVideoId(publication.data.url)
    if (videoId) {
      console.time(`[EXTERNAL PUBLICATION] ${publication.id}`)

      // maxresdefault does not exist for every video, hqdefault does
      const thumbnailBuffer =
        (await getImageFromUrl(
          publication.id,
          getYouTubeThumbnailUrl(videoId, 'maxresdefault'),
        )) ??
        (await getImageFromUrl(
          publication.id,
          getYouTubeThumbnailUrl(videoId, 'hqdefault'),
        ))
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
    if (!imgResponse.ok) {
      return undefined
    }
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
