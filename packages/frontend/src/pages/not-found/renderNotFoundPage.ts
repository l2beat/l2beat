import type { Response } from 'express'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getNotFoundData } from './getNotFoundData'

/** Responds with the 404 page. Call it where a route decides the resource does not exist. */
export async function renderNotFoundPage(
  manifest: Manifest,
  render: RenderFunction,
  url: string,
  res: Response,
) {
  const data = await getNotFoundData(manifest, url)
  const html = await render(data, url)
  res.status(404).send(html)
}
