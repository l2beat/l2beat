import type { Response } from 'express'
import { dropMarkdownAlternateLink } from '~/server/markdown/markdownAlternate'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getNotFoundData } from './getNotFoundData'

/** Responds with the 404 page. Call it where a route decides the resource does not exist. */
export async function sendNotFoundPage(
  manifest: Manifest,
  render: RenderFunction,
  url: string,
  res: Response,
) {
  const data = await getNotFoundData(manifest, url)
  const html = await render(data, url)
  dropMarkdownAlternateLink(res)
  res.status(404).send(html)
}
